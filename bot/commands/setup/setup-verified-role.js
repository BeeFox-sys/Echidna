const {getGuildDoc} = require('../../utils')

module.exports = {
    name: 'setup verified role',
    aliases: [],
    description: 'Sets the verified role',
    usage: [],
    catagory: "Setup",
    hidden: false,
    owner: false,
    guild: false,
    userPerms: ['MANAGE_ROLES'],
    runPerms: [],
	async execute(message, args) {
        try{
            let guild = await getGuildDoc(message.guild.id)
            let role
            if(!args.length) guild.verifiedRole = null
            else{
                role = await message.guild.roles.cache.find(r=>{
                    if(r.name.toLowerCase() == args.join(" ").toLowerCase()) return true
                    if(r.toString() == args[0]) return true
                    if(r.id == args[0]) return true
                    return false
                })
                if(!role) return message.channel.send("That is not a valid role!")
                guild.verifiedRole = role.id
            }
            let error
            error,guild = await guild.save()
            if(error) throw error
            if(!guild.verifiedRole){
                return message.channel.send("Cleared the verified role!")
            } else {
                return message.channel.send(`Set verified role to ${role.name}`)
            }
        } catch (error) {throw error}
    }
};