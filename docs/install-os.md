# Install OS

Why do I need a secondary OS, you ask? There are 2 reasons why I need it:
- To flash the OpenWrt OS onto my SSD.
- To edit the configs in my OpenWrt OS, if needed.

There are many tools to flash an OS onto your devices, but in my case, I will use Raspberry Pi Imager, which can be downloaded via the following [link](https://www.raspberrypi.com/software/).

## Install the Raspberry Pi OS

Run Raspberry Pi Imager and select the same options as mine. The `Storage` option will obviously be your USB (or any removable device you want).
![Raspberry Pi Imager options](./assets/install-os/1.png)

Click `EDIT SETTINGS` when prompted.
![Raspberry Pi Imager - edit setting](./assets/install-os/2.png)

The next window should be straightforward. I only remind you to enable `SSH` in the `Service` tab as this is required for what we're aiming to do. When you enable this setting, it will ask you to set up the username and password as well, so let's do that.
![Raspberry Pi Imager - enable SSH](./assets/install-os/3.png)

Click `Save` and then `Yes` to proceed with the flash. After it is completed, plug your USB into the Raspi to boot the Raspberry Pi OS.

Check your Raspi's IP in your router and `SSH` into it. I also recommend you enable `VNC` as it will help you go through this more easily. To do this, `SSH` into your Raspi and open `raspi-config` via:
```sh
sudo raspi-config
```
Go to `Interface > VNC` and then select `Yes` when prompted. You can now connect to Raspi with a VNC client such as [TigerVNC](https://github.com/TigerVNC/tigervnc/releases).

The next step is to assign a static IP for it as we are intending to use it as a router. I will also give my OpenWrt OS the same IP later as it is easier to remember, although this is not required. You can do this either via GUI after connecting via VNC or editing the `dhcpcd` file with the following command:
```sh
sudo nano /etc/dhcpcd.conf
```
In my case, the static IP address is `192.168.1.4`.

## Install OpenWrt

[OpenWrt](https://openwrt.org/) is one of the most famous and actively developed open-source router operating systems. It is very lightweight, hence suitable for many embedded devices. It also supports many well-known packages, such as Docker and AdGuardHome, these are some of the reasons why I chose this OS.

There are two main ways to obtain OpenWrt firmware:
- Build via local Image Builder, the biggest reason for why we should choose this option is the ability to customize `ROOTFS_PARTSIZE` to allow installing more packages, which by default is around 100MB.
- Build and download via OpenWrt official site, this is the easiest option.

There are multiple types of OpenWrt image. The ones with `factory` mean it is for flashing the entire OS onto a device, while `sysupgrade` means to replace the current OpenWrt OS with a different version.

As for `ext4` and `squashfs`, they are both popular filesystems on Linux systems.
- `ext4` is a regular Linux filesystem where you can write and read data from/to it, and you can expand the storage with it.
- `squashfs` is a read-only compressed filesystem, suitable for embedded devices with small storage. You can easily do a factory restore with this filesystem. If you want to try different configurations and packages, this is the one you need.

We will use the `ext4-factory` file in our case.

### 1. Build via local Image Builder

In this guide, I will only show you how to do it with Windows WSL and a Debian distribution, as it has been proven to work.

Let's get started with the following command in `PowerShell`:
```powershell
wsl.exe --install Debian
```

After installation successfully and restarting your PC, look for and open the `WSL` command-line interface in your Windows.

Access [OpenWrt Firmware Selector page](https://firmware-selector.openwrt.org/) and search for Raspberry Pi version and click on the folder icon.

![Folder Icon](./assets/install-os/4.png)

Download the `openwrt-imagebuilder-*.tar.zst` file.
```bash
wget copied-link
```

Since `tar` already installed by default, let's install `zstd` as well.
```bash
sudo apt update && sudo apt install zstd
```

After the above steps, you can now follow the official guide via this [link](https://openwrt.org/docs/guide-user/additional-software/imagebuilder). I tried the `Temporary non-invasive solution` and it worked great.

Below is my command to create a custom image:
```bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin make image ROOTFS_PARTSIZE="1024" FILES="/mnt/d/OpenWrt/openwrtfiles" PACKAGES="apk-mbedtls base-files bcm27xx-gpu-fw bcm27xx-utils ca-bundle dnsmasq dropbear e2fsprogs firewall4 fstools kmod-fs-vfat kmod-nft-offload kmod-nls-cp437 kmod-nls-iso8859-1 kmod-sound-arm-bcm2835 kmod-sound-core kmod-usb-hid libc libgcc libustream-mbedtls logd mkf2fs mtd netifd nftables odhcp6c odhcpd-ipv6only partx-utils ppp ppp-mod-pppoe procd-ujail uci uclient-fetch urandom-seed cypress-firmware-43455-sdio brcmfmac-nvram-43455-sdio kmod-brcmfmac wpad-basic-mbedtls kmod-i2c-bcm2835 kmod-spi-bcm2835 kmod-i2c-brcmstb kmod-i2c-designware-platform kmod-spi-dw-mmio kmod-hwmon-pwmfan kmod-thermal kmod-usb-net-lan78xx kmod-usb-net-rtl8152 kmod-r8169 luci luci-app-attendedsysupgrade"
```

The custom image created with the above command changes 3 things:
- Increase `ROOTFS_PARTSIZE` to 1024MB, which allows more packages to be installed. The reason for 1024MB is because the official Image Builder server can only support root size of maximum 1024MB and we will use that server to upgrade our OpenWrt.
- Add all the folders and files in the provided path to the firmware, so that when OpenWrt is installed, we have our configs ready. The folder structure inside that path has to match exactly the path in OpenWrt, for example, the below script `99_setIPforOS` will be placed inside [UCI defaults](https://openwrt.org/docs/guide-developer/uci-defaults) and sets the OpenWrt IP after the first boot, the script content can be found in the second [section](#_2-build-and-download-via-openwrt-official-site).
```
Our folder structure: openwrtfiles > etc > uci-defaults > 99_setIPforOS

OpenWrt root: etc > uci-defaults
```
- Install provided packages, instead of the default ones. I simply copied the list from Firmware Selector page for this.

After it builds successfully, the files will be located in `bin`. You can use the following command to copy the file to drive D in Windows:
```sh
cp bin/targets/bcm27xx/bcm2712/openwrt-*-ext4-factory.img.gz /mnt/d/OpenWrt/
```

### 2. Build and download via OpenWrt official site

You can download the firmware by accessing the same firmware selector site [link](https://firmware-selector.openwrt.org/).

Open the link above and select your specific device and OpenWrt version. You can build your own image with pre-installed packages and configs by clicking `Customize installed packages and/or first boot script`.

You can also set a static IP for your OpenWrt device by pasting the following script into the `Script to run on first boot (uci-defaults)` textbox:
```sh
uci set network.lan.ipaddr="192.168.1.1/24"
uci commit network
```

Don't forget to click `REQUEST BUILD` and download the `FACTORY (EXT4)` file.

### 3. Flash OpenWrt

As Raspberry Pi OS comes with Raspberry Pi Imager already, we will use it to flash OpenWrt onto the SSD.

Transfer the obtained image to the Raspi OS and then `VNC` into your Raspi.

Open the Raspberry Pi Imager and repeat the same steps where you flashed the Raspberry Pi OS, only this time, in the `Operating System` option, scroll to the bottom and click `Use custom` to select your downloaded OpenWrt image and select your SSD in the `Storage` option, no customization settings needed.

When the flash is finished, shut down your Raspi and unplug your USB.

### 4. Set static IP address

*(You may skip this step if you already configured a static IP within your custom image)*

After completing the above steps, you need to set a static IP address for your OpenWrt Raspberry Pi/router. As mentioned earlier, our static IP address in OpenWrt will be the same as our Raspberry Pi OS, which is `192.168.1.4`. To do this, follow one of the options below:

#### Option 1

Since OpenWrt sets its IP address to `192.168.1.1` by default, you need to unplug the Ethernet cable between your modem and the rest of your network. Then, access `192.168.1.1` via your browser and change the OpenWrt IP address to `192.168.1.4` through `Network > Interfaces > Edit lan interface`. Save and apply your settings, and then plug in the Ethernet cable to reconnect your modem.

#### Option 2

If, for whatever reason, you can’t disconnect the connection from your modem, you can follow this option, but it is quite a hassle:

The next few steps are quite a hassle:
- Boot up the Raspi again.
- Wait for 1 - 2 minutes to allow OpenWrt to initialize system files and then force a hard shutdown by pressing and holding the physical power button or simply disconnecting the power plug.
- Plug in the USB with the Raspberry Pi OS into it again and boot up the Raspi.
- `SSH` into it again and list out the connected devices:
```sh
lsblk
```
- Note down your SSD ID and then mount it with the following command - `nvme0n1p2` is my SSD ID:
```sh
mount nvme0n1p2
```
- Change the OpenWrt static IP by editing `ipaddr` in `network`:
```sh
sudo nano /media/admin/rootfs/etc/config/network
```
```ssh-config
config interface 'lan'
        option device 'br-lan'
        option proto 'static'
        option ipaddr '192.168.1.4'
```

- Finally, shut down the Raspi with the same shutdown command above and unplug your USB.
- Boot up your Raspi again. Wait for a few minutes and access OpenWrt via your web browser using the same static IP you set above.

Leave the password blank and log in to OpenWrt via the web interface, which is called `LuCI`. Don't forget to change the default password afterward.

---

### Set Gateway and DNS

If your OpenWrt device is behind an ISP router like mine, you need to set the gateway IP and DNS (you can remove the DNS after AdGuard Home is set up) to allow your device to access the internet.

You can do this by going to `Network > Interfaces`, click `Edit` in the `lan`. Update `IPv4 gateway` and `Advanced Settings > Use custom DNS servers` accordingly.

---

### Disable DHCPv6

I also disabled `DHCPv6` in my OpenWrt as I haven't seen any real benefit of `IPv6` in my LAN and I can see many people having problems with it on the internet. This, of course, may change in the future.
- In `Network > Interfaces > Edit lan interface > Advanced Settings`: disable `IPv6 assignment length`.
- In `Network > Interfaces > Edit lan interface > DHCP Server > IPv6 Settings`: disable `RA-Service`, `DHCPv6-Service`, `NDP-Proxy` and `Designated Master`

[Reference](https://forum.OpenWrt.org/t/disable-ipv6-in-OpenWrt-lan-and-wan/199365/5).

In some cases, you will also need to disable `DHCPv6` in your internet router as well. Since I'm using a `Viettel` router, I simply access my router and disable it in `Administration > IPv6 Switch`.

---

### Optional

#### Set device static leases

If you have a habit of managing your network devices like me, you can set their static leases in OpenWrt `LuCI` via `Network > DHCP and DNS > Static Leases`.

The config file is located in `/etc/config/dhcp`, you can edit it either via `SSH` directly or via `SCP`.

I recommend you use `SFTP` to edit and backup the `dhcp` file as I find it easier to do so.

Install `SFTP` in OpenWrt by `SSH` into it and run:
```sh
apk update
apk add openssh-sftp-server
```

You are now able to connect to OpenWrt with an `SFTP` client such as [WinSCP](https://winscp.net/eng/download.php).

Restart `dnsmasq` after saving your config:
```sh
service dnsmasq restart
```