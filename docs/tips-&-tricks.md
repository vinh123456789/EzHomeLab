# Tips & Tricks

#### How to Shutdown

To shut down the Raspberry Pi OS, you can double-press the power button or use the following command:
```sh
sudo shutdown -h now
```

OpenWRT does not yet support the mentioned double press above. You can’t shut down via `LuCI` either, so your only option is:
```sh
poweroff
```
---

#### OpenWRT Temperature

In the past, I encountered a problem where my fan was always running at full speed. Although you can monitor the Raspberry Pi’s temperature in `LuCI`, by using the following commands, I was able to find out the problem.
```sh
/usr/bin/vcgencmd measure_temp # returns the current Raspi temperature
> temp=56.5'C
```
```sh
cat /sys/devices/platform/cooling_fan/hwmon/*/fan1_input # returns the current fan speed
> 3405
```
```sh
cat /sys/class/thermal/cooling_device0/cur_state # returns the current fan state, usually, the highest state is 4
> 1
```
When I was dealing with this problem, I noticed the second command returned `0`, which is unusual, especially while the fan is spinning at full speed. I suspected it might be because the fan was not connected to the Raspi properly, and I was right because one of the Raspi fan pins was bent.

---

#### Scheduled Tasks

You can set up scheduled tasks with cron jobs in OpenWRT via `System > Scheduled Tasks` in `LuCI`. For example, the script below will restart OpenWRT every Monday at 05:00.
```
* 5 * * 1 sleep 70 && touch /etc/banner && reboot
```

[Reference](https://openwrt.org/docs/guide-user/base-system/cron#periodic_reboot).