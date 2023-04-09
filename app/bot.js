//Dependencies
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const ffmpeg = require('ffmpeg');
const express = require('express');
const app = express();
const RedditImageFetcher = require("reddit-image-fetcher");
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
ping -- pong

pls help -- Brings up this message

pls sticker -- The obvious

pls meme -- Send a random meme(Usually stale memes) I dont recommend

pls everyone -- Mentions everyone in a group(obvs)

pls delete -- Makes me delete my message 🥺

pls unsticker -- Sticker to Image

pls join 'invite ink' -- Makes me join the group
` // Help content   



//Basic commands
client.on('message', msg => { /*Message listener*/
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
		

    }
});


client.on('message', async (msg) => {
    /*Mentions everyone in a group */
    let chat = await msg.getChat();
    if(msg.body===`${prefix} deez`){
        const media = await MessageMedia.fromUrl('https://rr2---sn-5pguxaob-copl.googlevideo.com/videoplayback?expire=1681086761&ei=yQQzZKS8L-GvxN8PjI6O2AY&ip=105.113.34.131&id=o-AF_t79tOcCbTmbQY3NMMNv11I1t_GBpHrDyihUsZhjCN&itag=18&source=youtube&requiressl=yes&mh=4H&mm=31%2C29&mn=sn-5pguxaob-copl%2Csn-avn7ln7e&ms=au%2Crdu&mv=m&mvi=2&pl=21&ctier=SH&initcwndbps=266250&spc=99c5CQf2LS7oWQl4M6fdZzt4yVZ9gYk&vprv=1&svpuc=1&mime=video%2Fmp4&gir=yes&clen=1501007&ratebypass=yes&dur=19.968&lmt=1678426562524827&mt=1681064222&fvip=2&fexp=24007246&c=ANDROID&txp=5530434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cctier%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAPjHn_H12lYIi3B9M9npoioeIPo6YRx1nD-_wuM55j1XAiEA560m3Nh8p_VXFLBTv6wipW5IIPfuepgoGmZstx_iDYc%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAJGJx-4BdtD9cQ7ELK18b54ODGOSQGp0bUZHnVDQWmz4AiAhuPUArTml65RZkzBX9SLmSAH_mCarV3KVjrJ8NfXXOA%3D%3D');
        chat.sendMessage(media);
    }

    if(msg.body === `${prefix} everyone`){
        if (chat.isGroup) {   
            const chat = await msg.getChat(); 
            let text = "";
            let mentions = [];
            let grpName=chat.name;
            for(let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);       
                mentions.push(contact);
                text += `@${participant.id.user} `;
            }
            if(msg.hasQuotedMsg){
            const quotedMsg = await msg.getQuotedMessage();
            await quotedMsg.reply(text,null, { mentions });
            console.log(`Tagged all in ${grpName} `);
        }else{
            await chat.sendMessage(text, { mentions });
        }
                
        }else {
             msg.reply('This command can only be used in a group!');
    }}
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

    /*Deletes a message sent by the bot account*/
    if (msg.body === `${prefix} delete`) {
        if (msg.hasQuotedMsg) {
            try{
                const quotedMsg = await msg.getQuotedMessage();
                if (quotedMsg.fromMe) {
                    quotedMsg.delete(true);                    
                } else {
                    msg.reply('I can only delete my own messages');
                }
            }catch (error) { 
                    console.error(error)
                    msg.reply("I cannot delete that message")
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
                msg.reply(sticker, null, { sendMediaAsSticker: true});
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
            msg.reply(`link must be in this format 'https://chat.whatsapp.com/PPfsifnsmolweni'`);
        }
    }
})

