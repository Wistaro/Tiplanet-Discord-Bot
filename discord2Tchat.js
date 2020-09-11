var request = require('request')
var credentials = require('./credentials')
var config = require('./config')

var cookieJar = request.jar();

module.exports.botLogin = function(){
    
    return new Promise(function(fullfil, reject){

        request.post({ 
            
            url: config.websiteLoginUrl,
            form: {
            username:credentials.psdBot,
            password:credentials.passBot,
            autologin:'true',
            viewonline:'true',
            redirect:'',
            login:'Connexion'
            },
            jar: cookieJar
          
          }, function(err, httpResponse, body) {

                if(err){

                    reject(err)

                }else{

                    fullfil('ok')
                    
                }
            })
        });
}

module.exports.botLogout = function(){
    
    return new Promise(function(fullfil, reject){

        request.post({ //first request to 
            
            url: logoutUrl,
            form: {
            username:psdBot,
            password:passBot,
            },
            jar: cookieJar
          
          }, function(err, httpResponse, body) {

                if(err){

                    reject(err)

                }else{

                    fullfil('ok')
                }
            })
        });
}
module.exports.sendBotMessage = function(colorTchat,memberWhoSpeak, msgClean, channel){
    
    return new Promise(function(fullfil, reject){

      let text2post;
      
      if (msgClean == '') {
        text2post = ''
      }else{
        text2post = '[b][color='+colorTchat+']'+memberWhoSpeak+'[/color][/b]: [color=block]'+msgClean+'[/color]'
      }
        request.post({
            url: config.tchatPostUrl,
            form: {
              channelName: channel,
              text: text2post
            },
      
            jar: cookieJar
      
          }, function(err, httpResponse, body) {
            if (!err) {
      
              fullfil('ok');
      
            } else {
              console.log("error" + err)
              reject(err)
            }
          }) 
        });
}