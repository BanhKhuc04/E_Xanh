export const config = {
  matcher: '/(.*)',
};

export default async function middleware(request) {
  const acceptHeader = request.headers.get('accept') || '';
  
  if (acceptHeader.toLowerCase().includes('text/markdown')) {
    // Return markdown for agents
    return new Response(
`# E-XANH — Sử dụng điện thông minh, tiết kiệm điện

E-XANH là dự án hỗ trợ sinh viên sử dụng điện thông minh và tiết kiệm điện. Khám phá mẹo tiết kiệm, kiểm tra tiền điện và chia sẻ kinh nghiệm sống xanh.

## Tính năng nổi bật
- Công cụ kiểm tra tiền điện miễn phí
- Mẹo tiết kiệm điện hiệu quả
- Cộng đồng sống xanh

## Dành cho AI Agents & Developers
- [API Catalog](/.well-known/api-catalog)
- [MCP Server Card](/.well-known/mcp/server-card.json)
- [Agent Skills](/.well-known/agent-skills/index.json)
- [Agent Authentication (Auth.md)](/auth.md)
`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'x-markdown-tokens': '120',
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      }
    );
  }
}
