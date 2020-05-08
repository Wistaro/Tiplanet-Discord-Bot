var request = require('request')
var convert = require('xml-js');
var fs = require('fs');

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