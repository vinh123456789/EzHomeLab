# Docker

As Docker already installed in OpenWRT, you can find it easily in `LuCI` menu or if you perfer command, simply `SSH` into OpenWRT.

However, if you want containers connect to each others, it won't work by default.

To allowed it, you have to do the following steps:
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
- At the end of your first container `docker-compose.yml`, add the following network:
```yml
networks:
  default:
	name: dockerlannetwork
    external: true # set to true if you want to keep the network when do 'docker compose down'
    driver_opts:
      com.docker.network.bridge.name: docker1
```
- Add this to the end of subsequent containers `docker-compose.yml`:
```yml
networks:
  default:
    name: dockerlannetwork
    external: true
```