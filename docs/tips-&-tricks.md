# Tips & Tricks

To shutdown the `Raspberry Pi OS` you can double press the power button or use the following command:
```sh
sudo shutdown -h now
```

`OpenWRT` is not yet support the mentioned double press above, you can't shutdown via LuCI either so your only bet is:
```sh
poweroff
```
---

In the past, I encourtered the problem where my fan always running as full speed. Although you can monitor Raspi's temperature in LuCI but by used the following commands, I was able to found out the problem.
```sh
/usr/bin/vcgencmd measure_temp # return the current Raspi temperature
temp=56.5'C
```
```sh
cat /sys/devices/platform/cooling_fan/hwmon/*/fan1_input # return the current fan speed
3405
```
```sh
cat /sys/class/thermal/cooling_device0/cur_state # return the current fan state, usually, the highest state is 4
1
```
When I was dealing with this problem, I noticed the second command return `0` which is unusual especially while the fan is spinning at full speed. I suspect it may be because the fan is not connecting to Raspi properly and I was right because one of the Raspi fan pin got bent.