"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const request = require("request");
function cmdDeserters(msg, clanTag, ROYALE_API_TOKEN) {
    var options = {
        method: 'GET',
        url: 'https://api.royaleapi.com/clan/' + clanTag + '/warlog',
        headers: { auth: ROYALE_API_TOKEN }
    };
    request.get(options, function (error, response, body) {
        var warlog = JSON.parse(body);
        if (warlog.error) {
            msg.reply("Sorry, there was an error requesting the Clash Royale API. Try again later.");
            console.error(`Could not access royaleapi: ${options.method} ${options.url}\n\t${warlog.status} - ${warlog.message}`);
            return;
        }
        if (warlog.length < 1) {
            msg.reply("Could not get any Wars. Seems like the clan did not play any wars.");
            return;
        }
        let deserters = {};
        warlog.forEach(function (war) {
            war.participants.filter(player => player.battlesPlayed == 0).forEach(function (des) {
            });
        });
        var embed = new Discord.RichEmbed();
        embed.setTitle("These Players did not play their wargame in last 10 clanwars:");
        embed.setDescription("This may happen because of several IRL-reasons, but has an massive impact on clan war result.");
        embed.setColor(4886754);
        embed.setTimestamp(new Date());
        embed.setFooter("Clan Royale Bot", "https://royaleapi.github.io/cr-api-assets/badges/Coin_01.png");
        var clanBadgeUrl;
        for (var i in warlog) {
            var war = warlog[i];
            var warDate = new Date(war.createdDate * 1000);
            var myClanStanding = war.standings.find(clan => clan.tag == clanTag);
            if (!clanBadgeUrl)
                clanBadgeUrl = myClanStanding.badge.image;
            var warDeserters = "";
            war.participants.filter(player => player.battlesPlayed == 0).forEach(function (des) {
                warDeserters += `\n    - [${des.name}](https://spy.deckshop.pro/player/${des.tag})`;
            });
            if (warDeserters.length == 0) {
                warDeserters = " :champagne: Everyone played! :tada:";
            }
            embed.addField((Number(i) + 1) + `. War: ${warDate.toLocaleDateString("de-DE")} (${myClanStanding.warTrophiesChange})`, warDeserters);
        }
        embed.setThumbnail(clanBadgeUrl);
        msg.channel.send({ embed })
            .then(sent => console.log(`Sent a !deserter reply to ${msg.author.username}`))
            .catch(console.error);
    }).on('error', function (e) {
        msg.reply("Sorry! My royaleapi.com-warlog-request failed... Try again later!");
        console.error(e);
    });
}
exports.cmdDeserters = cmdDeserters;
//# sourceMappingURL=deserters.js.map