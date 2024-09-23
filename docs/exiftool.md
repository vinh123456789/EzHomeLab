<script setup>
const date = new Date();
</script>

# ExifTool

[ExifTool](https://exiftool.org/) is a command-line application for reading, writing, and editing metadata. It supports a wide variety of files.

## Installation

To install ExifTool in OpenWRT, head to this [link](https://exiftool.org/install.html#Unix) and follow the first 2 steps. You can extract ExifTool to a folder such as `~/exiftool/`. After that:
- Install Perl and related modules with:
```sh
opkg update
opkg install perlbase-file
```
- You can now execute exiftool:
```sh
perl ~/exiftool/exiftool yourfile
```
- But typing all of that every time is quite troublesome. We can do better by creating a `.profile` file and adding an alias to it:
```sh
nano .bash_aliases
```
```
alias exiftool="perl ~/exiftool/exiftool"
```
- The command is now much cleaner:
```sh
exiftool yourfile
```

## Usage

The above command already returns the exif data of your file, but it will show tag descriptions. If you want to edit exif data, you have to know the tag names, which can be obtained with:
```sh
exiftool -s yourfile
```

Some photo editing apps update the file with an incorrect datetime format such as `2024:06:06 16:07:30 PM`, making the multimedia apps unable to parse it. I was able to fix it by removing the `PM`:
```sh
exiftool -ModifyDate="2024:06:06 16:07:30" -DateTimeOriginal="2024:06:06 16:07:30" -CreateDate="2024:06:06 16:07:30" yourfile
```

---

You can also return tags based on group:
```sh
exiftool -s -EXIF:all yourfile
```

Return tags in a group which have tag names starting with certain text:
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

Another useful option is the `-if`:
```sh
exiftool -ext jpeg -if '$OffsetTimeOriginal eq "+07:00"' . -filename
```
- The `-ext` option makes exiftool process `jpeg` files only
- The `-if` option then checks the current folder `.` if there is any file with `OffsetTimeOriginal` value equal to `+07:00`.
- The `-filename` will return the file name of the matched files.

You can then extend it with:
```sh
exiftool -ext jpeg -if '$OffsetTimeOriginal eq "+07:00"' . -OffsetTime*="+08:00" -v
```
- All the tag names starting with `OffsetTime` of the matched files will then be updated to `+08:00`.
- The `-v` option will let you know which file was processed.
- It also creates a backup for each of the modified files.

To remove the backup files, use:
```sh
rm *.jpeg_original
```

---

To rename files based on their exif data, you can try the following command:
```sh
exiftool '-FileName<CreateDate' -d %Y%m%d_%H%M%S%%+c.%%e .
```
- `CreateDate` is the tag you want to base on.
- `%Y%m%d_%H%M%S` will write your file name based on date and time with a specific format, e.g: {{ date.getUTCFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + '_' + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2) }}.
- `%%` is used to escape the character `%` in the date format string, so `%+c` will add a copy number with a leading '_' if the file name already exists.
- `.%e` is the file extension.