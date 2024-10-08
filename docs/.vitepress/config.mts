import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "EzHomeLab",
  description: "A guide to setting up a basic homelab.",
  appearance: "force-dark",
  base: "/EzHomeLab/",
  themeConfig: {
    sidebar: [
      {
        // text: 'Examples',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Install OS', link: '/install-os' },
          { text: 'AdGuard Home', link: '/adguard-home' },
          { text: 'Docker', link: '/docker' },
          {
            items:
              [
                { text: 'Self Hosted Photo And Video Solution', link: '/self-hosted-photo-and-video-solution' }
              ]
          },
          { text: 'Rclone', link: '/rclone' },
          { text: 'ExifTool', link: '/exiftool' },
          { text: 'Tips & Tricks', link: '/tips-&-tricks' }
        ]
      },
    ],
    search: {
      provider: 'local'
    },
    outline: 'deep',
    // aside: false,
    // outline: 2,
    externalLinkIcon: true,
    footer: {
      message: 'Made with passion',
      copyright: 'Contributed by myself'
    }
  }
})
