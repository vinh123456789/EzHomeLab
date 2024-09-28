# Install OS

Why do I need a secondary OS, you ask? There are 2 reasons why I need it:
- To flash the primary OS onto my SSD.
- To edit the configs in my primary OS.

There are many tools to flash an OS onto your devices, but in my case, I will use Raspberry Pi Imager, which can be downloaded via the following [link](https://www.raspberrypi.com/software/).

## Install the Raspberry Pi OS

Run Raspberry Pi Imager and select the same options as me. The `Storage` option will obviously be your USB (or any removable device you want).
![Raspberry Pi Imager options](./assets/install-os/1.png)

Click `EDIT SETTINGS` when promted.
![Raspberry Pi Imager - edit setting](./assets/install-os/2.png)

The next window should be straightforward. I only remind you to enable `SSH` in the `Service` tab as this is required for what we're aiming to do. When you enable this setting, it will ask you to set up the username and password as well, so let's do that.
![Raspberry Pi Imager - enable SSH](./assets/install-os/3.png)

Click `Save` and then `Yes` to proceed with the flash. After it is completed, plug your USB into the Raspi to boot the Raspberry Pi OS.

Check your Raspi's IP in your router and `SSH` into it. I also recommend you enable `VNC` as it will help you go through this easier. To do this, `SSH` into your Raspi and open `raspi-config` via:
```sh
sudo raspi-config
```
Go to `Interface > VNC` and then select `Yes` when promted. You now can connect to Raspi with a VNC client such as [TigerVNC](https://github.com/TigerVNC/tigervnc/releases).

The next step is to assign a static IP for it as we are intending to use it as a router. I will also give my primary OS the same IP later as it is easier to remember, although this is not required. You can do this either via GUI after connecting via VNC or edit the `dhcpcd` file with the following command:
```sh
sudo nano /etc/dhcpcd.conf
```
It my case, the static IP address is `192.168.1.4`.

## Install the OpenWRT

[OpenWRT](https://openwrt.org/) is one of the most famous and actively developed open-source router OS. It has a built-in Docker and a ready-to-use AdGuard package, these are some of the reasons why I chose this OS.

As of now, OpenWRT is only available as a pre-release snapshot for Raspi 5. You can access the `2024.09.12` snapshot via the following [link](https://github.com/mj22226/openwrt/releases/tag/bcm2712-6.6). We will use the `ext4-factory` file in our case.

The ones with `factory` mean it is for flashing a different OS to OpenWRT, while `sysupgrade` means to replace the current OpenWRT OS with a different version.

As for `ext4` and `squashfs`, they are both popular filesystems on Linux systems.
- `ext4` is a regular Linux filesystem where you can write and read data from/to it, and you can expand the storage with it.
- `squashfs` is a read-only compressed filesystem, suitable for embedded devices with small storage. You can easily do a factory restore with this filesystem. If you want to try different configurations and packages, this is the one you need.

As Raspberry Pi OS comes with Raspberry Pi Imager already, we will use it to flash OpenWRT onto the SSD.

Download the OpenWRT image with:
```sh
wget https://github.com/mj22226/openwrt/releases/download/bcm2712-6.6/openwrt-bcm27xx-bcm2712-rpi-5-ext4-factory.img.gz
```
`VNC` into your Raspi and open Raspberry Pi Imager. Repeat the same steps where you flashed the Raspberry Pi OS, only this time, in the `Operating System` option, scroll to the bottom and click `Use custom` to select your downloaded OpenWRT image and select your SSD in the `Storage` option.

When asked to apply OS customization settings, choose `No`.

When the flash is finished, shutdown your Raspi via:
```sh
sudo shutdown -h now
```

The next few steps are quite a hassle:
- Unplug your USB and boot up the Raspi again.
- Wait for a few minutes to allow OpenWRT to initialize system files and then force a hard shutdown by pressing and holding the physical power button or simply disconnecting the power plug.
- Plug in the USB with the Raspberry Pi OS into it again and boot up the Raspi.
- `SSH` into it again and list out the connected devices:
```sh
lsblk
```
- Note down your SSD ID and then mount it with the following command - `nvme0n1p2` is my SSD ID:
```sh
mount nvme0n1p2
```
- Change the OpenWRT static IP by editing `ipaddr` in `network`:
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
- Boot up your Raspi again. Wait for a few minutes and access OpenWRT via your web browser using the same static IP you set above.

Leave the password blank and log in to OpenWRT via the web interface, which is called `LuCI`. Don't forget to change the default password in `System > Router Password` and enable `SSH` in `System > SSH Access`.

### Set Gateway and DNS

If your OpenWRT devices is behind ISP router like me, you need to set gateway IP and DNS to allowed your devices access internet.

You can do this by go to `Network > Interfaces`, click `Edit` in the `lan`.

### Disable DHCPv6

I also disabled `DHCPv6` in my OpenWRT as I haven't seen any real benefit of `IPv6` in my LAN and I can see many people having problems with it on the internet. This, of course, may change in the future.
- Disable `RA-Service`, `DHCPv6-Service`, `NDP-Proxy` and `Designated Master` in `Network > Interfaces > Edit lan interface > DHCP Server > IPv6 Settings`

- Disable `IPv6 assignment length` in `Network > Interfaces > Edit lan interface > Advanced Settings`

[Reference](https://forum.openwrt.org/t/disable-ipv6-in-openwrt-lan-and-wan/199365/5).

In some cases, you will also need to disable `DHCPv6` in your internet router as well. Since I'm using a `Viettel` router, I simply access my router and disable it in `Administration > IPv6 Switch`.