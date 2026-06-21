import { Helmet } from 'react-helmet-async'

export default function SEO({ 
  title, 
  description, 
  image = 'https://e-xanh.vercel.app/og-image-v2.png', 
  url = 'https://e-xanh.vercel.app', 
  noIndex = false 
}) {
  const siteTitle = title ? `${title} | E-XANH` : 'E-XANH - Sử dụng điện thông minh, tiết kiệm điện'
  const siteDescription = description || 'E-XANH là nền tảng giúp sinh viên và người trẻ sử dụng điện thông minh, tiết kiệm chi phí và lan tỏa lối sống xanh. Khám phá mẹo tiết kiệm điện và công cụ kiểm tra tiền điện miễn phí.'

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={image} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}
    </Helmet>
  )
}
