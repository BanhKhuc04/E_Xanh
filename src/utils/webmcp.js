export function initWebMCP() {
  if (!navigator.modelContext) return;

  const toolDefinitions = [
    {
      name: 'navigateTo',
      description: 'Navigate to a specific page on the E-Xanh site (e.g., home, community, tips, electricity-check)',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path to navigate to (e.g. "/", "/cong-dong", "/meo-tiet-kiem", "/kiem-tra-tien-dien")'
          }
        },
        required: ['path']
      },
      execute: async (args) => {
        if (args.path) {
          window.location.href = args.path;
          return { success: true };
        }
        return { success: false, error: 'Path is required' };
      }
    },
    {
      name: 'getSiteInfo',
      description: 'Get information about the E-Xanh site and its main sections',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      execute: async () => {
        return {
          sections: [
            { name: 'Home', path: '/' },
            { name: 'Community', path: '/cong-dong' },
            { name: 'Tips', path: '/meo-tiet-kiem' },
            { name: 'Electricity Check', path: '/kiem-tra-tien-dien' }
          ]
        };
      }
    }
  ];

  try {
    if (typeof navigator.modelContext.provideContext === 'function') {
      // Some proposals use provideContext with an object
      navigator.modelContext.provideContext({ tools: toolDefinitions });
      console.log('[E-XANH] WebMCP tools registered via provideContext.');
    } else if (typeof navigator.modelContext.registerTool === 'function') {
      // The current WebMCP spec uses registerTool
      const controller = new AbortController();
      toolDefinitions.forEach(tool => {
        navigator.modelContext.registerTool(tool, { signal: controller.signal });
      });
      console.log('[E-XANH] WebMCP tools registered via registerTool.');
    }
  } catch (error) {
    console.error('[E-XANH] Failed to register WebMCP tools:', error);
  }
}

// Auto-initialize on load
if (typeof window !== 'undefined') {
  // Try immediately in case it's already ready
  initWebMCP();
  // And also on load
  window.addEventListener('load', initWebMCP);
}
