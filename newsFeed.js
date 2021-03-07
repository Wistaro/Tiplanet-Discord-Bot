var Watcher = require('feed-watcher')
var discord = require('./discord')

const newMessagesFeed = 'https://tiplanet.org/forum/feed.php'
const newArticlesFeed = 'https://tiplanet.org/forum/feed.php?mode=news'

var watcher_newposts = new Watcher(newMessagesFeed, 2)
var watcher_newArticles = new Watcher(newArticlesFeed, 10)

watcher_newposts
    .start()
    .then(function(entries) {
        console.error('Newsfeed (new messages) engine started')
    })
    .catch(function(error) {
        console.error('NewFeed (new messages) Error: ' + error)
    })

watcher_newposts.on('new entries', function(entries) {
    entries.forEach(function(entry) {
        discord.sendEmbed('[' + entry.title + '](' + entry.link + ')\n **Auteur:** ' + entry.author + '\n' + '**Date:**:' + entry.date, discord.newsChannel);
        console.log(getDateTime()+" Nouveau message sur le forum ("+entry.title+" - de "+entry.author+")");
    })
})

watcher_newArticles
    .start()
    .then(function(entries) {
        console.error('Newsfeed (new articles) engine started')
    })
    .catch(function(error) {
        console.error('NewFeed (new articles) Error: ' + error)
    })

watcher_newArticles.on('new entries', function(entries) {
    entries.forEach(function(entry) {
        discord.sendEmbed('[' + entry.title + '](' + entry.link + ')\n **Auteur:** ' + entry.author + '\n' + '**Date:**:' + entry.date, discord.newArticlesChannel);
        console.log(getDateTime()+" Nouvel article ("+entry.title+" - de "+entry.author+")");
    })
})

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " - " + hour + ":" + min + ":" + sec;

}