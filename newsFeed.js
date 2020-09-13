var Watcher  = require('feed-watcher')
var discord = require('./discord')

const newMessagesFeed = 'https://tiplanet.org/forum/feed.php'
const newArticlesFeed = 'https://tiplanet.org/forum/feed.php?mode=news'

var watcher_newposts = new Watcher(newMessagesFeed, 2)
var watcher_newArticles = new Watcher(newArticlesFeed, 10)

watcher_newposts
.start()
.then(function (entries) {
    console.error('Newsfeed (new messages) engine started')
})
.catch(function(error) {
    console.error('NewFeed (new messages) Error: '+error)
})

watcher_newposts.on('new entries', function (entries) {
    entries.forEach(function (entry) {
      discord.sendEmbed('['+entry.title+']('+entry.link+')\n **Auteur:** '+entry.author+'\n'+'**Date:**:'+entry.date, discord.newsChannel); 
   })
  })

watcher_newArticles
.start()
.then(function (entries) {
    console.error('Newsfeed (new articles) engine started')
})
.catch(function(error) {
    console.error('NewFeed (new articles) Error: '+error)
})

watcher_newArticles.on('new entries', function (entries) {
    entries.forEach(function (entry) {
      discord.sendEmbed('['+entry.title+']('+entry.link+')\n **Auteur:** '+entry.author+'\n'+'**Date:**:'+entry.date, discord.newArticlesChannel); 
   })
  })