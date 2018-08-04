var request = require('request');
var Discord = require('discord.js');
var bot = new Discord.Client();
var royaleApiToken = process.env.ROYALE_API_TOKEN;
var discordBotToken = process.env.DISCORD_BOT_TOKEN;
var clanTag = '2P8LCRU2';
var commandPrefix = '!cd';
bot.on('ready', function () {
    console.log("Logged in as " + bot.user.tag + "!");
    bot.user.setActivity("use " + commandPrefix + " help");
});
// <Message Listener>
bot.on('message', function (msg) {
    if (msg.author.bot)
        return; // Ignore bots.
    if (msg.channel.type === "dm")
        return; // Ignore DM channels.
    console.trace('received msg: ' + msg.content);
    if (msg.content === 'ping' || msg.content === commandPrefix + " ping") {
        msg.reply('pong');
    }
    if (!msg.content.startsWith(commandPrefix + ' '))
        return;
    // Handle Command
    var command = msg.content.substr(commandPrefix.length + 1);
    console.trace("Command: " + command);
    if (command === 'help') {
        msg.reply("Always use the prefix ``" + commandPrefix + "`` when talking to me. Currently there is only the ``" + commandPrefix + " deserter`` command, which lists all war participants that did not play their wargame in last 10 clanwars.");
    }
    else if (command === 'deserter') {
        getDeserters(msg);
    }
    else {
        msg.reply("Sorry, I don't know what you are asking for. Type ``" + commandPrefix + " help`` to list available commands.");
    }
});
// </Message Listener>
function getDeserters(msg) {
    var options = {
        method: 'GET',
        url: 'https://api.royaleapi.com/clan/' + clanTag + '/warlog',
        headers: { auth: royaleApiToken }
    };
    request(options, function (error, response, body) {
        var warlog = JSON.parse(body);
        if (warlog.error) {
            msg.reply("Sorry, there was an error requesting the Clash Royale API. Try again later.");
            console.error("Could not access royaleapi: " + options.method + " " + options.url + "\n\t" + warlog.status + " - " + warlog.message);
            return;
        }
        var embed = new Discord.RichEmbed();
        embed.setTitle("These Players did not play their wargame in last 10 clanwars:");
        embed.setDescription("This may happen because of several IRL-reasons, but has an massive impact on clan war result.");
        embed.setColor(4886754);
        embed.setTimestamp(new Date());
        embed.setFooter("Clan Royale Bot", "https://royaleapi.github.io/cr-api-assets/badges/Coin_01.png");
        var clanBadgeUrl;
        if (warlog.length < 1) {
            msg.reply("Could not get any Wars. Seems like the clan did not play any wars.");
            return;
        }
        for (var i in warlog) {
            var war = warlog[i];
            var warDate = new Date(war.createdDate * 1000);
            var myClanStanding = war.standings.find(function (clan) { return clan.tag == clanTag; });
            if (!clanBadgeUrl)
                clanBadgeUrl = myClanStanding.badge.image;
            var deserters = "";
            for (var l in war.participants) {
                var participant = war.participants[l];
                if (participant.battlesPlayed == 0) {
                    deserters += "    - [" + participant.name + "](https://spy.deckshop.pro/player/" + participant.tag + ")\n";
                }
            }
            if (deserters.length == 0) {
                deserters = " :champagne: Everyone played! :tada:";
            }
            embed.addField((Number(i) + 1) + (". War: " + warDate.toLocaleDateString("de-DE") + " (" + myClanStanding.warTrophiesChange + ")"), deserters);
        }
        embed.setThumbnail(clanBadgeUrl);
        msg.channel.send({ embed: embed })
            .then(function (sent) { return console.log("Sent a !deserter reply to " + msg.author.username); })
            .catch(console.error);
    }).on('error', function (e) {
        msg.reply("Sorry! My royaleapi.com-warlog-request failed... Try again later!");
        console.error(e);
    });
}
bot.login(discordBotToken);
//# sourceMappingURL=bot.js.map