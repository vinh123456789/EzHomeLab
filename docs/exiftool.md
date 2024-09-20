# ExifTool

[ExifTool](https://exiftool.org/) is command-line application for reading, writing and editing metadata, it supports a wide variety of files.

## Installation

To install ExifTool in OpenWRT, head to this [link](https://exiftool.org/install.html#Unix) and following the first 2 steps, you can extract ExifTool to a folder such as `~/exiftool/`. After that:
- Install Perl and related modules with:
```sh
opkg update
opkg install perlbase-file
```
- You can now execute exiftool:
```sh
perl ~/exiftool/exiftool yourfile
```
- But typing all of that every time is quite troublesome, we can do better by create `.profile` file and add an alias to it:
```sh
nano .profile
```
```
alias exiftool="perl ~/exiftool/exiftool"
```
- The command is now much cleaner:
```sh
exiftool yourfile
```

## Usage

The above command already return the exif data of your file but it will show tag descriptions, if want to edit exif data, you have to know the tag names, which can be get with:
```sh
exiftool -s yourfile
```

Some photo editing app update the file with incorrect datetime format such as `2024:06:06 16:07:30 PM`, making the multimedia apps unable to parse it. I was able to fix it by remove the `PM`:
```sh
exiftool -ModifyDate="2024:06:06 16:07:30" -DateTimeOriginal="2024:06:06 16:07:30" -CreateDate="2024:06:06 16:07:30" yourfile
```

---

You can also return tags based on group:
```sh
exiftool -s -EXIF:all yourfile
```

Return tags in group which have tag name start with certain text:
```sh
exiftool -s -EXIF:OffsetTime* yourfile
```
```
OffsetTime                      : +08:00
OffsetTimeOriginal              : +08:00
OffsetTimeDigitized             : +08:00
```

And then edit them with:
```sh
exiftool -EXIF:OffsetTime*="+08:00" yourfile
```

---

Another usefull option is the `-if`:
```sh
exiftool -ext jpeg -if '$OffsetTimeOriginal eq "+07:00"' . -filename
```
- The `-ext` option make exiftool process `jpeg` file only
- The `-if` option then check the current folder `.` if there is any file have `OffsetTimeOriginal` value equal to `+07:00`.
- The `-filename` will return the file name of the matched files.

You can then extends it with:
```sh
exiftool -ext jpeg -if '$OffsetTimeOriginal eq "+07:00"' . -OffsetTime*="+08:00" -v
```
- All the tag name start with `OffsetTime` of the matched file will then be updated `+08:00`.
- The `-v` option will let you know which file was processed.
- It also create backup for each of the modified file.

To remove the backup file, use:
```sh
rm *.jpeg_original
```