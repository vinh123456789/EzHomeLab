# Install OS

## Install the Raspberry Pi OS

Why do I need a secondary OS, you asked? There are 2 reasons why I need it:
- To flash the primary OS into my SSD.
- Edit the configs in my primary OS.

There are many tool to flash an OS into removable devices, but in my case, I will use `Raspberry Pi Imager` which can be download via the following [link](https://www.raspberrypi.com/software/).

You can select the same options as me, the `Storage` option obviously will be your removeable device.
![Raspberry Pi Imager options](./assets/install-os/1.png)

Click `Edit Setting` when promted.
![Raspberry Pi Imager options](./assets/install-os/2.png)

The next window should be straightforward, I will only remind you to enable `SSH` in `Service` tab as this is required for what I'm aming to. When you enable this setting, it will ask you set up the username and password as well so let do that. You could also enable `Set hostname` option as this will help you connect to Raspi easier.
![Raspberry Pi Imager options](./assets/install-os/3.png)

Click `Save` and then `Yes` to proceed with flash.

Plug your USB into Raspi to boot the Raspi OS.

After you connected to the network, either via ethernet or wireless, enable `VNC` as it will help us go through this easier. To do this, `SSH` into our Raspi and open `raspi-config` via
```terminal
sudo raspi-config
```
Go to `Interface > VNC` and then select `Yes` when promted. You now can connect to Raspi with a VNC client such as `TigerVNC`.

Assign a static IP for it as we are intending to use it as a router. I will also give my primary OS the same IP later as it is easier to remember althought this is not required. You can do this either via GUI after connected via VNC or using terminal with:
```
sudo nano /etc/dhcpcd.conf
```
It my case, it would be `192.168.1.4`.

## Install the OpenWRT

[OpenWRT](https://openwrt.org/) is one of the most famous and actively developing open source router OS. It have a buildin Docker and a ready-to-use AdGuard package, they are some of the reasons why I choose this OS.

As of now, OpenWRT is only available as a pre-release snapshot for Raspi 5, you can access the `2024.09.12` snapshot via the following [link](https://github.com/mj22226/openwrt/releases/tag/bcm2712-6.6). We will use the `ext4-factory` file in our case.

The ones with `factory` mean it is for flash an different OS to the current one, while `sysupgrade` mean to replace the current OpenWRT OS to a different version.

As for `ext4` and `squashfs`, they are both popular filesystems on Linux system.
- ext4 is a regular Linux filesystem where you can write and read data from/to it, you can expand the storage with it.
- squashfs is a read-only compressed filesystem, suitable for embeded device with small storage. You can easily do a "restore factory" easy with this filesystem. If you want to try different configurations, packages, this is the one you need.

This Raspberry Pi OS should come with `Raspberry Pi Imager` already. We will use it to flash the `OpenWRT` into the SSD.