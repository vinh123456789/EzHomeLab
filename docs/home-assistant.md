---
aside: false
---

# Home Assistant inside Docker

Home Assistant (`HASS`) is a home automation platform that can manage your devices and act as a central control system. It can run inside Docker as a stable, easy-to-manage service.

## Install HASS

SSH into your OpenWrt device and run:

```sh
docker run -d \
  --name homeassistant \
  --privileged \
  --restart=unless-stopped \
  -e TZ=MY_TIME_ZONE \
  -v /mnt/hassconfig:/config \
  -v /run/dbus:/run/dbus:ro \
  --network=host \
  ghcr.io/home-assistant/home-assistant:stable
```

To update, remove the existing `homeassistant` container and run the same command again.

## Home Assistant Community Store

Home Assistant Community Store (`HACS`) is a custom integration that provides a UI for managing custom integrations and frontend elements in Home Assistant.

### WebRTC camera

If you integrate cameras with `HASS`, this custom card can reduce streaming latency. After adding it to your dashboard, use the following example:

```yaml
type: custom:webrtc-camera
url: >-
  rtsp://username:password@ip/hostname:port/Streaming/Channels/101
mode: webrtc
title: Title
```

### External network

If you want to access Home Assistant from outside your LAN, create `go2rtc.yaml` in your HASS config folder. With the Docker command above, that folder is `/mnt/hassconfig`.

```yaml
webrtc:
  listen: ":8555"
  candidates:
    - IP or DDNS hostname:8555
    - 192.168.1.4:8555
```

Restart `HASS` afterward.