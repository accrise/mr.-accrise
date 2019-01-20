const Discord = require('discord.js');
const Client = new Discord.Client();
var profanities = require('profanities');
var fs = require('fs');
prefix = "-";

var prefixJson = JSON.parse(fs.readFileSync('prefix.json', 'utf8'));
var UserData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
var commandsList = fs.readFileSync('Storage/commands.txt', 'utf8');
Client.commands = new Discord.Collection();

function loadCmds(){
    fs.readdir('./commands/', (err, files) =>{
        if(err) console.error(err);

        var jsfiles = files.filter(f => f.split('.').pop() == 'js');
        if(jsfiles.length <= 0) {return console.log('No commands found.')}
        else{console.log(jsfiles.length + ' commands found.')}

        jsfiles.forEach((f, i) => {
            delete require.cache[require.resolve(`./commands/${f}`)];
            var cmds = require(`./commands/${f}`);
            console.log(`Command ${f} loading.`)
            Client.commands.set(cmds.config.command, cmds);
        })
    })
}

function UserInfo(user){
    var finalString = '';

    finalString += '**' + user.username +  '**, with the **ID** of **' + user.id + "** ";
    var userCreated = user.createdAt.toString().split(' ');
    finalString += ', was account created ' + userCreated[1] + ' ' + userCreated[2] + ', ' + userCreated[3]
    return finalString;
}

loadCmds()

Client.on('ready', () =>{
    console.log('Mr. Accrise initialized!');

    Client.user.setStatus('dnd');
    Client.user.setActivity('Making Accrise a sandwich.');
});

Client.on('message', message =>{
    let sender = message.author;
    let msg = message.content.toUpperCase();
    var cont = message.content.slice(prefix.length).split(" ");
    var args = cont.slice(1);

    if(!message.content.startsWith(prefix)) return;

    if(msg == prefix + "RELOAD"){
        message.channel.send({embed:{title: "Successful!", description: "All commands have been reloaded.", color: 0x17A589}})
        loadCmds()
    }

    var cmd = Client.commands.get(cont[0]);
    if(cmd) cmd.run(Client, message, args);



    for (x = 0; x < profanities.length  ; x++) {
        if(message.content.toUpperCase() == profanities[x].toUpperCase()){
            message.channel.send(sender + ", please do not say such vulgar language.");
            message.delete();
            return;
        }
    }
    if(sender.id == 529381146283474954){
        return;
    }
});

Client.on('guildMemberAdd', member =>{
    member.guild.channels.get('529376868411899905').send(member + " has joined the server.")
});

Client.on('guildMemberRemove', member =>{
    member.guild.channels.get('529376868411899905').send(member + " has left the server.")
});

Client.login('NTI5MzgxMTQ2MjgzNDc0OTU0.DwwAqA.lOZ8cH6d8YrqtznlNk3ClLSmpOg');