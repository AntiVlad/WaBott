const RedditImageFetcher = require("reddit-image-fetcher");
var fs = require('fs');

function meme1 (){
RedditImageFetcher.fetch({
    type: 'meme'
}).then(result => {
    fs.writeFile('meme.js',
     `module.exports= {link : '${result[0].image}'}`,
      function (err) {
        if (err) throw err;
      });
    console.log('saved')
});
}

module.exports = meme1;
