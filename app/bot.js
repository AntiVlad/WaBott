//Dependencies
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const ffmpeg = require('ffmpeg');
const express = require('express');
const app = express();
const fs = require('fs')
const RedditImageFetcher = require("reddit-image-fetcher");
const { createCanvas, loadImage } = require('canvas');


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
ping -- To test if the bot is active

pls help -- To bring up this message

pls sticker -- To turn an image/video to a sticker(send the image/video with the command as the caption or tag an image/video with the command)

pls sticker -c "caption" -- Turns an image to a sticker but you can add any caption of your choice together with the command 

pls delete --  To delete only my messages 

pls unsticker -- To turn a sticker back to an image 

pls join 'invite ink' -- To make me join a group with via invite link

pls dl "video link" -- To download videos from numerous websites like twitter (Tiktok and Instagram are exceptions)

pls everyone -- To tag everyone in a group (admins only)
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
    }else if(msg.body === '@2348157701961') {
		msg.reply('Hey');
        console.log(msg.body)
    }
});


client.on('message', async (msg) => {

const isAdmin = (member, chat) => {
    if (!chat.isGroup) return true; 
    const userid = member.slice(0, -5) 
    for (let i = 0; i < chat.participants.length; i++) {
        if (!!chat.participants[i].isAdmin && (chat.participants[i].id.user == userid)) 
            return true;
        }
    return false;
}
const chat = await msg.getChat(); 

if (msg.body.includes(`${prefix} dl`) || msg.body.includes(`Pls dl`) && !msg.hasQuotedMsg ) {
    function replace(o, s, r) {
        const regex = new RegExp(s, 'gi'); 
        return o.replace(regex, r);
    }    
    const string = msg.body;
    const s = "pls dl";
    const r = "";
    
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
                const cmdCommand = `yt-dlp --output vid1.mp4 --force-overwrites "${link}"`;
                const stdout = await runCommand(cmdCommand);
                console.log(`Command output: ${stdout}`);
                const media =  MessageMedia.fromFilePath('vid1.mp4');
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

if (msg.body.toLowerCase() === `${prefix} dl` && msg.hasQuotedMsg) {    
    try{
        const link = await msg.getQuotedMessage();
        console.log(link.body)        
        const { exec } = require('child_process');
        function runCommand(cmdCommand) {
            return new Promise((resolve, reject) => {
                exec(cmdCommand, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Error: ${error.message}`);
                    } else if (stderr) {
                        reject(`stderr: ${stderr}`);
                    } else {
                        resolve(stdout);
                    }
                });
            });
        }
        
        async function main() {
            try {
                const cmdCommand = `yt-dlp --output vid.mp4 --force-overwrites "${link.body}"`;
                const stdout = await runCommand(cmdCommand);
                console.log(`Command output: ${stdout}`);
        
                if (stdout.includes("ERROR")) {
                    throw new Error("Error: Ment");
                }
            } catch (error) {
                console.error(`Error executing command: ${error.message}`);
                throw error; // Re-throw the error to be caught in the outer try-catch block.
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

if(msg.body.toLowerCase() === `${prefix} everyone`){
    try{
        if(msg.hasQuotedMsg){
            const chat = await msg.getChat(); 
            if(isAdmin(msg.author,chat) || msg.author == "2347054450767@c.us" || msg.author == "2348173399072@c.us"){
                const quotedMsg = await msg.getQuotedMessage();
                await quotedMsg.reply(`*Everyone!*`, null, { 
                    mentions: chat.participants.map(({ id }) => id._serialized) 
                });
                console.log(`Tagged all  `);
            }else{
                msg.reply("You must be an admin to use this")
            }
        }
    }catch(e){
        console.log(e)
    }    
    }
if(msg.body === `..`){
    try{
        if(msg.hasQuotedMsg){
            const chat = await msg.getChat(); 
            if(isAdmin(msg.author,chat) || msg.author == "2347054450767@c.us" || msg.author == "2348173399072@c.us"){
                const quotedMsg = await msg.getQuotedMessage();
                await quotedMsg.reply(`*Everyone!*`, null, { 
                    mentions: chat.participants.map(({ id }) => id._serialized) 
                });
                console.log(`Tagged all  `);
            }else{
                msg.reply("You must be an admin to use this")
            }
        }
    }catch(e){
        console.log(e)
    }    
    }
if (msg.body.startsWith(`${prefix} everyone `)) {
    try {
        const message = msg.body.slice(13)
        console.log(message)
        msg.reply(`*${message}*`, null, { mentions: chat.participants.map(({ id }) => id._serialized) });
    } catch (e) {
        console.log(e)
    }
}
/*Sends a random meme from reddit via reddit-image-fetcher module */
if(msg.body.toLowerCase()===`${prefix} meme`){
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

/*Deletes a message sent by the bot account*/
if (msg.body.toLowerCase() === `${prefix} delete`) {
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
}else if(msg.body.toLowerCase() === `${prefix} sticker`){
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
}else if(msg.body.toLowerCase() === `${prefix} unsticker`){
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
}else if (msg.body.toLowerCase().startsWith(`${prefix} join `)) {
    try {
        const inviteCode = msg.body.split('/')[3]
        console.log(inviteCode)
        await client.acceptInvite(inviteCode);
        msg.reply('Joined the group!');
    } catch (e) {
        console.log(e)
        msg.reply(`link must be in this format 'https://chat.whatsapp.com/EUg3MA4iWe29dw9iUJxT1n' `);
    }
}else if(msg.body.toLowerCase() === `${prefix} resend`){
    if(msg.hasQuotedMsg) {
        try{
            const quotedMsg = await msg.getQuotedMessage();    
            const message = await quotedMsg.downloadMedia();
            msg.reply(message);
            console.log("Resent a media");    
        }catch(err){
            msg.reply("Media not found, Try resending it")
        }
    }}
    
    if(msg.body.toLowerCase().startsWith(`${prefix} sticker -c `)){
    try{
        const caption = msg.body.toLowerCase().replace(`${prefix} sticker -c`," ")
        const quotedMsg = await msg.getQuotedMessage();            
        const Waimage = await quotedMsg.downloadMedia();
        // console.log(Waimage)
    
        function saveImageToPath(imageData) {
            return new Promise((resolve, reject) => {
                if (!imageData || !imageData.mimetype.startsWith('image/')) {
                    reject(new Error('Invalid image data'));
                    return;
                }

                const fileName = `input.jpg`; 
                const filePath = `./${fileName}`; 

                fs.writeFile(filePath, imageData.data, 'base64', (error) => {
                    if (error) {
                        console.error('Error saving image:', error);
                        reject(error);
                    } else {
                        console.log('Image saved successfully:', fileName);
                        resolve(filePath);
                    }
                });
            });
        }

        // Usage

        await saveImageToPath(Waimage)
            .then((filePath) => {
                console.log('Image saved at:', filePath);
            })
            .catch((error) => {
                console.error('Error saving image:', error);
            });


        function addText(inputImagePath, outputImagePath, text) {
            return new Promise(async (resolve, reject) => {
                try {
                    
                    const image = await loadImage(inputImagePath);
                
                
                    const canvas = createCanvas(image.width, image.height);
                    const ctx = canvas.getContext('2d');
                
                    
                    ctx.drawImage(image, 0, 0);
                
                    
                    const maxFontSize = Math.min(image.width, image.height) * 0.1;
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;;
                    ctx.textAlign = 'center';

                    
                    const textMetrics = ctx.measureText(text);
                    const textWidth = textMetrics.width;

                    
                    const fontSize = Math.min(maxFontSize, (0.95 * canvas.width * maxFontSize) / textWidth);

                    
                    ctx.font = `${fontSize}px Corbel`;
                
                    
                    const x = canvas.width / 2;
                    const y = canvas.height - fontSize - 10; 
              
                    ctx.fillText(text, x, y);
                    ctx.strokeText(text, x, y);
                
                 
                    const stream = canvas.createPNGStream();
                    const out = require('fs').createWriteStream(outputImagePath);
                    stream.pipe(out);
                    out.on('finish', () => {
                        console.log('Image saved');
                        resolve(outputImagePath); 
                    });
                } catch (error) {
                    reject(error); 
                }
            });
        }
        
        // Usage
        const inputImage = './input.jpg';
        const outputImage = 'output.jpg';
        const text = caption;
        
        addText(inputImage, outputImage, text)
            .then((outputImagePath) => {
                console.log(`Image saved at: ${outputImagePath}`);
                const media = MessageMedia.fromFilePath('output.jpg');
                msg.reply(media, null, {stickerAuthor: 'Your fav bot :)' ,sendMediaAsSticker: true});
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }catch(e){
        console.log(e)
    }
   

    
        

}

})



