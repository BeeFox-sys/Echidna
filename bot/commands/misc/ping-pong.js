module.exports = {
    name: 'ping',
    aliases: ['pong'],
    description: 'Responds to the user',
    usage: [],
    catagory: "Misc",
    hidden: false,
    owner: false,
    guild: false,
    userPerms: [],
    runPerms: [],
	async execute(message, args) {
        try{
            message.channel.send("Pong!")
        } catch (error) {throw error}
    }
};