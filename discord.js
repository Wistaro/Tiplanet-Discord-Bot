const Discord = require('discord.js')
var request = require('request')

var credentials = require('./credentials')
var config = require('./config')

var tchat2Discord = require('./tchat2Discord')
var discordToTchat = require('./discord2Tchat') 

const client = new Discord.Client()

//Discord channels
const channel_log = '706970986842554468'
const shoutbox_channel = '708351148813451274'
const newsChannel = '742302948687609896'
const botLogChannel = '754050294387572817'

//Discord roles
const roleAdmin = '415190599780532224';
const roleModo = '339837454519500800';
const roleModoG = '339837948897918977';
const rolePremium = '339841307939700747';
const roleRedac = '339839953515053066';
const roleAnim = '339840793357451275';
const roleProg = '339842895333031936';

const webhookUrl = 'https://discordapp.com/api/webhooks/708351218388435015/PWLB31ajkbpSuGMV9HF55VBdq0v7SRMzOKEuOC8wvfz8Ya_lsuDI2lTmoL1DcbYW3f2C';



client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user || receivedMessage.webhookID || receivedMessage.author.bot) {
        return
    }  
        processCommand(receivedMessage)        
})

client.on('ready', () => {
  
    client.user.setStatus("available")
    console.log("TI Bot is ready! v4")

    discordToTchat.botLogin().then(function(data){

     sendEmbed("Le Bot est **en ligne** sur le tchat de TIplanet!", botLogChannel);

     discordToTchat.sendBotMessage('black','Info', '[i]Connection au serveur Discord effectuée.[/i]', 'Public').then(function(data){ }).catch(function(err){})


   })
})

function sendEmbed(message, channel){

    const embed = new Discord.MessageEmbed()
    .setAuthor("TI-Bot")
    .setColor("#EF1616")
    .setDescription(message)

    client.channels.cache.get(channel).send({embed});  
}

function sendMessage(message, channel){
    client.channels.cache.get(channel).send(message);  
}

function weebhookPost(data, username, avatar){

    request.post(webhookUrl, {
        json: {
            content: data, 
            username : username,
            avatar_url : avatar

        }
    }, (error, res, body) => {

        if (error) {
             console.error('Send webhook error: '+error)
        }
    })

}
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

    }else if(receivedMessage.member.roles.cache.has(roleProg)){
      
        colorTchat = '#F730CD';
      }

    if(channelSource != shoutbox_channel) return;

    discordToTchat.sendBotMessage(colorTchat,memberWhoSpeak, msgClean, 'Public').then(function(data){  

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

        discordToTchat.botLogin().then(function(data){

            sendEmbed("Le Bot est **en ligne** sur le tchat de TIplanet!", botLogChannel)

          }).catch(function(error){

            sendEmbed('Impossible de passer le bot en ligne sur le tchat de tiplanet: '+error, botLogChannel)
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


client.login(credentials.discordBotToken) 

module.exports = {
    sendMessage,
    sendEmbed, 
    weebhookPost, 
    newsChannel
    
}
