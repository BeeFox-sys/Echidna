const {profiles} = require("../../schemas")

module.exports = {
    name: 'help',
    aliases: [],
    description: 'Displays commands',
    usage: ['help [command]'],
    catagory: "Misc",
    hidden: false,
    owner: false,
    userPerms: [],
    runPerms: [],
	async execute(message, args) {
        if(args.length > 0) {
            try{
                let command = Client.commands.get(args.join(" ").toLowerCase())
                if(!command) return message.channel.send(`Command ${args.join(" ")} not found!`)
                let commandHelp = `**__${command.name}__**${command.aliases && command.aliases.length > 0 ? ` (*${command.aliases.join(", ")}*)` : ``}\n${command.description}\n__Usage__:\n${command.usage.join('\n')}`
                return message.channel.send(commandHelp)
            } catch (error) {throw error}
        } else {
            try{
                const data = [];
                data.push('**__Command List__**');
                let catagories = {
                }
                for (const commandObj of Client.commands) {
                    let command = commandObj[1]
                    if(!command.hidden){
                        if(!catagories[command.catagory]) catagories[command.catagory] = ""
                        catagories[command.catagory] += `\n${Client.config.prefix}**${command.name}** - ${command.description.split("\n")[0]}`
                    }
                }
                for (const catagoryName in catagories) {
                    if (catagories.hasOwnProperty(catagoryName)) {
                        const catagory = catagories[catagoryName];
                        data.push(`\n\n__${catagoryName}__${catagory}`)
                    }
                }
    
                data.push("\n\nWords in <angle brackets> are *required parameters*.\nWords in [square brackets] are *optional parameters*.\n**Note that you should not include the brackets in the actual command.**")
                data.push(`\nYou can send \`${Client.config.prefix}help [command name]\` to get info on a specific command!`);
                message.channel.send(data.join(" "))
            } catch (error) {throw error}
        }
    }
};