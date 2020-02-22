module.exports = {
    name: 'about',
    aliases: ['info'],
    description: 'About the bot',
    usage: [],
    catagory: "Misc",
    hidden: false,
    owner: false,
    guild: false,
    userPerms: [],
    runPerms: [],
	async execute(message, args) {
        try{
            message.channel.send(Client.config.about)
        } catch (error) {throw error}
    }
};