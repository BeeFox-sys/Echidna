const {getGuildDoc} = require('../../utils')

module.exports = {
    name: 'setup application channel',
    aliases: [],
    description: 'Sets the channel applications are sent to',
    usage: [],
    catagory: "Setup",
    hidden: false,
    owner: false,
    guild: true,
    userPerms: ['MANAGE_ROLES'],
    runPerms: [],
	async execute(message, args) {
        try{
            let guild = await getGuildDoc(message.guild.id)
            let channel
            if(!args.length) guild.applicationChannel = null
            else{
                channel = message.guild.channels.cache.find(c=>{
                    if(c.name == args.join(" ")) return true
                    if(c.toString() == args[0]) return true
                    return false
                })
                if(!channel) return message.channel.send("That is not a valid channel!")
                guild.applicationChannel = channel.id
            }
            let error
            error,guild = await guild.save()
            if(error) throw error
            if(!guild.applicationChannel){
                return message.channel.send("Cleared the application channel!")
            } else {
                return message.channel.send(`Set application channel to ${channel}`)
            }
        } catch (error) {throw error}
    }
};