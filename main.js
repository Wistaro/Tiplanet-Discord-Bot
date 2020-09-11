//Package include
var request = require('request')
const http = require('http');
const fs = require('fs');

//Local include
var tchatHandler = require('./ajaxTchatHandler') 
var ircTip = require('./ircTiplanet')
var config = require('./config')
var discord = require('./discord')

var newsFeed = require('./newsFeed')

const tiBotVersion = "1.6"

var lastMessage = 'ok'
var lastPseudo = 'ok'

http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end('Discord bot for tiplanet.org, by Wistaro. ');
}).listen(8080);




function updateLastMessage(lastMessage, lastPseudo) {

    var lastDataFromFile =  fs.readFileSync('lastMessage.log', 'utf8'); //todo : async function!
    
        tchatHandler.getTchatXml(lastDataFromFile).then(function(response){
    
            if(response['pseudo'] != 'NO_DATA'){

                console.log('response main : pseudo'+response['pseudo']+' || msg : '+response['message'])

                if(response['pseudo'] == 'WistaBot' ) return;

                var prefix = ''

                switch (response['userRole']) {
                  case '121':
                    prefix = '[PREMIUM]';
                    break;

                  case '42':
                    prefix = '[MOD+]';
                    break; 
                  
                  case '53':
                    prefix = '[ADMIN]';
                    break;    
                  
                  case '4':
                    prefix = '[BOT]';
                    break; 

                  case '181':
                    prefix = '[DONATEUR]';
                    break; 

                  case '102':
                    prefix = '[RÉDAC]';
                    break;    
                
                  default:
                    prefix = '';
                    break;
                }

                discord.weebhookPost(response['message'], response['pseudo']+' '+prefix, 'https://tiplanet.org/forum/avatar.php?id='+response['userId'])
        }

        }).catch(function(error){

          console.log(error);

        });     

}

function messageUpdater(){
    updateLastMessage(lastMessage, lastPseudo)
}
setInterval(messageUpdater, 1000); 

function keepBotOnlineTip(){

  ircTip.botLogin().then(function(data){

    ircTip.sendBotMessage('','', '', '').then(function(data){  
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


