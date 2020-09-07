const tiBotVersion = "1.6"
const Discord = require('discord.js')
const client = new Discord.Client()
var request = require('request')
var watchr = require('watchr')
const http = require('http');
const fs = require('fs');
const fetch = require("node-fetch");

const bot_token = "Njk5MDQwNTg3NDE1ODE0MTU1.Xq7hYA.2PFHIlAoHejIwEeBkLYdejUwrLI"

var tchatHandler = require('./tchatHandler')

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

var cookieJar = request.jar();

http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end('Discord bot for tiplanet.org, by Wistaro. ');
}).listen(8080);

client.on('ready', () => {
     client.user.setStatus("available")
     console.log("TI Bot is ready! v4")


     request.post({ //first request to login
       url: 'https://tiplanet.org/forum/ucp.php?mode=login',
       form: {
       username:'WistaBot',
       password:'93215942!',
       autologin:'true',
       viewonline:'false',
       redirect:'/forum/chat',
       login:'Connexion'
       },
       jar: cookieJar
     
     }, function(err, httpResponse, body) {
       if (!err) {
     
         console.log('Connexion effectuée.\n')
     
         request.post({
           url: 'https://tiplanet.org/forum/chat/?ajax=true',
     
           form: {
             channelName: 'Public',
             text: '/msg Wistaro le bot est en ligne!'
           },
     
           jar: cookieJar
     
         }, function(err, httpResponse, body) {
           if (!err) {
     
             console.log("message envoyé!")
     
           } else {
             console.log("error" + err)
           }
         })
     
       } else {
         console.log("error" + err)
       }
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
                    username : prefix+' '+response['pseudo'],
                    avatar_url : 'https://tiplanet.org/forum/avatar.php?id='+response['userId']

                }
            }, (error, res, body) => {
    
                if (error) {

                     console.error(error)
    
                }
            })

        }

        })
            

}

function messageUpdater(){
    updateLastMessage(lastMessage, lastPseudo)
}
setInterval(messageUpdater, 1000); 

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user || receivedMessage.webhookID) {
        return
    }  
        processCommand(receivedMessage)
})

function processCommand(receivedMessage) {


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
      
      colorTchat = 'lime';

    }else if(receivedMessage.member.roles.cache.has(roleRedac)){
      
      colorTchat = 'blue';

    }else if(receivedMessage.member.roles.cache.has(roleAnim)){
      
      colorTchat = 'aqua';
    }

    if(channelSource != shoutbox_channel) return;

    request.post({
      url: 'https://tiplanet.org/forum/chat/?ajax=true',
      form: {
        channelName: 'Public',
        text: '[b][[color='+colorTchat+']'+memberWhoSpeak+'[/color]][/b] [color=block]'+msgClean+'[/color]'
      },

      jar: cookieJar

    }, function(err, httpResponse, body) {
      if (!err) {

        console.log("message"+receivedMessage+ "envoyé!")

      } else {
        console.log("error" + err)
      }
    }) 

}
client.login(bot_token) 

