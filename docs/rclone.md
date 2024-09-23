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

After the installation, go [here](https://rclone.org/docs/) for a guide to configure Rclone.

In the beginning, I used `rclone mount` to mount the Google Drive folder to `~/originals`, but for some reason, the installed multimedia management apps couldn’t scan/see those files although they were still listed in my `SSH` when I used `ls`. I guess this is because the mounted files are not really stored in my storage until I actually read them.

After a bit of research, I switched to `rclone sync` instead. The command is quite simple:
```sh
rclone sync --interactive --progress SOURCE remote:DESTINATION
```
- --interactive: Rclone will ask for your input when it encounters changes.
- --progress: Rclone will show its progress.

So in my case, I use it like this:
- To sync files from Google Drive to my local:
```sh
rclone sync --interactive --progress Google:"folderA/folderB/folderC" ~/originals
```
- To sync files from my local to Google Drive:
```sh
rclone sync --interactive --progress ~/originals Google:"folderA/folderB/folderC"
```

By default, after you rename a file, Rclone won’t know if that file was renamed or just created/deleted. This causes Rclone to upload the whole file to the destination again. To avoid that, you can use:
```sh
rclone sync --track-renames --track-renames-strategy hash,size --interactive --progress ~/originals Google:"folderA/folderB/folderC" -v
```
- `--track-renames` is the trigger keyword.
- `--track-renames-strategy hash,size` is the strategy of the renames function. In this case, Rclone will compare your files between the source and destination using hash and size.