const youtubedl = require('youtube-dl-exec')

youtubedl('https://www.youtube.com/shorts/n4xwF5-fj6g',{
    format:18,
    getUrl:true
}).then(output=> console.log(output))
