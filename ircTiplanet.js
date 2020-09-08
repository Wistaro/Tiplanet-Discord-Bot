var request = require('request')

const psdBot = 'WistaBot'
const passBot = '93215942!'

const loginUrl = 'https://tiplanet.org/forum/ucp.php?mode=login'
const logoutUrl = 'https://tiplanet.org/forum/ucp.php?mode=logout';

var cookieJar = request.jar();

module.exports.botLogin = function(){
    
    return new Promise(function(fullfil, reject){

        request.post({ //first request to 
            
            url: loginUrl,
            form: {
            username:psdBot,
            password:passBot,
            autologin:'true',
            viewonline:'true',
            redirect:'/forum/chat',
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
module.exports.sendBotMessage = function(colorTchat,memberWhoSpeak, msgClean){
    
    return new Promise(function(fullfil, reject){

        request.post({
            url: 'https://tiplanet.org/forum/chat/?ajax=true',
            form: {
              channelName: 'Public',
              text: '[b][color='+colorTchat+']'+memberWhoSpeak+'[/color][/b]: [color=block]'+msgClean+'[/color]'
            },
      
            jar: cookieJar
      
          }, function(err, httpResponse, body) {
            if (!err) {
      
              console.log("message"+msgClean+ "envoyé!")
              fullfil('ok');
      
            } else {
              console.log("error" + err)
              reject(err)
            }
          }) 
        });
}