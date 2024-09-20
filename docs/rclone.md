---
aside: false
---

# Rclone

[Rclone](https://rclone.org/) is a command-line program to manage files on cloud storage, I use it to sync the files from my Google Drive to `~/originals` folder I mentioned in the other guide.

Since OpenWRT already have a ready-to-use package for Rclone, you can simply install it with:
```sh
opkg update
opkg install rclone
```
After the installation, go to [here](https://rclone.org/docs/) for guide to config Rclone.

In the begining, I use `rclone mount` to mount the Google Drive folder to `~/originals` but for some reasons, the installed multimedia manage apps can't scan/see those file although they are still listed in my `SSH` when I use `ls`. I guess this is because the mounted files not ready stored in my storage untill I actually read it.

After a bit research, I resolved to `rclone sync` instead. The command is quite simple:
```sh
rclone sync --interactive --progress SOURCE remote:DESTINATION
```
- --interactive: Rclone will ask for your input when it encoureted change.
- --progress: Rclone will show it progress.

So in my case, I use it like this:
- To sync file from Google Drive to my local:
```sh
rclone sync --interactive --progress Google:"folderA/folderB/folderC" ~/originals
```
- To sync file from Google Drive to my local:
```sh
rclone sync --interactive --progress ~/originals Google:"folderA/folderB/folderC"
```

By default, after you renamed a file, Rclone won't know if that file was renamed or just created/deleted. This cause Rclone upload that whole file to destination again. To avoid that, you can use:
```sh
rclone sync --track-renames --track-renames-strategy hash,size --interactive --progress ~/originals Google:"folderA/folderB/folderC" -v
```
- `--track-renames` is the trigger keyword.
- `--track-renames-strategy hash,size` is the strategy of the renames function, in this case, Rclone will compare our files between source and destination using hash and size.