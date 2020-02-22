const {MessageEmbed} = require.main.require("discord.js")

module.exports = {
    name: 'invite',
    aliases: [],
    description: 'Generates an invite link for the bot!',
    usage: [],
    catagory: "Misc",
    hidden: false,
    owner: false,
    guild: false,
    userPerms: [],
    runPerms: ["EMBED_LINKS"],
	async execute(message, args) {
        try{
            let inviteURL = await Client.generateInvite(Client.permissions)
            let clientApp = Client.oauth
            let gitUrl = "https://github.com/BeeFox-sys/Echidna"
            let serverURL = 'https://discord.gg/pkCYXUB'

            let inviteEmbed = new MessageEmbed()
                .setTitle(`Invite ${Client.user.username} to your server`)
                .setImage(await Client.user.avatarURL({size:256}))

            if(clientApp.botPublic) inviteEmbed.addField("Invite Link",`[Click here to invite!](${inviteURL})`,true)
            if(serverURL) inviteEmbed.addField("Support Server",`[Click Here to access the support server](${serverURL})`)
            if(gitUrl) inviteEmbed.addField("Github",`[Click here to see the code](${gitUrl})`)
            
            
            if(inviteEmbed.fields.length == 0) return message.channel.send("Sorry! This bot has no links right now")
            message.channel.send(inviteEmbed)
        } catch (error) {throw error}
    }
};