import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "EzHomeLab",
  description: "A guide to setting up a basic homelab.",
  appearance: "force-dark",
  themeConfig: {
    sidebar: [
      {
        // text: 'Examples',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Install OS', link: '/install-os' },
          { text: 'Tips & Tricks', link: '/tips-&-tricks' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
  }
})
