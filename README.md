# Dependencies
* Download NodeJs <a href="https://nodejs.org/dist/v21.1.0/node-v21.1.0-x64.msi" >Windows</a>
* Download NodeJs <a href="https://nodejs.org/dist/v21.1.0/node-v21.1.0-linux-x64.tar.xz" >Linux</a>
* Download Python <a href="https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe" >Windows</a>
* Run ```pip install yt-dlp```
# Install and Run

* ```git clone https://github.com/AntiVlad/WaBott.git```
* Or download zip file and extract
* Download <a href="https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip" >ffmpeg</a>
* Extract and paste ```ffmpeg.exe``` in the root folder ```/wabott```  (If you don't have ffmpeg the animated sticker function won't work)
* Run ```npm install``` <br>
  Because of an issue with <a href="https://github.com/pedroslopez/whatsapp-web.js/pull/2474" >Whatsapp-web.js</a> you'll have to go to ```/node_modules/whatsapp-web.js/src/Client.js``` and change Line 175 to ```const INTRO_IMG_SELECTOR = 'div[role=\'textbox\']';``` 
* ```npm start``` to start the bot

I will add alot more functionality to the bot soon :)

