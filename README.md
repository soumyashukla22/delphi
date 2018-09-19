# delphi

### Limitation
* Works only on chrome
* You need to have prime/netflix.hotstar accounts to be able to use them


### Installation
* Install a Google Chrome Extension: [Extension](https://chrome.google.com/webstore/detail/iframe-allow/gifgpciglhhpmeefjdmlpboipkibhbjg?hl=en)
* git clone this repository
* go to the repo folder and run the following commands
```
sh install.sh
delphi start
```
* Delphi will start a server in background and will be available at [localhost:3000](localhost:3000)
* Restart of laptop will result in killing the delphi server, so you will have to restart
* Other commands you can run:
    - restart
    - stop
    - status - An output like the following means your server is running
    ```
      PID TTY           TIME CMD
    90281 ttys003    0:00.67 node /usr/local/bin/nodemon start
    ```

