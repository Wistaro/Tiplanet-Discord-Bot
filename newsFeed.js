var Watcher  = require('feed-watcher'),
feed     = 'http://lorem-rss.herokuapp.com/feed?unit=second&interval=5',
interval = 10 // seconds

// if not interval is passed, 60s would be set as default interval.
var watcher = new Watcher(feed, interval)

// Check for new entries every n seconds.
watcher.on('new entries', function (entries) {
entries.forEach(function (entry) {
console.log(entry.title)
})
})

// Start watching the feed.
watcher
.start()
.then(function (entries) {
console.log(entries)
})
.catch(function(error) {
console.error(error)
})

// Stop watching the feed.
watcher.stop()