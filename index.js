const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const ffmpeg = require('ffmpeg');
const { default: axios } = require('axios');

const client = new Client({
  authStrategy: new LocalAuth(),
//   puppeteer: { headless: true },
  ffmpegPath: './ffmpeg.exe',
  puppeteer: {
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
}
});



client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});
client.initialize();

const help=`Commands supported  are...
pls help -- Brings up this message

pls sticker -- The obvious

pls meme -- Send a random meme(Usually stale memes) I dont recommend

pls face -- coming soon

pls everyone -- Mentions everyone in a group(obvs)

pls delete -- Makes me delete my message 🥺

pls unsticker -- Sticker to Image

ping -- pong
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

	}else if(msg.body === 'pls help') {
		msg.reply('No, say pls');
        console.log(msg.body)

    }else if(msg.body === 'Pls help') {
		msg.reply('No, say Pls');
        console.log(msg.body)

    }else if(msg.body === 'pls') {
		msg.reply('Alright');
		msg.reply(help);
        console.log(msg.body)

    }else if(msg.body === 'Pls') {
		msg.reply('Alright');
		msg.reply(help);
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
    if(msg.body === 'pls everyone'){
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

                await chat.sendMessage(text, { mentions });
                console.log(`Tagged all in ${grpName} `);
                
            }else {
                    msg.reply('This command can only be used in a group!');
}}
    if(msg.body==='pls meme'){
        const meme = await axios('https://meme-api.herokuapp.com/gimme')
        .then(res => res.data);
        client.sendMessage(msg.from, await MessageMedia.fromUrl(meme.url));
        console.log("sent a meme");
    }msg
    // if(msg.body==='pls face'){
    //     const face = await axios('https://fakeface.rest/face/json')
    //     .then(res => res.data)
    //     client.sendMessage(msg.from, await MessageMedia.fromUrl(face.url))}
})
        
client.on('message', async msg => {
    if (msg.body === 'pls delete') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
                console.log("Deleted message");

            } else {
                msg.reply('I can only delete my own messages');
            }
        }
    }else if (msg.body === '/delete') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
                console.log("Deleted message");
            } else {
                msg.reply('I can only delete my own messages');
            }
        }
    }else if(msg.body === "pls sticker"){
        if(msg.hasMedia) {
            const sticker = await msg.downloadMedia();
            
            msg.reply(sticker, null, {stickerAuthor: 'Your fav bot :)' ,sendMediaAsSticker: true});
            console.log("Sent a sticker");
            // chat.sendMessage(sticker, { stickerAuthor: 'Your fav bot :)', sendMediaAsSticker: true, quotedMessageId: msg.id._serialized })
        }else
        if(msg.hasQuotedMsg){
            const quotedMsg = await msg.getQuotedMessage();
                // if (quotedMsg.hasMedia){
                    const sticker = await quotedMsg.downloadMedia();
                    
                    msg.reply(sticker, null, { sendMediaAsSticker: true});
                    console.log("Sent a sticker");

                // }
        }
    }else if(msg.body === "pls unsticker"){
        if(msg.hasQuotedMsg){
            const quotedMsg = await msg.getQuotedMessage();
                // if (quotedMsg.hasMedia){
                    const unsticker = await quotedMsg.downloadMedia();
                    
                    msg.reply(unsticker);
                    console.log("unstickered");

    }else if (msg.body.startsWith('pls ')) {
        const inviteCode = msg.body.split(' ')[1];
        try {
            await client.acceptInvite(inviteCode);
            msg.reply('Joined the group!');
        } catch (e) {
            msg.reply('That invite code seems to be invalid.');
        }
}

    
        
        
    
}});


// client.on("message", (msg) => {
//     if(!(msg.hasMedia && msg.type === "STICKER") return; // Checks if the message has media and is type sticker
//     const MsgMedia = await msg.downloadMedia();
//     // Now you can send the data back directly...  
//     await msg.reply(MsgMedia);
//     // ... or write it to a file
//     fs.writeFileSync("image.png", MsgMedia.data);
//   })
// module.exports = bot;