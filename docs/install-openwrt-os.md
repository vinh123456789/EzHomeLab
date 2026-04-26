# Install OpenWrt OS

[OpenWrt](https://openwrt.org/) is a lightweight, actively developed open-source router operating system. It is a great fit for embedded devices and supports many useful packages such as Docker and AdGuard Home.

There are two main ways to obtain OpenWrt firmware:
- Build via the local Image Builder. This is the preferred option when you want to customize `ROOTFS_PARTSIZE` and include your own files.
- Build and download from the OpenWrt official site. This is the easiest option.

OpenWrt images come in different types. `factory` images are used for a fresh install on a device, while `sysupgrade` images are used to upgrade an existing OpenWrt installation.

There are also two common filesystem types:
- `ext4` is a writable filesystem that supports expanding storage.
- `squashfs` is a read-only compressed filesystem, which is useful for small embedded devices and easier factory restore. If you want to experiment with different configurations and packages, `squashfs` is a good choice.

In this guide, we will use the `ext4-factory` image.

## 1. Build via local Image Builder

This guide shows how to use WSL with a Debian distribution on Windows.

Start in PowerShell:
```powershell
wsl.exe --install Debian
```

After installation completes and you restart your PC, open the Debian WSL terminal.

Visit the [OpenWrt Firmware Selector](https://firmware-selector.openwrt.org/), search for the Raspberry Pi target, and click the folder icon.

![Folder Icon](./assets/install-os/4.png)

Download the `openwrt-imagebuilder-*.tar.zst` file.
```bash
wget copied-link
```

`tar` is installed by default, but install `zstd` as well:
```bash
sudo apt update && sudo apt install zstd
```

Then follow the official Image Builder guide at [openwrt.org](https://openwrt.org/docs/guide-user/additional-software/imagebuilder). I used the `Temporary non-invasive solution` and it worked well.

Below is my command to create a custom image:
```bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin make image ROOTFS_PARTSIZE="1024" FILES="/mnt/d/OpenWrt/openwrtfiles" PACKAGES="apk-mbedtls base-files bcm27xx-gpu-fw bcm27xx-utils ca-bundle dnsmasq dropbear e2fsprogs firewall4 fstools kmod-fs-vfat kmod-nft-offload kmod-nls-cp437 kmod-nls-iso8859-1 kmod-sound-arm-bcm2835 kmod-sound-core kmod-usb-hid libc libgcc libustream-mbedtls logd mkf2fs mtd netifd nftables odhcp6c odhcpd-ipv6only partx-utils ppp ppp-mod-pppoe procd-ujail uci uclient-fetch urandom-seed cypress-firmware-43455-sdio brcmfmac-nvram-43455-sdio kmod-brcmfmac wpad-basic-mbedtls kmod-i2c-bcm2835 kmod-spi-bcm2835 kmod-i2c-brcmstb kmod-i2c-designware-platform kmod-spi-dw-mmio kmod-hwmon-pwmfan kmod-thermal kmod-usb-net-lan78xx kmod-usb-net-rtl8152 kmod-r8169 luci luci-app-attendedsysupgrade"
```

This command makes three important changes:
- It increases `ROOTFS_PARTSIZE` to 1024MB, allowing more packages to be installed. The official Image Builder server supports a maximum root size of 1024MB, and we will use that server for upgrades.
- It adds the files and folders from the provided path into the firmware. The structure inside the `openwrtfiles` folder must match the OpenWrt root structure. For example, `openwrtfiles/etc/uci-defaults/99_set-ip-for-os` becomes `/etc/uci-defaults/99_set-ip-for-os`.
- It installs the selected packages instead of the default set. I copied this package list from the Firmware Selector page.

After the build succeeds, the generated files are located in `bin`. Copy the image to drive `D` in Windows with:
```sh
cp bin/targets/bcm27xx/bcm2712/openwrt-*-ext4-factory.img.gz /mnt/d/OpenWrt/
```

## 2. Build and download via OpenWrt official site

Use the same OpenWrt Firmware Selector site to build or download firmware.

Select your device and OpenWrt version, then choose `Customize installed packages and/or first boot script` if you want to include custom packages and configuration.

You can set a static IP by pasting this into the `Script to run on first boot (uci-defaults)` field:
```sh
uci set network.lan.ipaddr="192.168.1.1/24"
uci commit network
```

Click `REQUEST BUILD` and download the `FACTORY (EXT4)` image.

## 3. Flash OpenWrt

Raspberry Pi OS includes Raspberry Pi Imager, so use it to flash OpenWrt onto the SSD.

Transfer the obtained image to Raspberry Pi OS, then connect via `VNC`.

Open Raspberry Pi Imager and repeat the same steps you used for Raspberry Pi OS. In the `Operating System` option, choose `Use custom` at the bottom and select your obtained OpenWrt image. In `Storage`, select the SSD. No extra customization is required.

When the flash completes, shut down the Raspi and unplug the USB.

## 4. Set static IP address

*(Skip this step if you already configured a static IP in your custom image.)*

After flashing, set a static IP for your OpenWrt Raspberry Pi/router. In this guide, we use the same IP as Raspberry Pi OS (`192.168.1.4`) for consistency, but that is optional.

Choose one of the options below:

#### Option 1

OpenWrt defaults to `192.168.1.1`. Disconnect the Ethernet cable between your modem and the rest of your network, then open `http://192.168.1.1` in your browser. Go to `Network > Interfaces > Edit lan interface`, set the IP address to `192.168.1.4`, save, and apply the changes. Reconnect the Ethernet cable afterward.

#### Option 2

If you cannot disconnect the modem, use this more involved method:
- Boot the Raspi and wait 1 - 2 minutes for OpenWrt to initialize.
- Force a hard shutdown by holding the power button or removing power.
- Insert the Raspberry Pi OS USB, boot the Raspi, and `VNC` into it.
- Edit the following file `/etc/config/network`:
```ssh-config
config interface 'lan'
        option device 'br-lan'
        option proto 'static'
        option ipaddr '192.168.1.4'
```
- Shut down the Raspi, remove the USB, and boot into OpenWrt again.
- Wait a few minutes, then access OpenWrt at the new IP.

Leave the password blank to log in to LuCI, then change the default password immediately.

## 5. Set Gateway and DNS

If your OpenWrt device is behind an ISP router, configure the gateway IP and DNS so it can access the internet. In `LuCI`, go to `Network > Interfaces`, edit `lan`, and update `IPv4 gateway` plus `Advanced Settings > Use custom DNS servers`.

## 6. Disable DHCPv6

I disabled `DHCPv6` on my OpenWrt device because it provided no real benefit on my LAN and can cause issues. This may change in the future.
- In `Network > Interfaces > Edit lan interface > Advanced Settings`: disable `IPv6 assignment length`.
- In `Network > Interfaces > Edit lan interface > DHCP Server > IPv6 Settings`: disable `RA-Service`, `DHCPv6-Service`, `NDP-Proxy`, and `Designated Master`.

[Reference](https://forum.OpenWrt.org/t/disable-ipv6-in-OpenWrt-lan-and-wan/199365/5).

Some routers also require disabling `DHCPv6` at the router level. On my `Viettel` router, I disable it in `Administration > IPv6 Switch`.

## 7. Optional

#### Set device static leases

If you prefer managing network devices precisely, set static leases in `LuCI` under `Network > DHCP and DNS > Static Leases`.

The config file is located at `/etc/config/dhcp`. You can edit it over `SSH` or with `SCP`.

I recommend using `SFTP` to edit because it is easier for file management.

Install the SFTP server on OpenWrt by SSHing into it and running:
```sh
apk update
apk add openssh-sftp-server
```

You can then connect to OpenWrt with an `SFTP` client such as [WinSCP](https://winscp.net/eng/download.php).

Restart `dnsmasq` after saving your config:
```sh
service dnsmasq restart
```
