var request = require('request')
var convert = require('xml-js');
var fs = require('fs');
var he = require('he');
var bbcodeConvert = require('bbcode-to-markdown');

var config = require('./config')
var discord = require('./discord')

var lastMessage = 'ok'
var lastPseudo = 'ok'

function replaceTextFromMessage(text) {
	text = text.replace('[img]', '')
			   .replace('[/img]', '');
				
	// From TIP (client-side)		
    	text = text.replace(/merde/gi, 'saperlipopette').replace(/bordel/gi, 'sapristi')
               .replace(/foutre/gi, 'faire').replace(/chiant/gi, 'très embêtant')
               .replace(/couille/gi, 'bonbon')
               .replace(/puta?in+/gi, ["fichtre","diantre"][Math.random()<.5|0])

               .replace(/pre[nt]ium/gi, 'pre[color=red][u][b]m[/b][/u][/color]ium')
               .replace(/bonjours+/gi, 'bonjou[color=red][u][b]r[/b][/u][/color]')
               .replace(/(ce|le|un|du) jeux/gi, '$1 jeu[color=red][s][b]x[/b][/s][/color]')

               .replace(/enfaite/gi, 'en fait')

               .replace('&gt;:]', '/forum/images/smilies/devilish.png')

               .replace(':-&gt;:', '→')

               .replace('@', '[at]');
	
	
	text = text.replace('[url=/forum/', '[url=https://tiplanet.org/forum/')
		   .replace(/@everyone|@here/gi, 'Wistaro est un génie!');

	text = bbcodeConvert(text);
	
    return text;
};

function getTchatXml(lastDataFromFile){

    return new Promise(function(fullfil, reject){

        request.post(config.getTchatUrl, {
            json: {
                Host: 'tiplanet.org',          
            }
        }, (error, res, body) => {

            if (error) {

                 console.error(error)
                reject(error);

            }else{

                try{

                    var tchatDataJson = JSON.parse(convert2json(body))

                    if(tchatDataJson.root.messages != undefined){
                        var messageList = tchatDataJson.root.messages.message

                        var userRole = messageList[messageList.length - 1]['_attributes']['userRole'] 
                        var userId = messageList[messageList.length - 1]['_attributes']['userID'] 
                        var lastPoster = messageList[messageList.length - 1]['username']['_cdata'] 
                        var lastMessage = messageList[messageList.length - 1]['text']['_cdata']

                        lastMessage = replaceTextFromMessage(he.decode(lastMessage))

                        if(lastMessage.includes('/delete')){
                            lastMessage = '**Un message a été supprimé par un Modérateur**';
                            lastPoster = 'TI-Bot'
                        }


                    }else{
                        reject('Impossible de lire les données');
                        return 
                    }

                    if(lastDataFromFile != undefined){
                
                        let lastDataFromFileJSON = JSON.parse(lastDataFromFile);
                            

                        if(lastMessage != lastDataFromFileJSON.message){

                            var responseArray = new Object();
                            responseArray['pseudo'] = lastPoster;
                            responseArray['message'] = lastMessage;
                            responseArray['userId'] = userId;
                            responseArray['userRole'] = userRole;

                            fs.writeFile('lastMessage.log', JSON.stringify(responseArray) , function (err) {
                                if (err) throw err;
                            });
                    
                            fullfil(responseArray);

                        }else{
                            var responseArray = new Object();
                            responseArray['pseudo'] = 'NO_DATA';
                            responseArray['message'] = 'NO_DATA';
                            responseArray['userId'] = 'NO_DATA';
                            responseArray['userRole'] = 'NO_DATA';

                            fullfil(responseArray);
                        }
                    }

                }catch(error){

                    reject(error); //merci la fonction sync (je sais c moche)
                }
                
            }
        })

    })
}

function getLastMessage(lastMessage, lastPseudo) {

    var lastDataFromFile =  fs.readFileSync('lastMessage.log', 'utf8'); //todo : async function!
    
        getTchatXml(lastDataFromFile).then(function(response){
    
            if(response['pseudo'] != 'NO_DATA'){

                console.log('response main : pseudo'+response['pseudo']+' || msg : '+response['message'])

                if(response['pseudo'] == 'WistaBot' || response['pseudo'] == 'TI-Bot') return;

                var prefix = ''

                switch (response['userRole']) {
                  case '53':
                    prefix = '[ADMIN]';
                    break;

                  case '42':
                    prefix = '[MOD+]';
                    break;

                  case '102':
                    prefix = '[MOD]';
                    break;

                  case '171':
                    prefix = '[MEMBRE UPECS]';
                    break;
					
                  case '121':
                    prefix = '[PREMIUM]';
                    break;

                  case '261':
                    prefix = '[VIP++]';
                    break;

                  case '181':
                    prefix = '[DONATEUR]';
                    break;

                  case '271':
                    prefix = '[OMEGA]';
                    break;

                  case '82':
                    prefix = '[RÉDAC]';
                    break;
                    
                  case '202':
                    prefix = '[AMBIANCEUR]';
                    break;
                    
                  case '221':
                    prefix = '[PROG]';
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
    getLastMessage(lastMessage, lastPseudo)
}
setInterval(messageUpdater, 1000); 

function convert2json(xmlData){
    return convert.xml2json(xmlData, {compact: true, spaces: 0});
}

module.exports = {
    getLastMessage, 
    getTchatXml
}
