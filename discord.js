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
const rulesChannel = '754336130677342228'
const botInfoChannel = '754352846542995526'
const newArticlesChannel = '754399094952165406'

//Discord roles
const roleAdmin = '415190599780532224';
const roleModo = '339837454519500800';
const roleModoG = '339837948897918977';
const rolePremium = '339841307939700747';
const roleRedac = '339839953515053066';
const roleAnim = '339840793357451275';
const roleProg = '339842895333031936';

const webhookIdrc = '753785049970901114'

const webhookUrl = 'https://discordapp.com/api/webhooks/708351218388435015/PWLB31ajkbpSuGMV9HF55VBdq0v7SRMzOKEuOC8wvfz8Ya_lsuDI2lTmoL1DcbYW3f2C';



client.on('message', (receivedMessage) => {

    let webHookId = receivedMessage.webhookID;
    let channelSource = receivedMessage.channel.id;

    let filter = msg => {
        return msg.content.toLowerCase() == receivedMessage.content.toLowerCase()
    }

    if (receivedMessage.author == client.user || (channelSource != shoutbox_channel && webHookId != webhookIdrc) || (receivedMessage.author.bot && webHookId != webhookIdrc)) {
        return
    }

    receivedMessage.channel.awaitMessages(filter, {
        maxMatches: 1,
        time: 500
    }).then(collected => {
        console.log('Le Bot essaie de spam!');
    }).catch(console.error);

    if (receivedMessage.reference != null) {
        receivedMessage.channel.messages.fetch(receivedMessage.reference.messageID).then(function(data) {
            let responseAuthor = data.author.username.toString();
            let responseMessage = data.content.toString();
            let prefixFromReply = '[quote="' + responseAuthor + '"]' + responseMessage + '[/quote]';

            processMessage(prefixFromReply, receivedMessage)
        });

    } else {
        processMessage(' ', receivedMessage)
    }


})

client.on('ready', () => {

    client.user.setStatus("available")
    console.log("TI Bot is ready! v4")

    discordToTchat.botLogin().then(function(data) {

        sendEmbed("Le Bot est **en ligne** sur le tchat de TIplanet!", botLogChannel);

        //discordToTchat.sendBotMessage('black','Info', '[i]Connection au serveur Discord effectuée.[/i]', 'Public').then(function(data){ }).catch(function(err){})


    })
})

function sendEmbed(message, channel) {

    const embed = new Discord.MessageEmbed()
        .setAuthor("TI-Bot")
        .setColor("#EF1616")
        .setDescription(message)

    client.channels.cache.get(channel).send({
        embed
    });
}

function sendMessage(message, channel) {
    client.channels.cache.get(channel).send(message);
}

function weebhookPost(data, username, avatar) {

    request.post(webhookUrl, {
        json: {
            content: data,
            username: username,
            avatar_url: avatar

        }
    }, (error, res, body) => {

        if (error) {
            console.error('Send webhook error: ' + error)
        }
    })

}

function processMessage(prefix, receivedMessage) {

    if (receivedMessage.content.startsWith("!")) {

        handleCommand(receivedMessage)

    } else {
        let serverGuild = receivedMessage.guild;

        let msgClean = receivedMessage.cleanContent.replace(/>([ a-zA-Z0-9\[\]]+)(\n)?\n(@[\[\]a-zA-Z0-9# ]+)(\n)?([ a-zA-Z0-9]+)/gm, "[quote=$3]$1[/quote] : $5");
        msgClean = msgClean.replace(/(\r\n|\n|\r)/gm, "");

        /*
        WARNING - TODO!:
          - The reply experimental feature brokes guild.member
          - I'll fix it asap!

        let guild = client.guilds.cache.get('186785204222820352');
        let member = guild.member(receivedMessage.author);
        let nickname = member ? member.displayName : receivedMessage.author.username;
        let memberWhoSpeak = nickname*/

        let memberWhoSpeak = receivedMessage.author.username

        let webHookId = receivedMessage.webhookID;

        let reg = /<(:[0-9A-Za-z]+:)[0-9]+>/gm;
        let colorTchat = 'black'

        msgClean = msgClean.replace(reg, "$1");

        if (webHookId != webhookIdrc) {

            if (receivedMessage.member.roles.cache.has(roleAdmin)) {

                colorTchat = 'red';

            } else if (receivedMessage.member.roles.cache.has(roleModoG)) {

                colorTchat = 'green';

            } else if (receivedMessage.member.roles.cache.has(roleModo)) {

                colorTchat = '#62C927';

            } else if (receivedMessage.member.roles.cache.has(roleRedac)) {

                colorTchat = 'blue';

            } else if (receivedMessage.member.roles.cache.has(roleAnim)) {

                colorTchat = '#3D58D5';

            } else if (receivedMessage.member.roles.cache.has(roleProg)) {

                colorTchat = '#F730CD';
            }

        } else {

            colorTchat = 'black';
            memberWhoSpeak = '[IRC] ' + memberWhoSpeak;

        }

        discordToTchat.sendBotMessage(colorTchat, memberWhoSpeak, prefix + msgClean, 'Public').then(function(data) {

        }).catch(function(error) {

            client.channels.cache.get(shoutbox_channel).send('Envoie du message impossible vers le tchat de tiplanet:  ' + error);
        })

    }
}

function handleCommand(receivedMessage) {

    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)
    let serverGuild = receivedMessage.guild;
    let memberWhoSpeak = receivedMessage.author.username;

    if (primaryCommand == 'tibot') {

        if (arguments[0] == 'login') {

            discordToTchat.botLogin().then(function(data) {

                sendEmbed("Le Bot est désormais **en ligne** sur le tchat de TIplanet!", botLogChannel)

            }).catch(function(error) {

                sendEmbed('Impossible de passer le bot en ligne sur le tchat de tiplanet: ' + error, botLogChannel)
            })

        } else if (arguments[0] == 'logout') {

            discordToTchat.botLogout().then(function(data) {

                sendEmbed("Le Bot est désormais **HORS LIGNE** sur le tchat de TIplanet!", botLogChannel)

            }).catch(function(error) {
                client.channels.cache.get(shoutbox_channel).send('Impossible de passer le bot en hors ligne sur le tchat de tiplanet: ' + error);
            })
        } else if (arguments[0] == 'postRules') {

            if (receivedMessage.member.roles.cache.has(roleAdmin) || receivedMessage.member.roles.cache.has(roleModoG)) {

                const embed = new Discord.MessageEmbed()
                    .setAuthor("Discord rules")
                    .setColor("#EF1616")
                    .setDescription(receivedMessage.toString().substring(16))

                client.channels.cache.get(rulesChannel).send({
                    embed
                });
            }

        } else if (arguments[0] == 'postBotInfo') {

            if (receivedMessage.member.roles.cache.has(roleAdmin) || receivedMessage.member.roles.cache.has(roleModoG)) {

                const embed = new Discord.MessageEmbed()
                    .setAuthor("Informations sur les Bots / Bots informations")
                    .setColor("#EF1616")
                    .setDescription(receivedMessage.toString().substring(18))

                client.channels.cache.get(botInfoChannel).send({
                    embed
                });
            }

        }
    }
}


client.login(credentials.discordBotToken)

module.exports = {
    sendMessage,
    sendEmbed,
    weebhookPost,
    newsChannel,
    newArticlesChannel

}