// Swagger UI 配置
window.swaggerUIConfig = {
  url: "/swagger-current-full.json",
  dom_id: '#swagger-ui',
  deepLinking: true,
  presets: [
    SwaggerUIBundle.presets.apis,
    SwaggerUIStandalonePreset
  ],
  plugins: [
    SwaggerUIBundle.plugins.DownloadUrl
  ],
  layout: "StandaloneLayout",
  docExpansion: "list",
  defaultModelsExpandDepth: 2,
  defaultModelExpandDepth: 3,
  showExtensions: true,
  showCommonExtensions: true,
  filter: true,
  syntaxHighlight: {
    activate: true,
    theme: "agate"
  },
  tryItOutEnabled: true
};