var request = require('request')
var convert = require('xml-js');
var fs = require('fs');
var he = require('he');
var bbcodeConvert = require('bbcode-to-markdown');

module.exports.getTchatXml = function(lastDataFromFile){

    return new Promise(function(fullfil, reject){

        request.post('https://tiplanet.org/forum/chat/?ajax=true&shoutbox=true', {
            json: {
                Host: 'tiplanet.org',          
            }
        }, (error, res, body) => {

            if (error) {

                 console.error(error)
                reject(error);

            }else{


                var tchatDataJson = JSON.parse(convert2json(body))

                if(tchatDataJson.root.messages != undefined){
                    var messageList = tchatDataJson.root.messages.message
                    var lastPoster = messageList[messageList.length - 1]['username']['_cdata'] 
                    var lastMessage = messageList[messageList.length - 1]['text']['_cdata']
                    lastMessage = he.decode(lastMessage)
                    lastMessage = lastMessage.replace('[img]', '')
                    lastMessage = lastMessage.replace('[/img]', '')

                    lastMessage = bbcodeConvert(lastMessage)
                    lastMessage = lastMessage.replace('/forum/', 'https://tiplanet.org/forum/')
                    lastMessage = lastMessage.replace('(/forum/', 'https://tiplanet.org/forum/')

                    if(lastMessage.includes('<@') || lastMessage.includes('everyone') || lastMessage.includes('here')){
                        lastMessage = 'Wistaro est un génie!';
                    }

                    if(lastMessage.includes('/delete')){
                        lastMessage = '**Un message a été supprimé par un Modérateur**';
                        lastPoster = 'TI-Bot'
                    }


                }else{
                    reject('ERRREUR READING DATA');
                    return 
                }
                
            

                if(lastDataFromFile != undefined){

                        let lastDataFromFileJSON = JSON.parse(lastDataFromFile);
                        

                    if(lastMessage != lastDataFromFileJSON.message){

                        var responseArray = new Object();
                        responseArray['pseudo'] = lastPoster;
                        responseArray['message'] = lastMessage;

                        fs.writeFile('lastMessage.log', JSON.stringify(responseArray) , function (err) {
                            if (err) throw err;
                        });
                  
                         fullfil(responseArray);

                    }else{
                        var responseArray = new Object();
                        responseArray['pseudo'] = 'NO_DATA';
                        responseArray['message'] = 'NO _DATA';

                        
                        
                        fullfil(responseArray);
                    }
                }

                
            }
        })

    })
}

function getOldData(callback){
    
}

function convert2json(xmlData){
    return convert.xml2json(xmlData, {compact: true, spaces: 0});
}