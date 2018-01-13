const Discord = require("discord.js");
const bot = new Discord.Client();
const chalk = require("chalk");
const moment = require("moment");
const config = require("./config.json");
const join = require("./join.json");
const fs = require("fs");
let countries = ["AX","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BA","BW","BV","BR","VG","IO","BN","BG","BF","BI","KH","CM","CA","CV","KY","CF","TD","CL","CN","HK","MO","CX","CC","CO","KM","CG","CD","CK","CR","CI","HR","CU","CY","CZ","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","ET","FK","FO","FJ","FI","FR","GF","PF","TF","GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GG","GN","GW","GY","HT","HM","VA","HN","HU","IS","IN","ID","IR","IQ","IE","IM","IL","IT","JM","JP","JE","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MK","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","AN","NC","NZ","NI","NE","NG","NU","NF","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RE","RO","RU","RW","BL","SH","KN","LC","MF","PM","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SK","SI","SB","SO","ZA","GS","SS","ES","LK","SD","SR","SJ","SZ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UM","UY","UZ","VU","VE","VN","VI","WF","EH","YE","ZM","ZW"]

bot.on("ready", () => {
  console.log(`Successfully logged in as ${chalk.blue(bot.user.username)}`);
  console.log(`${chalk.blue(bot.users.size - 2)} users cached`);
  console.log(`${chalk.blue(bot.channels.size)} channels cached`);
  console.log(`${chalk.blue(bot.guilds.size)} guilds cached`)
});

bot.on("guildMemberAdd", async member => {
  let embed = new Discord.RichEmbed()
  .setTitle(`Welcome ${member.user.username}`)
  .setColor(8388608)
  .setDescription(`Welcome to the Villoux Server System ${member}!\nTo verify yourself, please follow the instructions below.`)
  .addField("Instructions", "Please review the Discord Welcome Message and Nickname Requirements found here: http://www.villoux.com/villouxs-discord-server.html.  Once you have completed this, please follow the instructions for verifying your account.")
  .addField("Example", ".verify <username> <country code>")
  member.guild.channels.find("name", "verification_console").send({ embed });
  member.user.send(`${member}, ${join.joinMsg}`)
});

bot.on("message", async message => {
  let args = message.content.split(" ").slice(1);
  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);
  if (!message.content.startsWith(config.prefix)) return;
  Array.prototype.joinFrom = function(start) {
      return this.slice(start).join(' ')
  }

  let deleteBotMsg = function(msg) {
      message.reply(msg)
          .then(m => {
              m.delete(5000)
          })
  }

  if (command === "verify") {
    let nick = args[0];
    let area = args[1];
    if (args.length < 2) {
      return message.channel.send("You didn't provide enough arguments, try \`.verify <name> <your country's 2 letter abbreviation>\` Example usage: \`.verify Sean US\`");
    }
    if (args.length > 2) {
      return message.channel.send("You provided too many arguments, try \`.verify <name> <your country's 2 letter abbreviation>\` Example usage: \`.verify Sean US\`");
    }
    if (!countries.includes(args[1].toUpperCase())) {
      return message.channel.send("That's not a valid country, for a list of all the valid countries, visit this url: https://goo.gl/N8i2Ef");
    }
    message.member.removeRole(message.guild.roles.get("355574470062243850"));
    message.member.setNickname(`${nick} ${countries[countries.indexOf(area.toUpperCase())]}`);
    console.log(`${chalk.bgRed(message.author.tag)} verified at ${chalk.bgBlue(moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"))}`);
    message.guild.owner.send(`${message.member.user.tag} (${nick} ${countries[countries.indexOf(area.toUpperCase())]}) just verified at ${moment(new Date()).format("MMMM Do YYYY, h:mm:ss a")}`);
  }

  if (command === "edit") {
    if (message.author.id !== "233321708679856128") return;
    if (!args.length === 0) {
      deleteBotMsg("You need to provide a message after .edit, try \`.edit This is a join message.\`")
      return;
    }
    fs.writeFile("./join.json", JSON.stringify({ joinMsg: args.joinFrom(0) }), err => {
        if (err) throw err;
    });
    //config.joinMsg += args.joinFrom(0);
    deleteBotMsg(`Successfully set the join message to \`\`\`${join.joinMsg}\`\`\``);
  }

  if (command === "eval") {
    if (message.author.id !== "292836573001547777") return;
    var ev
    try {
      ev = eval(args.join(" "))
      message.channel.send(ev, {
        code: "js"
      });
    } catch (e) {
      message.channel.send(e, {
        code: "js"
      });
    }
  }
});

bot.login(config.token);
process.on("unhandledRejection", console.error);
