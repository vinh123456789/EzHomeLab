---
aside: false
---

# Docker

As Docker is already installed in OpenWRT, you can find it easily in the `LuCI` menu or, if you prefer commands, simply `SSH` into OpenWRT.

However, if you want containers to connect to each other, it won't work by default.

To allow it, you have to do the following steps:
- Create a new bridge device via `Network > Interfaces > Devices`:
![device docker1](./assets/docker/1.png)
- Add an unmanaged interface in `LuCI`, covering the `docker1`:
![interface dockerlan](./assets/docker/2.png)
- Go to `Network > Firewall > General Settings`, edit the `docker` zone:
![docker zone](./assets/docker/3.png)
	- In `General Settings`:
	![docker general settings](./assets/docker/4.png)
	- In `Advanced Settings`:
	![docker advanced settings](./assets/docker/5.png)
- Go to `Network > Firewall > Traffic Rules`, add a new rule:
![docker traffic rules](./assets/docker/6.png)
- Create the following network:
```sh
docker network create -o "com.docker.network.bridge.name"="docker1" dockerlannetwork
```
- At the end of your `docker-compose.yml`, add the following network:
```yml
networks:
  default:
    name: dockerlannetwork
    external: true
```

Reference at [here](https://forum.openwrt.org/t/openwrt-with-docker-docker-compose-network/150228/4) and [here](https://forum.openwrt.org/t/how-to-configure-custom-docker-compose-network/197070/5).