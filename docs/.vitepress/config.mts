import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "EzHomeLab",
  description: "A guide to setting up a basic homelab.",
  themeConfig: {  
    sidebar: [
      {
        // text: 'Examples',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Install OS', link: '/install-os' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
  }
})
