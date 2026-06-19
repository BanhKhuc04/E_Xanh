const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const validateImage = (file) => {
  if (!file) {
    return { isValid: false, error: 'Không tìm thấy file ảnh.' };
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Chỉ chấp nhận định dạng JPG, PNG, WEBP.' };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { isValid: false, error: `Dung lượng ảnh không được vượt quá ${MAX_SIZE_MB}MB.` };
  }

  return { isValid: true, error: null };
};
