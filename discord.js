const Discord = require('discord.js')
var request = require('request')

var credentials = require('./credentials')
var config = require('./config')

const client = new Discord.Client()
//Discord channels
const channel_log = '706970986842554468'
const shoutbox_channel = '708351148813451274'
const newsChannel = '742302948687609896'
const botLogChannel = '754050294387572817'
const rulesChannel = '754336130677342228'
const botInfoChannel = '754352846542995526'
const newArticlesChannel = '754399094952165406'
const discordNewsChannel = '683367616252739660';

//Discord roles
const roleAdmin = '415190599780532224';
const roleModo = '339837454519500800';
const roleModoG = '339837948897918977';
const rolePremium = '339841307939700747';
const roleRedac = '339839953515053066';
const roleAnim = '339840793357451275';
const roleProg = '339842895333031936';
const roleRespDiscord = '186785546457186305';

const webhookIdrc = '753785049970901114'

const webhookUrl = credentials.webhookUrl;



client.on('message', (receivedMessage) => {

    let webHookId = receivedMessage.webhookID;
    let channelSource = receivedMessage.channel.id;
    let MsgReference = receivedMessage.reference;

    processMessage(receivedMessage);
})

client.on('ready', () => {

    client.user.setStatus("available")
    console.log("TI Bot is ready! v4")
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

function processMessage(receivedMessage) {

    if (receivedMessage.content.startsWith("!")) {

        handleCommand(receivedMessage)
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

        if (arguments[0] == 'postRules') {

            if (receivedMessage.member.roles.cache.has(roleAdmin) || receivedMessage.member.roles.cache.has(roleRespDiscord)) {

                const embed = new Discord.MessageEmbed()
                    .setAuthor("Discord rules")
                    .setColor("#EF1616")
                    .setDescription(receivedMessage.toString().substring(16))

                client.channels.cache.get(rulesChannel).send({
                    embed
                });
            }

        } else if (arguments[0] == 'postBotInfo') {

            if (receivedMessage.member.roles.cache.has(roleAdmin) || receivedMessage.member.roles.cache.has(roleRespDiscord)) {

                const embed = new Discord.MessageEmbed()
                    .setAuthor("Informations sur les Bots / Bots informations")
                    .setColor("#EF1616")
                    .setDescription(receivedMessage.toString().substring(18))

                client.channels.cache.get(botInfoChannel).send({
                    embed
                });
            }

        }else if (arguments[0] == 'postNews') {

            if (receivedMessage.member.roles.cache.has(roleAdmin) || receivedMessage.member.roles.cache.has(roleRespDiscord)) {

                const embed = new Discord.MessageEmbed()
                    .setAuthor("Actualité Discord")
                    .setColor("#EF1616")
                    .setDescription(receivedMessage.toString().substring(18))

                client.channels.cache.get(discordNewsChannel).send({
                    embed
                });
            }

        }
    }
}

client.login(credentials.discordBotToken);

module.exports = {
    sendMessage,
    sendEmbed,
    weebhookPost,
    newsChannel,
    newArticlesChannel

}