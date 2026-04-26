# Install Raspberry Pi OS

Run Raspberry Pi Imager and select the same options shown here. For `Storage`, choose the USB drive or removable device you want to write to.
![Raspberry Pi Imager options](./assets/install-os/1.png)

Click `EDIT SETTINGS` when prompted.
![Raspberry Pi Imager - edit setting](./assets/install-os/2.png)

The next window should be straightforward. Enable `SSH` in the `Service` tab because it is required for this setup. When you enable SSH, set the username and password as requested.
![Raspberry Pi Imager - enable SSH](./assets/install-os/3.png)

Click `Save`, then `Yes` to start the flash. When it completes, plug the USB into the Raspi and boot Raspberry Pi OS.

Find your Raspi's IP address in your router, then `SSH` into it. I also recommend enabling `VNC` so the next steps are easier. `SSH` into your Raspi and run:
```sh
sudo raspi-config
```
Go to `Interface > VNC` and select `Yes` when prompted. You can then connect to the Raspi with a VNC client such as [TigerVNC](https://github.com/TigerVNC/tigervnc/releases).

The next step is assigning a static IP because the Raspi will act as a router. I use the same IP later for OpenWrt to keep things easy to remember, but that is optional. You can set the static IP via the GUI over `VNC` or by editing `/etc/dhcpcd.conf`directly:
```sh
sudo nano /etc/dhcpcd.conf
```

In my case, the static IP address is `192.168.1.4`.
