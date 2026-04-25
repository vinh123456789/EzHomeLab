# Install OS

Why do I need a secondary OS, you ask? There are 2 reasons why I need it:
- To flash the OpenWrt OS onto my SSD.
- To edit the configs in my OpenWrt OS, if needed.

There are many tools to flash an OS onto your devices, but in my case, I will use Raspberry Pi Imager, which can be downloaded via the following [link](https://www.raspberrypi.com/software/).

## Install the Raspberry Pi OS

Run Raspberry Pi Imager and select the same options as me. The `Storage` option will obviously be your USB (or any removable device you want).
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

## Install the OpenWrt

[OpenWrt](https://OpenWrt.org/) is one of the most famous and actively developed open-source router operating systems. It is very lightweight, hence suitable for many embedded devices. It also supports many well-known packages, such as Docker and AdGuardHome, these are some of the reasons why I chose this OS.

There are two main ways to obtain OpenWrt firmware:
- Build via local Image Builder, the biggest reason for why we should choose this option is the ability to customize `ROOTFS_PARTSIZE`, which by default is around 100mb.
- Build and download via OpenWrt official site, this is the easiest option.

You can download the firmware using the following [link](https://firmware-selector.OpenWrt.org/) or via `wget` using the guide that follows. We will use the `ext4-factory` file in our case.

The ones with `factory` mean it is for flashing the entire OS onto a device, while `sysupgrade` means to replace the current OpenWrt OS with a different version.

As for `ext4` and `squashfs`, they are both popular filesystems on Linux systems.
- `ext4` is a regular Linux filesystem where you can write and read data from/to it, and you can expand the storage with it.
- `squashfs` is a read-only compressed filesystem, suitable for embedded devices with small storage. You can easily do a factory restore with this filesystem. If you want to try different configurations and packages, this is the one you need.

As Raspberry Pi OS comes with Raspberry Pi Imager already, we will use it to flash OpenWrt onto the SSD.

Open the link above and select your specific device and OpenWrt version. You can build your own image with pre-installed packages and configs by clicking `Customize installed packages and/or first boot script`.

You can also set a static IP for your OpenWrt device by pasting the following script into the `Script to run on first boot (uci-defaults)` textbox:
```sh
uci set network.lan.ipaddr="192.168.1.1/24"
uci commit network
```

Don't forget to click `REQUEST BUILD`.

Once the build is complete, right-click the `FACTORY (EXT4)` button to copy the download link. Then, `VNC` into your Raspi and run the following command:
```sh
wget copied-link
```
Open the Raspberry Pi Imager and repeat the same steps where you flashed the Raspberry Pi OS, only this time, in the `Operating System` option, scroll to the bottom and click `Use custom` to select your downloaded OpenWrt image and select your SSD in the `Storage` option.

When asked to apply OS customization settings, choose `No`.

When the flash is finished, shut down your Raspi via:
```sh
sudo shutdown -h now
```

Then unplug your USB.

---

### Set static IP address

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

Leave the password blank and log in to OpenWrt via the web interface, which is called `LuCI`. Don't forget to change the default password in `System > Router Password` and enable `SSH` in `System > SSH Access`.

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

#### Set Device Static Leases

If you have a habit of managing your network devices like me, you can set their static leases in OpenWrt `LuCI` via `Network > DHCP and DNS > Static Leases`.

You can also do it via `SSH`:
```sh
nano /etc/config/dhcp
```

I recommend you use `SFTP` to edit and backup the `dhcp` file as I find it easier to do so.

Install `SFTP` in OpenWrt:
```sh
apk update
apk add openssh-sftp-server
```

You are now able to connect to OpenWrt with an `SFTP` client such as [WinSCP](https://winscp.net/eng/download.php).

Restart `dnsmasq` after saving your config:
```sh
service dnsmasq restart
```