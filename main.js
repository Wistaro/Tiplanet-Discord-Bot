const tiBotVersion = "1.6"
const Discord = require('discord.js')
const client = new Discord.Client()
var request = require('request')
var watchr = require('watchr')
const http = require('http');
const fs = require('fs');
const fetch = require("node-fetch");
var Watcher  = require('feed-watcher')

const bot_token = "Njk5MDQwNTg3NDE1ODE0MTU1.Xq7hYA.2PFHIlAoHejIwEeBkLYdejUwrLI"

var tchatHandler = require('./tchatHandler')
var ircTip = require('./ircTiplanet')

const channel_log = '706970986842554468'
const shoutbox_channel = '708351148813451274'

//ROLES
const roleAdmin = '415190599780532224';
const roleModo = '339837454519500800';
const roleModoG = '339837948897918977';
const rolePremium = '339841307939700747';
const roleRedac = '339839953515053066';
const roleAnim = '339840793357451275';

var lastMessage = 'ok'
var lastPseudo = 'ok'

//rss test
const newsChannel = '742302948687609896'
const newsFeed = 'https://tiplanet.org/forum/feed.php'

var watcher = new Watcher(newsFeed, 1)

// Start watching the feed.
watcher
.start()
.then(function (entries) {
  
})
.catch(function(error) {
console.error(error)
})

// Stop watching the feed.
//watcher.stop()

var cookieJar = request.jar();

http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end('Discord bot for tiplanet.org, by Wistaro. ');
}).listen(8080);

// Check for new entries every n seconds.
watcher.on('new entries', function (entries) {
  entries.forEach(function (entry) {

    console.log(entry);
    const embed = new Discord.MessageEmbed()
    .setAuthor("Nouveau message sur le forum!")
    .setColor("#EF1616")
    .setDescription('['+entry.title+']('+entry.link+')\n **Auteur:** '+entry.author+'\n'+'**Date:**:'+entry.date)

    client.channels.cache.get(newsChannel).send({embed});  
  })
  })

client.on('ready', () => {
     client.user.setStatus("available")
     console.log("TI Bot is ready! v4")

    ircTip.botLogin().then(function(data){

      const embed = new Discord.MessageEmbed()
      .setAuthor("TI-Bot")
      .setColor("#EF1616")
      .setDescription("Le Bot est **en ligne** sur le tchat de TIplanet!")
  
      client.channels.cache.get(shoutbox_channel).send({embed});  

      ircTip.sendBotMessage('black','Info', '[i]Connection au serveur Discord effectuée.[/i]').then(function(data){ }).catch(function(err){})


    })
})

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

            request.post('https://discordapp.com/api/webhooks/708351218388435015/PWLB31ajkbpSuGMV9HF55VBdq0v7SRMzOKEuOC8wvfz8Ya_lsuDI2lTmoL1DcbYW3f2C', {
                json: {
                    content: response['message'], 
                    username : response['pseudo']+' '+prefix,
                    avatar_url : 'https://tiplanet.org/forum/avatar.php?id='+response['userId']

                }
            }, (error, res, body) => {
    
                if (error) {

                     console.error(error)
    
                }
            })

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

    console.log('Requete pour réveiller le bot sur tip = ok');
    
  }).catch(function(err){

    console.log('Requete pour réveiller le bot sur tip = PAS OK!');
  })
}
setInterval(keepBotOnlineTip, 20000); 

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user || receivedMessage.webhookID || receivedMessage.author.bot) {
        return
    }  
        processCommand(receivedMessage)        
})

function processCommand(receivedMessage) {

  if (receivedMessage.content.startsWith("!")) {

    handleCommand(receivedMessage)

  }else{

    let serverGuild = receivedMessage.guild;
    let channelSource = receivedMessage.channel.id;
    let msgClean = receivedMessage.cleanContent.replace(/(\r\n|\n|\r)/gm,"");
    let memberWhoSpeak = receivedMessage.author.username;
    let reg = /<(:[0-9A-Za-z]+:)[0-9]+>/gm;
    let colorTchat = 'black'

    msgClean = msgClean.replace(reg, "$1");

    if(receivedMessage.member.roles.cache.has(roleAdmin)){

      colorTchat = 'red';

    }else if(receivedMessage.member.roles.cache.has(roleModoG)){

      colorTchat = 'green';

    }else if(receivedMessage.member.roles.cache.has(roleModo)){
      
      colorTchat = '#62C927';

    }else if(receivedMessage.member.roles.cache.has(roleRedac)){
      
      colorTchat = 'blue';

    }else if(receivedMessage.member.roles.cache.has(roleAnim)){
      
      colorTchat = '#3D58D5';
    }

    if(channelSource != shoutbox_channel) return;

    ircTip.sendBotMessage(colorTchat,memberWhoSpeak, msgClean).then(function(data){  

        console.log('message envoyé!');

    }).catch(function(error){
      client.channels.cache.get(shoutbox_channel).send('Envoie du message impossible vers le tchat de tiplanet:  '+error);  
    })

  }
}

function handleCommand(receivedMessage){

    let fullCommand = receivedMessage.content.substr(1) 
    let splitCommand = fullCommand.split(" ") 
    let primaryCommand = splitCommand[0] 
    let arguments = splitCommand.slice(1) 
    let serverGuild = receivedMessage.guild;
    let memberWhoSpeak = receivedMessage.author.username;

    if (primaryCommand == 'tibot') {

      if(arguments[0] == 'login'){

          ircTip.botLogin().then(function(data){

            const embed = new Discord.MessageEmbed()
            .setAuthor("TI-Bot")
            .setColor("#EF1616")
            .setDescription("Le Bot est **en ligne** sur le tchat de TIplanet!")
        
        client.channels.cache.get(shoutbox_channel).send({embed});  

          }).catch(function(error){
            client.channels.cache.get(shoutbox_channel).send('Impossible de passer le bot en ligne sur le tchat de tiplanet: '+error);  
          })

      }else if(arguments[0] == 'logout'){

        ircTip.botLogout().then(function(data){

          const embed = new Discord.MessageEmbed()
          .setAuthor("TI-Bot")
          .setColor("#EF1616")
          .setDescription("Le Bot est **HORS LIGNE** sur le tchat de TIplanet!")
      
         client.channels.cache.get(shoutbox_channel).send({embed});  

        }).catch(function(error){
          client.channels.cache.get(shoutbox_channel).send('Impossible de passer le bot en hors ligne sur le tchat de tiplanet: '+error);  
        })
      }
    }
}
client.login(bot_token) 

