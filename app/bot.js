const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const ffmpeg = require('ffmpeg');
const { default: axios } = require('axios');
const express = require('express');
const app = express();
const request = require('request');
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
 
// Start the server
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
const prefix = 'pls'

const help=`Commands supported  are...
ping -- pong

pls help -- Brings up this message

pls sticker -- The obvious

pls meme -- Send a random meme(Usually stale memes) I dont recommend

pls face -- coming soon

pls everyone -- Mentions everyone in a group(obvs)

pls delete -- Makes me delete my message 🥺

pls unsticker -- Sticker to Image
`




client.on('message', msg => {
	if(msg.body === '.ping') {
		msg.reply('pong');
        console.log(msg.body)
    }else if(msg.body === 'Ping'){
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
    else if(msg.body === '.help')  {
		msg.reply('No, say please');
        console.log(msg.body)
    
    }
}


);


client.on('message', async (msg) => {
    let chat = await msg.getChat();
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

    if(msg.body===`${prefix} meme`){
        const meme = await axios('https://meme-api.herokuapp.com/gimme')
        .then(res => res.data);
        client.sendMessage(msg.from, await MessageMedia.fromUrl(meme.url));
        console.log("sent a meme");
    }msg      

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
    }else if (msg.body.startsWith(`${prefix} join `)) {
        try {
            const inviteCode = msg.body.split(' ')[2];
            console.log(inviteCode)
            await client.acceptInvite(inviteCode);
            msg.reply('Joined the group!');
        } catch (e) {
            console.log(e)
            msg.reply(`
            `);
        }
}})

