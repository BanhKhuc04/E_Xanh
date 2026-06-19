import { POST_IMAGE_VARIANTS, BANNER_IMAGE_VARIANTS, AVATAR_IMAGE_VARIANTS } from './imageVariants';

/**
 * Optimize and resize image using browser Canvas
 * @param {File} file - The original image file
 * @param {number} targetWidth - The maximum width to resize to
 * @param {number} quality - WebP quality (0 to 1)
 * @returns {Promise<{file: File, width: number, height: number, aspectRatio: string}>}
 */
export const optimizeImage = async (file, targetWidth, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Chỉ hỗ trợ tối ưu ảnh trên trình duyệt.'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;

        const width = Math.min(originalWidth, targetWidth);
        const ratio = width / originalWidth;
        const height = Math.round(originalHeight * ratio);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Lỗi khi tối ưu hóa ảnh.'));
              return;
            }
            
            const fileName = file.name ? file.name.replace(/\.[^/.]+$/, '.webp') : 'image.webp';
            const optimizedFile = new File([blob], fileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve({
              file: optimizedFile,
              width,
              height,
              aspectRatio: `${width}/${height}`,
            });
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Lỗi khi xử lý file ảnh.'));
    };
    reader.onerror = () => reject(new Error('Lỗi khi đọc file.'));
  });
};

/**
 * Generate multiple variants for an image
 */
export const generateImageVariants = async (file, variantGroup = 'post') => {
  let definitions = POST_IMAGE_VARIANTS;
  if (variantGroup === 'banner') definitions = BANNER_IMAGE_VARIANTS;
  if (variantGroup === 'avatar') definitions = AVATAR_IMAGE_VARIANTS;

  const results = {};
  const promises = Object.entries(definitions).map(async ([key, config]) => {
    const optimized = await optimizeImage(file, config.width);
    results[key] = optimized;
  });

  await Promise.all(promises);
  return results;
};
