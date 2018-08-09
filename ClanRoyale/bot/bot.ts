import * as Discord from "discord.js";
import * as cmds from "./commands/deserters";

const bot = new Discord.Client();

const ROYALE_API_TOKEN = process.env.ROYALE_API_TOKEN;

var clanTag = '2P8LCRU2';
var commandPrefix = '!cr';

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity(`use ${commandPrefix} help`);
});

bot.on('error', error => {
    console.error(error); //`Discord bot got an error on it's websocket...`
});

bot.on('disconnect', closeEvent => {
    console.log(`Discord bot disconnected: ${closeEvent.code} - Cleanly? ${closeEvent.wasClean} - reason:${closeEvent.code}`);
});

// <Message Listener>
bot.on('message', msg => {
    if (msg.author.bot) return; // Ignore bots.
    if (msg.channel.type === "dm") return; // Ignore DM channels.
    console.trace(`received msg: ${msg.content}`);
    if (msg.content === 'ping' || msg.content === `${commandPrefix} ping`) {
        msg.reply('pong');
    }
    if (!msg.content.startsWith(commandPrefix + ' ')) return;
    // Handle Command
    var command = msg.content.substr(commandPrefix.length + 1);
    console.trace(`Command: ${command}`);
    if (command === 'help') {
        msg.reply("Always use the prefix ``" + commandPrefix + "`` when talking to me. Currently there is only the ``" + commandPrefix + " deserter`` command, which lists all war participants that did not play their wargame in last 10 clanwars.");
    } else if (command === 'deserter') {
        cmds.cmdDeserters(msg, clanTag, ROYALE_API_TOKEN);
    } else {
        msg.reply("Sorry, I don't know what you are asking for. Type ``" + commandPrefix + " help`` to list available commands.");
    }
});
// </Message Listener>

export default bot;
