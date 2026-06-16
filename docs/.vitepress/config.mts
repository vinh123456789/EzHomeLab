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
          {
            text: 'Install OS',
            link: '/install-os',
            items:
              [
                { text: 'Install the Raspberry Pi OS', link: '/install-raspberry-pi-os' },
                { text: 'Install OpenWrt OS', link: '/install-openwrt-os' }
              ]
          },
          { text: 'AdGuard Home', link: '/adguard-home' },
          {
            text: 'Recommend Packages',
            items:
              [
                { text: 'Rclone', link: '/rclone' },
                { text: 'ExifTool', link: '/exiftool' },
              ]
          },
          {
            text: 'Docker',
            link: '/docker',
            items:
              [
                { text: 'Expands Storage For Containers', link: '/docker-expands-storage-for-containers' },
                { text: 'Self Hosted Photo And Video Solution', link: '/self-hosted-photo-and-video-solution' }
              ]
          },
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
