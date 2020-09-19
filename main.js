//Package include
var request = require('request')
const http = require('http');
const fs = require('fs');

//Local include
var tchat2Discord = require('./tchat2Discord') 
var discord2Tchat = require('./discord2Tchat') 

var ircTip = require('./discord2Tchat')
var config = require('./config')
var discord = require('./discord')

var newsFeed = require('./newsFeed')

const tiBotVersion = "1.6"



/*http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end('Discord bot for tiplanet.org, by Wistaro. ');
}).listen(8080);*/



function keepBotOnlineTip(){

  discord2Tchat.botLogin().then(function(data){

    discord2Tchat.sendBotMessage('','', '', 'Public').then(function(data){  
      var today = new Date();
      console.log('Wakeup request: Done at '+today.toString());

  }).catch(function(error){

    discord.sendMessage('Envoie du message impossible vers le tchat de tiplanet:  '+error, shoutbox_channel)

  })
    
  }).catch(function(err){

    console.log('Requete pour réveiller le bot sur tip = PAS OK!');
  })
}
setInterval(keepBotOnlineTip, 20000); 

