const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const Gamedig = require('gamedig');

bot.on('ready', () => {
  var interval = setInterval(function () {
    let guild = bot.guilds.cache.get(config.discord);
    let channel = guild.channels.cache.get(config.channel);
    Gamedig.query({
      type: 'csgo',
      host: config.ipabs, // This needs to be a string
      port: config.port // This needs to be a number & is optional, unless you're not using the default port for that gameserver type
    }).then((state) => {
      bot.user.setActivity(state.players.length + "/" + state.maxplayers);
      channel.setName(state.players.length + " Connected"); // Enable or disable the Channel player count
    }).catch((error) => {
      console.log(error);
    });
  }, 1000);
});

bot.on('message', (message) => {

  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "playerscount") {
    message.delete();
    Gamedig.query({
      type: 'csgo',
      host: config.ipabs, // This needs to be a string
      port: config.port // This needs to be a number & is optional, unless you're not using the default port for that gameserver type
    }).then((state) => {
      message.channel.send(`There is ${state.players.length}/${state.maxplayers} connected players.`);
    }).catch((error) => {
      message.channel.send(`Server offline or not found.`);
    });
  }
  if (command === "serverstats") {
    message.delete();
    Gamedig.query({
      type: 'csgo',
      host: config.ipabs, // This needs to be a string
      port: config.port // This needs to be a number & is optional, unless you're not using the default port for that gameserver type
    }).then((state) => {
      let embed = new Discord.MessageEmbed()
        .setTitle("Server Stats")
        .addField('Name', state.name, true)
        .addField('Map', state.map, true)
        .addField('Connected', state.players.length, true)
        .addField('Max Players', state.maxplayers, true)
        .addField('Ping', state.ping, true)
        .addField('Command connect', state.connect, true)
        .setTimestamp()
        .setColor('RANDOM')
      message.channel.send(embed)
    }).catch((error) => {
      message.channel.send(`Server offline or not found.`);
    });
  }
})

bot.login(config.token);