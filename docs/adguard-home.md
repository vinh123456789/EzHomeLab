# AdGuard

## Introduction

To put it simple, AdGuard Home will help us block cross-domain ads and can encrypt your DNS requests via DoT and DoH, and in most case, bypass your ISP policy.

This is a simplified guide based on the official [OpenWRT AdGuard Home guide](https://openwrt.org/docs/guide-user/services/dns/adguard-home) and [this helpful post in OpenWRT forum](https://forum.openwrt.org/t/how-to-updated-2021-installing-adguardhome-on-openwrt-manual-and-opkg-method/113904/685)

## Install AdGuard Home in OpenWRT

SSH into OpenWRT and type the following commands:
```sh
opkg update
opkg install adguardhome
```

Then restart the service to allowed it auto boot:
```sh
service adguardhome enable
service adguardhome start
```

By default, the `LAN` interface will use `br-lan` as it device which is not need in our case, I would suggest you use change it to `eth0` via `LuCI`.
![OpenWRT interface](./assets/adguard-home/)

Run the following command via `SSH` which copied from OpenWRT AdGuard Home guide and edited by me.
```sh
NET_ADDR=$(/sbin/ip -o -4 addr list eth0 | awk 'NR==1{ split($4, ip_addr, "/"); print ip_addr[1] }')

# 1. Enable dnsmasq to do PTR requests.
# 2. Reduce dnsmasq cache size as it will only provide PTR/rDNS info.
# 3. Disable rebind protection. Filtered DNS service responses from blocked domains are 0.0.0.0 which causes dnsmasq to fill the system log with possible DNS-rebind attack detected messages.
# 4. Move dnsmasq to port 54.
# 5. Set Ipv4 DNS advertised by option 6 DHCP 
# 6. Set Ipv6 DNS advertised by DHCP
uci set dhcp.@dnsmasq[0].noresolv="0"
uci set dhcp.@dnsmasq[0].cachesize="1000"
uci set dhcp.@dnsmasq[0].rebind_protection='0'
uci set dhcp.@dnsmasq[0].port="54"
uci -q delete dhcp.@dnsmasq[0].server
uci add_list dhcp.@dnsmasq[0].server="${NET_ADDR}"

#Delete existing config ready to install new options.
uci -q delete dhcp.lan.dhcp_option
uci -q delete dhcp.lan.dns

# DHCP option 6: which DNS (Domain Name Server) to include in the IP configuration for name resolution
uci add_list dhcp.lan.dhcp_option='6,'"${NET_ADDR}" 
 
# DHCP option 3: default router or last resort gateway for this interface
uci add_list dhcp.lan.dhcp_option='3,'"${NET_ADDR}"

uci commit dhcp
/etc/init.d/dnsmasq restart
```

## Setup AdGuard Home

Go to `192.168.1.4:3000` to begin setup the AdGuard Home, you can also change your port here, in my case, I changed it to `8080`. Just remember to set the DNS server to `192.168.1.4` port `53`.

#### Allowed your router connect to the internet

After completed the above steps, your router won't be able to connect to the internet. You would need to edit the AdGuard Home `.yaml` file:
```sh
nano /etc/adguardhome.yaml
```

Add your router IP into `bind_hosts`:
```sh
dns:
  bind_hosts:
  - 127.0.0.1
  - 192.168.1.4
```

Restart the `adguardhome` service afterward:
```sh
service adguardhome stop
service adguardhome start
```

#### AdGuard Home configuration