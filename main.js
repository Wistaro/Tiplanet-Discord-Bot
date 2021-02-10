//Package include
var request = require("request");
const http = require("http");
const fs = require("fs");

//Local include
var tchat2Discord = require("./src/tchat2Discord");
var discord2Tchat = require("./src/discord2Tchat");

var ircTip = require("./src/discord2Tchat");
var config = require("./config");
var discord = require("./src/discord");

var newsFeed = require("./src/newsFeed");

const tiBotVersion = "1.7";

function keepBotOnlineTip() {
	discord2Tchat
		.botLogin()
		.then(function (data) {
			discord2Tchat
				.sendBotMessage("", "", "", "Public")
				.then(function (data) {
					var today = new Date();
					console.log("Wakeup request: Done at " + today.toString());
				})
				.catch(function (error) {
					discord.sendMessage(
						"Envoie du message impossible vers le tchat de tiplanet:  " +
							error,
						shoutbox_channel
					);
				});
		})
		.catch(function (err) {
			console.log("Requete pour réveiller le bot sur tip = PAS OK!");
		});
}
setInterval(keepBotOnlineTip, 40000);
