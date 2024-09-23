# Self Hosted Photo And Video Solution

Previously, I stored my photos and videos in Google Drive, but let's be honest, it's only storage service. It's not a suitable tool for photo and video management; it lacks the ability to view files in fullscreen, let alone sort by Exif metadata. I tried Google Photos before, but I didn't really like it.

All the apps below are free, open-sourced, and actively developed. They also have iOS and Android apps that can connect to your server.

Since I'm using multiple apps at the same time, I mounted another volume to a folder such as `~/originals` to store original files. Also, don't forget to add the network in the previous guide into your `docker-compose.yml`.

## Immich

[Immich](https://immich.app/) comes with a similar UI to Google Photos. It also looks simple to use. However, I noticed that the processing speed when importing your files is quite slow. This may be because `Hardware Transcoding` is not yet supported for Raspi. I also don't like that when you close an opened photo/video, it reloads the webpage, which in turn reloads all the thumbnails and changes the webpage scroll position. The positive point is that people claim its AI recognition is very good.

[Install guide](https://immich.app/docs/install/docker-compose).

Notes on the installation:
- Not sure if this is a Docker bug in OpenWRT, but the `localtime` mount will fail because Docker tries to create a `localtime` folder instead. So we need to remove that volume in the `immich-server`. You can also mount the `original` folder here.
```yml
  immich-server:
    ...
    volumes:
        - /etc/localtime:/etc/localtime:ro # Remove this volume
        - ~/originals:/usr/src/app/originals # Mount to the originals
```
- Redis won’t start due to the warning on ARM64-COW-BUG. Disable it with:
```yml
    redis:
        ...
        command:
        - redis-server
        - --ignore-warnings
        - ARM64-COW-BUG
```

After everything is up and running, go to your Immich app via `192.168.1.4:2283` to set up the administration account.

You also need to set up the external libraries by clicking on your profile picture, selecting `Administration > External Libraries` and then clicking `Create Library` to create a new library. After that, click on the three dots and select `Edit Import Paths`, changing your path to:
```
/usr/src/app/originals
```

Click on the three dots and this time, click `Scan New Library Files`.

## Photoprism
[PhotoPrism](https://www.photoprism.app/) comes with a more professional-looking UI. It also auto-categorizes your files into groups, but its AI occasionally makes mistakes, so you have to manually edit them quite often. It also lacks a very important feature in my opinion, which is that you can’t select and delete a file via your keyboard, making the clean-up process much harder. Although you can overcome this with another third-party browser extension, I found this quite confusing as this is a very basic feature in any file management tool.

[Install guide](https://docs.photoprism.app/getting-started/docker-compose/#__tabbed_1_3).

Notes on the installion:
- Mount the `original` folder:
```yml
  photoprism:
    ...
    volumes:
        - "~/originals:/photoprism/originals" # change the originals folder
```
Another point I would also like to highlight is the `import` folder. If you put files into it and start the Import scan, PhotoPrism will move those files into the `originals` folder and categorize them in folders, thus changing your folder structure.

To start the scan, click on the `Library` item on the left menu.