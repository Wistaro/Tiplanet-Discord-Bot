var Watcher  = require('feed-watcher')
var discord = require('./discord')

const newMessagesFeed = 'https://tiplanet.org/forum/feed.php'

var watcher = new Watcher(newMessagesFeed, 2)

watcher
.start()
.then(function (entries) {
    console.error('Newsfeed engine started')
})
.catch(function(error) {
    console.error('NewFeed Error: '+error)
})

watcher.on('new entries', function (entries) {
    entries.forEach(function (entry) {
      discord.sendEmbed('['+entry.title+']('+entry.link+')\n **Auteur:** '+entry.author+'\n'+'**Date:**:'+entry.date, discord.newsChannel); 
   })
  })