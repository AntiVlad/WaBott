//Dependencies
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const ffmpeg = require('ffmpeg');
const express = require('express');
const app = express();
const RedditImageFetcher = require("reddit-image-fetcher");
const youtubedl = require('youtube-dl-exec')
//

//Qr-code and Authentication scripts
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
  ffmpegPath: '../ffmpeg.exe',
  puppeteer: {
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
}
});

app.get('/', (req, res) => {
  res
    .status(200)
    .send(`Server is Active
    waiting for client to start`)
    .end();
});
 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is Active 
waiting for client to start.`);
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});
client.initialize();
//

const prefix = 'pls' //Command prefix 

const help=`Commands supported  are...
ping 

pls help

pls sticker 

pls delete 

pls unsticker

pls join 'invite ink' 

pls dl "video link"
` // Help content   



//Basic commands
client.on('message', msg => {
	if(msg.body === 'Ping'){
        msg.reply('pong');  
        console.log(msg.body)
    }else if(msg.body === 'ping'){
        msg.reply('pong');
        console.log(msg.body)

	}else if(msg.body === `${prefix} help`) {
		msg.reply(help);
        console.log(msg.body)

    }else if(msg.body === 'Pls help') {
		msg.reply(help);
        console.log(msg.body)

    }else if(msg.body === 'pls') {
		msg.reply('No');
        console.log(msg.body)

    }else if(msg.body === 'Pls') {
		msg.reply('No');
        console.log(msg.body)

    }else if(msg.body === 'Deez') {
		msg.reply('Nutz');
        console.log(msg.body)
    }
});


client.on('message', async (msg) => {
const chat = await msg.getChat(); 
if (msg.body.includes(`${prefix} dl`) || msg.body.includes(`Pls dl`) && !msg.hasQuotedMsg ) {
    function replace(o, s, r) {
        const regex = new RegExp(s, 'gi'); // 'gi' stands for global and case-insensitive
        return o.replace(regex, r);
    }    
    const string = msg.body;
    const s = "pls dl";
    const r = " ";
    
    const link = replace(string, s, r);
    try {
        console.log(link)        
        const { exec } = require('child_process');
        function runCommand(cmdCommand) {
            return new Promise((resolve, reject) => {
                exec(cmdCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    reject(`stderr: ${stderr}`);
                    return;
                }
                resolve(stdout);
                });
            });
        }
        async function main() {
            try {
                const cmdCommand = `yt-dlp --output vid.mp4 --force-overwrites ${link}`;
                const stdout = await runCommand(cmdCommand);
                console.log(`Command output: ${stdout}`);
                const media =  MessageMedia.fromFilePath('vid.mp4');
                await msg.reply(media);
            } catch (error) {
                console.error(`Error executing command: ${error}`);
            }
        }
        await main();
        
    }catch (e) {
        console.log(e)
        msg.reply(`Welp, Error`);
    }
}

if (msg.body === `${prefix} dl` && msg.hasQuotedMsg) {    
    try{
        const link = await msg.getQuotedMessage();
        console.log(link.body)        
        const { exec } = require('child_process');
        function runCommand(cmdCommand) {
            return new Promise((resolve, reject) => {
                exec(cmdCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    reject(`stderr: ${stderr}`);
                    return;
                }
                resolve(stdout);
                });
            });
        }
        async function main() {
        try {
            const cmdCommand = `yt-dlp --output vid.mp4 --force-overwrites ${link.body}`;
            const stdout = await runCommand(cmdCommand);
            console.log(`Command output: ${stdout}`);
        } catch (error) {
            console.error(`Error executing command: ${error}`);
        }
        }
        await main();
        const media =  MessageMedia.fromFilePath('vid.mp4');
        await msg.reply(media);
    }catch (e) {
        console.log(e)
        msg.reply(`Welp, Error`);
    }
}

if(msg.body === `${prefix} everyone`){
    if(msg.hasQuotedMsg){ 
        const chat = await msg.getChat(); 
        const quotedMsg = await msg.getQuotedMessage();
        await quotedMsg.reply(`${quotedMsg.body}`, null, {
            mentions: chat.participants
        });
        console.log(`Tagged all  `);
    }else{
        const chat = await msg.getChat(); 
        msg.reply('*Everyone!*', null, {
            mentions: chat.participants
        });
        console.log(`Tagged all `);
    }
}
if (msg.body.startsWith(`${prefix} everyone `)) {
    try {
        const message = msg.body.slice(13)
        console.log(message)
        msg.reply(`*${message}*`, null, {
            mentions: chat.participants
        });
    } catch (e) {
        console.log(e)
    }
}
/*Sends a random meme from reddit via reddit-image-fetcher module */
if(msg.body===`${prefix} meme`){
    try{            
        RedditImageFetcher.fetch({
            type: 'meme'
        }).then(async result => {
            console.log(result[0].image)
            const media = await MessageMedia.fromUrl(result[0].image);
            chat.sendMessage(media);});
    }catch(error){
        console.log(error)
    }
}

const isAdmin = (member, chat) => {
    if (!chat.isGroup) return true; 
    const userid = normalize(member) 
    /* --- Actual admin check --- */
    for (let i = 0; i < chat.participants.length; i++) {
        if (!!chat.participants[i].isAdmin && (chat.participants[i].id.user == userid)) 
            return true;
    }
    return false;
}

if(msg.body === "test"){
    if(isAdmin(msg.body,chat )){
        msg.reply("worked")
    }
}

/*Deletes a message sent by the bot account*/
if (msg.body === `${prefix} delete`) {
    if (msg.hasQuotedMsg) {
        try{
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                await quotedMsg.delete(true);                    
            } else {
                msg.reply('No');
            }
        }catch (error) { 
                console.error(error)
                msg.reply("No bitch!")
            }
    }
    /*Turns an image,video or gif to a sticker*/
}else if(msg.body === `${prefix} sticker`){
    if(msg.hasMedia) {
        try{
            const sticker = await msg.downloadMedia();      
            msg.reply(sticker, null, {stickerAuthor: 'Your fav bot :)' ,sendMediaAsSticker: true});
            console.log("Sent a sticker");    
        }catch(err){msg.reply("Media not found, Try resending it")
    }

    }else
    if(msg.hasQuotedMsg){
        try{

            const quotedMsg = await msg.getQuotedMessage();            
            const sticker = await quotedMsg.downloadMedia();
            msg.reply(sticker, null, {stickerAuthor: 'Your fav bot :)' , sendMediaAsSticker: true});
            console.log("Sent a sticker");  
        }catch(err){   
            console.log(err)
            msg.reply("Media not found, Try resending it")
        }

    }else{
        msg.reply("You have to quote a media message or send a media with the command as its caption")
    }
    /*Turns a sticker to an image */
}else if(msg.body === `${prefix} unsticker`){
    if(msg.hasQuotedMsg){
        try{
            const quotedMsg = await msg.getQuotedMessage();
            const unsticker = await quotedMsg.downloadMedia();
            
            msg.reply(unsticker);
            console.log("unstickered");
        }catch(err){    
            console.log(err)
            msg.reply("Media not found, Try resending it")
        }

    }else{
        msg.reply("You have to quote a sticker")
    }
    /*Makes the bot account join a group*/
}else if (msg.body.startsWith(`${prefix} join `)) {
    try {
        const inviteCode = msg.body.split('/')[3]
        console.log(inviteCode)
        await client.acceptInvite(inviteCode);
        msg.reply('Joined the group!');
    } catch (e) {
        console.log(e)
        msg.reply(`link must be in this format 'https://chat.whatsapp.com/EUg3MA4iWe29dw9iUJxT1n' `);
    }
}
})



