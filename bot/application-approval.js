const {guilds,applications} = require("./schemas")

Client.on("messageReactionAdd", async (reaction, user)=>{
    if(user.id == Client.user.id) return
    if (reaction.message.partial) {
		try {
			await reaction.message.fetch();
		} catch (error) {
            console.error(error)
		}
	}
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
            console.error(error)
		}
    }
    if(reaction.emoji.name != "✅" && reaction.emoji.name != "❌") return
    if(!reaction.message.guild.member(user).hasPermission("MANAGE_ROLES")) return
    let application = await applications.findOne({message:reaction.message.id})
    if(!application) return
    let guild = await guilds.findOne({id:reaction.message.guild.id})
    if(!guild) return
    if(!guild.verifiedRole) return
    let applicant = reaction.message.guild.member(application.user)
    if(reaction.emoji.name == "❌"){
        await applicant.send(`I am sorry, your application for ${reaction.message.guild.name} was declined. You may submit another one if you wish`)
        await applications.deleteOne({message:reaction.message.id})
        let rejectEmbed = reaction.message.embeds[0]
        rejectEmbed.setColor("e8413e").setFooter(`Rejected\nUser ID: ${applicant.id}`)
        await reaction.message.edit(rejectEmbed)
    }
    if(reaction.emoji.name == "✅"){
        await applicant.roles.add(guild.verifiedRole, "Accepted Application")
        await applicant.send(`Your application for ${reaction.message.guild.name} was accepted! You have been verified on the server!`)
        await applications.deleteOne({message:reaction.message.id})
        let acceptEmbed = reaction.message.embeds[0]
        acceptEmbed.setColor("7cf754").setFooter(`Accepted\nUser ID: ${applicant.id}`)
        await reaction.message.edit(acceptEmbed)
    }
})