var request = require('request');
var Discord = require('discord.js');
var bot = new Discord.Client();
var royaleApiToken = process.env.ROYAL_API_TOKEN;
var discordBotToken = process.env.DISCORD_BOT_TOKEN;
var clanTag = '2P8LCRU2';
var msgPrefix = '!cr';
console.log('start');
bot.on('ready', function () {
    console.log("Logged in as " + bot.user.tag + "!");
    bot.user.setActivity("use " + msgPrefix + " help");
});
// <Message Listener>
bot.on('message', function (msg) {
    if (msg.author.bot)
        return; // Ignore bots.
    if (msg.channel.type === "dm")
        return; // Ignore DM channels.
    console.log('received msg');
    if (msg.content === 'ping' || msg.content === msgPrefix + " ping") {
        msg.reply('pong');
    }
    console.log("Prefix incorrect? " + !msg.content.startsWith(msgPrefix));
    if (!msg.content.startsWith(msgPrefix + ' '))
        return;
    // Handle Command
    var command = msg.content.substr(msgPrefix.length + 1);
    console.log("Command: " + command);
    if (command === 'help') {
        msg.reply("Always use the prefix ``" + msgPrefix + "`` when talking to me. Currently there is only the ``" + msgPrefix + " deserter`` command, which lists all war participants that did not play their wargame in last 10 clanwars.");
    }
    else if (command === 'deserter') {
        getDeserters(msg);
    }
    else {
        msg.reply("Sorry, I don't know what you are asking for. Type ``" + msgPrefix + " help`` to list available commands.");
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
console.log('ende');
//# sourceMappingURL=bot.js.map