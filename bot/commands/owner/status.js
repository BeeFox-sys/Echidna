const {MessageEmbed} = require.main.require("discord.js")

module.exports = {
    name: 'owner-status',
    aliases: [],
    description: 'Sets the bot status',
    usage: [],
    catagory: "OWNER",
    hidden: true,
    owner: true,
    guild: false,
    userPerms: [],
    runPerms: [],
	async execute(message, args) {
        try{
            if(args.length < 1){
                return await Client.user.setActivity(`${Client.config.prefix}help`, {type:"WATCHING"})
            } else {
                return await Client.user.setActivity(`${Client.config.prefix}help | ${args.join(" ")}`, {type:"WATCHING"})
            }
        } catch (error) {throw error}
    }
};