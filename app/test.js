const RedditImageFetcher = require("reddit-image-fetcher");
var fs = require('fs');
// const axios = require("axios");
// const meme = require('./bread');



RedditImageFetcher.fetch({
    type: 'meme'
}).then(result => {
    // console.log( result[0].image);
    fs.writeFile('meme.js',
     `module.exports= {link : '${result[0].image}'}`,
      function (err) {
        if (err) throw err;
        // console.log(result[0].image);
      });
});

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