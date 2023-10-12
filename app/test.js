
// const { exec } = require('child_process');

// // Replace 'your-command-here' with the actual command you want to run
// const cmdCommand = 'dir';

// exec(cmdCommand, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.error(`stderr: ${stderr}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
// });







// const RedditImageFetcher = require("reddit-image-fetcher");
// var fs = require('fs');
// const Att  = require('audio-to-text');


 
// // baidu AI application configuration information
// const audio2text = require('audio2text');

// const params = {
//     url: 'https://storage.googleapis.com/assets.frapp.in/WhatsApp-Ptt-2020-10-16-at-6.02.22-PM.mp3',
//     runningLength:'short'
// }
// audio2text.recognize(params).then(transcript => {
// 	console.log(transcript)
// });

// const axios = require("axios");
// const meme = require('./bread');

// var tvd = require('twitter-video-downloader');
// tvd('https://twitter.com/uncensoredpromo/status/1570946915789074432')
//   .then(function(videoReadableBufferStream) {
//     fs.writeFile('2pac.mp4', videoReadableBufferStream, (err) => {
//       // throws an error, you could also catch it here
//       if (err) throw err;
  
//       // success case, the file was saved
//       console.log('Lyric saved!');
//   });
//   }
// );

// RedditImageFetcher.fetch({
//     type: 'meme'
// }).then(result => {
//     // console.log( result[0].image);
//     fs.writeFile('meme.js',
//      `module.exports= {link : '${result[0].image}'}`,
//       function (err) {
//         if (err) throw err;
//         // console.log(result[0].image);
//       });
// });

// fs.readFile('bread.json', 'utf8', function(err, data){
      
//     // Display the file content
//     console.log(data);
// });





//  async function vlad(){
// const meme = await axios('bread.json')
//         .then(res => res.data);
//         .catch(error=>{console.log("err")})
//         console.log(res.data);
  
// }
// vlad()
// console.log(meme.link())

// function vlad(){
//     const bred = 112
//     console.log(bred)
// }
// function vlada(){
// vlad()
// console.log(bred+1)
// }

// vlada()






const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();