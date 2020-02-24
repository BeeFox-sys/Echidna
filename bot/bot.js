const {Client:DiscClient, Collection, SnowflakeUtil, DiscordAPIError} = require.main.require("discord.js")
const {userFromMention,humanReadablePermissions,getGuildDoc} = require.main.require("./utils")

//Setup Client
const client = new DiscClient({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
global.Client = client
Client.config = require.main.require("../config")
Client.applications = new Map()
//Setup Commands
Client.commands = new Collection();
Client.permissions = ["MANAGE_ROLES","SEND_MESSAGES","VIEW_CHANNEL","READ_MESSAGE_HISTORY"]
//Read Commands
const fs = require.main.require('fs');
const getAllFiles = function(dirPath, prevFiles) {
    let files = fs.readdirSync(dirPath)
    let arrayOfFiles = prevFiles || []

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
        arrayOfFiles.push(dirPath+"/"+file)
        }
    })
    return arrayOfFiles
} 

const commandFiles = getAllFiles('./bot/commands',[]).filter(file => file.endsWith('.js'));
//Add all command files to command list
Client.maxCommandLength = 0
for (const file of commandFiles) {
    const command = require.main.require(`./${file.substring(6)}`);
    command.fileLoc = `./${file.substring(6)}`
    Client.commands.set(command.name, command);
    if(command.name.split(" ").length > Client.maxCommandLength) Client.maxCommandLength = command.name.split(" ").length
    //Create permissions list from commands
    for (const perm of command.runPerms) {
        if(!Client.permissions.includes(perm)) Client.permissions.push(perm)
    }
}

//setup db
const Mongoose = require.main.require("mongoose")
Mongoose.connect(Client.config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
Mongoose.connection
    .on('error',(error)=>{console.error(error);process.exit(1)})
    .once('open', function () {
    console.log("Connected to database")
});
require("./application-approval")
//Run bot
Client.on('ready', async () => {
    console.log(`Logged in as ${Client.user.tag} (ID: ${Client.user.id})!`);
    console.log(`${Client.guilds.cache.size} servers`);
    //Set client application
    Client.oauth = await Client.fetchApplication()
    await Client.user.setActivity(`${Client.config.prefix}help`, {type:"WATCHING"})
})
//Message handling
.on("message",async message =>{
    if(message.author.bot) return;

    //Get args
    let args = message.content.split(" ");
    //Check if starts with prefix or mention
    if(message.content.startsWith(Client.config.prefix)){
        //remove prefix from first argument
        args[0] = args[0].substring(Client.config.prefix.length);
    }
    else if (await userFromMention(args[0]) === Client.user){
        //Remove mention
        args.shift();
    }
    else return

    try {
        //Find Command
        let commandName = "", command = null
        let commandArray = args.slice(0,Client.maxCommandLength)
        while(!command){
            if(commandArray == 0) break
            commandName = commandArray.join(" ")
            command = Client.commands.get(commandName) || Client.commands.find(cmd => cmd.aliases.includes(commandName));
            if(!command) commandArray.pop()
        }
        args.splice(0,commandArray.length)
        //Ignore if there is no command
        if(command == null) return;

        // Permissions check
        if(
            //Ignore owner only commands if user is not owner
            (command.owner && Client.oauth.owner != message.author) ||
            //Ignore commands if user doesn't have right permissions
            (message.member && !message.member.hasPermission(command.userPerms)) || 
            //Ignore guild only commands in DMs
            (command.guild && !message.guild) 
        ) return
        
        //Check to see if the bot needs any perms to run
        if(message.guild && command.runPerms){
            let missingPerms = message.guild.me.permissionsIn(message.channel).missing(command.runPerms)
            if(missingPerms.length > 0){
                let missingReadable = ""
                missingPerms.forEach(perm => {
                    missingReadable += "\n"+humanReadablePermissions[perm]
                })
                return await message.channel.send(`Missing Permissions!**${missingReadable}**\nPlease make sure that ${Client.user} has these permissions, and then try the command again. You may need to ask a server administor to check these.`)
            }
        }

        //Run command
        return await command.execute(message, args)

    } catch (error) {
        //Error Handling
        let errorID = parseInt(SnowflakeUtil.generate())
            .toString(26)
            .toUpperCase()
        error.id = errorID
        console.error(error);
        message.reply(`there was an error trying to execute that command!\nError ID: \`${errorID}\``);
    }

})
.login(Client.config.token)
//Graceful shutdown
process.on('SIGTERM', async () => {
    await Client.destroy()
    console.log("Destroyed client")
    process.exit(0)
  });