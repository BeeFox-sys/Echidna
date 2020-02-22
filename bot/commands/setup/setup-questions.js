const {getGuildDoc} = require('../../utils')
const {escapeMarkdown} = require("discord.js").Util

module.exports = {
    name: 'setup questions',
    aliases: ['setup question'],
    description: 'Sets up the application questions',
    usage: ['setup questions','setup questions <Question Number> <Question...>'],
    catagory: "Setup",
    hidden: false,
    owner: false,
    guild: true,
    userPerms: ['MANAGE_ROLES'],
    runPerms: [],
	async execute(message, args) {
        try{
            let guild = await getGuildDoc(message.guild.id)
            let questionNum = parseInt(args.shift())
            let question = args.join(" ")
            if(isNaN(questionNum)){
                if(!guild.questions.length) return message.channel.send("There are no questions in the application!")
                let questionList = `> **${escapeMarkdown(message.guild.name)} Application Questions**`
                for (let index = 0; index < guild.questions.length; index++) {
                    const question = guild.questions[index];
                    questionList += `\n**Question ${index+1}:** ${question}`
                }
                return message.channel.send(questionList)
            }
            if(question.length > 256) return message.channel.send("Question must be less then 256 characters")
            guild.questions[questionNum-1] = question
            guild.markModified('questions')
            let changed = false
            guild.questions = guild.questions.filter(n=>{
                if(!n) changed = true
                return n
            })
            if(guild.questions.length > 20) return message.channel.send("There is a maximum of 20 questions!")
            let error
            error, guild = await guild.save()
            if(error) throw error
            return message.channel.send(`Set question ${questionNum} to ${question}${changed?`\n*Question number may have changed as empty questions were removed*`:''}`)

        } catch (error) {throw error}
    }
};