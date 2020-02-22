const {getGuildDoc} = require('../../utils')
const {MessageEmbed, Util} = require('discord.js')
const {applications} = require('../../schemas')
const {escapeMarkdown} = Util

module.exports = {
    name: 'apply',
    aliases: [],
    description: 'Starts an application',
    usage: [],
    catagory: "Misc",
    hidden: false,
    owner: false,
    guild: false,
    userPerms: [],
    runPerms: ["EMBED_LINKS","ADD_REACTIONS"],
	async execute(message, args) {
        try{
            let appDoc = await applications.findOne({user:message.author.id,guild:message.guild.id})
            if(appDoc) return message.channel.send(`You have already submitted an application for this guild!`)
            let guild = await getGuildDoc(message.guild.id)
            if(!guild.questions.length) return message.channel.send(`This guild has no application questions! Ask a mod to set some up!`)
            if(!guild.applicationChannel) return message.channel.send(`This guild has no aplication channel! Ask a mod to set one up!`)
            if(!guild.verifiedRole) return message.channel.send(`This guild has no verified role! Ask a mod to set one up!`)
            if(message.member.roles.cache.has(guild.verifiedRole)) return message.channel.send("You are already verified!")
            let dmChannel = message.author.dmChannel
            let answers = []
            if(!dmChannel) dmChannel = await message.author.createDM()
            for (let index = 0; index < guild.questions.length; index++) {
                const question = guild.questions[index];
                try{
                    await dmChannel.send(`\n**Question ${index+1}:** ${question}`)
                } catch (error) {
                    console.error(error)
                    return message.reply.send("Something went wrong with your application, it is likely that I could not DM you, please make sure I am not blocked, and that you have DMs on for this server.")
                }
                let response = await dmChannel.awaitMessages((m=>m.author == message.author), { max: 1 })
                if(response.first().content.length > 1028) {
                    dmChannel.send("Answer must be less then 1024 characters!")
                    index--
                } else {
                    answers.push(response.first().content)
                }
            }
            let application = new MessageEmbed()
                .setTitle(`${escapeMarkdown(message.author.username)}'s application`)
                .setAuthor(message.author.username,message.author.avatarURL({size:64}))
                .setFooter(`Waiting Review\nUser ID: ${message.author.id}`)
                .setColor("56d7fc")
            for (let index = 0; index < guild.questions.length; index++) {
                const question = guild.questions[index];
                application.addField(question, answers[index])
            }
            let applicationChannel = Client.channels.resolve(guild.applicationChannel)
            let appMessage = await applicationChannel.send(application)
            appDoc = new applications({
                user: message.author.id,
                guild: message.guild.id,
                message: appMessage.id
            })
            let error, doc = await appDoc.save()
            if(error) throw error
            await appMessage.react("✅")
            await appMessage.react("❌")
            await dmChannel.send(`Your application for ${message.guild.name} has been submitted`)
        } catch (error) {throw error}
    }
};