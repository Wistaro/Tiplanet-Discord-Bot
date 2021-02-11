//Local include
var discord2Tchat = require("./src/discord2Tchat");
var discord = require("./src/discord");

function keepBotOnlineTip() {
	discord2Tchat
		.botLogin()
		.then(function () {
			discord2Tchat
				.sendBotMessage("", "", "", "Public")
				.then(function () {
					var today = new Date();
					console.log("Wakeup request: Done at " + today.toString());
				})
				.catch(function (error) {
					discord.sendMessage(
						`Envoie du message impossible vers le tchat de tiplanet: ${error}`,
						shoutbox_channel
					);
				});
		})
		.catch(function () {
			console.log("Requete pour réveiller le bot sur tip = PAS OK!");
		});
}
setInterval(keepBotOnlineTip, 40000);
