# Usage:

```
$ yarn # install dependencies
$ ts-node app.ts # start server
# or
$ yarn start # start development server 
```

to insert strings:

create a .txt file with each new string on its own line, and nothing else.
Then, run the insert script:
```
$ python3 insert.py [filename.txt]
```

## Setup

If you do not have nodejs/npm/yarn set up:

- Install NodeJS. Installers for windows and mac can be found [here](https://nodejs.org/en/download/).
  - NodeJS installation is more complicated on linux and depends on the distro, so it is recommended to google what the best way to install it on your system is. Note that on ubuntu NodeJS is available through apt, though it is a very outdated version that may not be reliable.
- Install yarn:
```
npm install -g yarn
```
This may require `sudo` depending on the platform.

At this point you should be able start the server with the commands listed [above](#usage)
