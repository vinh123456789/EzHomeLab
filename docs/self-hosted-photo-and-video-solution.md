# Self Hosted Photo And Video Solution

Previously, I store my photo and video in Google Drive but let be honest, it only a storage, it not a suitetable tool for photo and video management, it lack the ability to view the file in fullscreen, let alone sort by Exif metadata. I tried Google Photo before but I don't really like it.

All the app below is free, open-sourced and on actively development. They also have iOS and Android app that can connect to your server.

Since I'm using multiple apps at the same time, I mounted another volume to a folder such as `~/originals` to store original files. Also, don't forget to add the network in the previous guide into your `docker-compose.yml`.

## Immich

[Immich](https://immich.app/) come with a similiar UI with Google Photo, it also look simple to use. However, I noticed that the processing speed when import your file is quite slow, its may because the `Hardware Transcoding` is not yet support for Raspi. I also don't like the way when close a opened a photo/video, it reload the webpage, in turn reload all the thumbnail and change the webpage scroll position. The positive point is people claim it AI recognition is very good.

[Install guide](https://immich.app/docs/install/docker-compose).

Notes on the installion:
- Not sure if this is a Docker bug in OpenWRT but the `localtime` mount will be failed due to Docker try to create `localtime` folder instead. So we need to remove that volume in the `immich-server`. You can also mount the `original` folder here.
```yml
  immich-server:
    ...
    volumes:
        - /etc/localtime:/etc/localtime:ro # Remove this volume
        - ~/originals:/usr/src/app/originals # Mount to the originals
```
- Redis won't start due to the warining on `ARM64-COW-BUG`, disable it with:
```yml
    redis:
        ...
        command:
        - redis-server
        - --ignore-warnings
        - ARM64-COW-BUG
```

After the everything up and running, go to your Immich app via `192.168.1.4:2283` to setup the administration account.

You also need to setup the external libraries by click on your profile picture, select `Administration > External Libraries` and then click `Create Library` to create a new library. After that, click on the three dot and select `Edit Import Paths`, change your path to:
```
/usr/src/app/originals
```

Click on the three dot and this time, click `Scan New Library Files`.

## Photoprism
[PhotoPrism](https://www.photoprism.app/) come with a more professional looking UI, it also auto categorized your files into group, but it AI occasionly make mistakes thus you have to manual edit them quite often. It also lack a very important feature in my opinion which is you can't select and delete a file via your keyboard, making the clean-up process much harder, although you can overcome this with another third-party brower extionsion but I found this quite confused as this is a very basic feature in any file management tool.

[Install guide](https://docs.photoprism.app/getting-started/docker-compose/#__tabbed_1_3).

Notes on the installion:
- Mount the `original` folder:
```yml
  photoprism:
    ...
    volumes:
        - "~/originals:/photoprism/originals" # change the originals folder
```
Another point I also would like to highlight is the `import` folder, if you put files into it and start the the Import scan, Photoprism will move those files into the `originals` folder and catagorized them in folders thus change your folder structure.

To start the scan, click on the `Library` item on the left menu.