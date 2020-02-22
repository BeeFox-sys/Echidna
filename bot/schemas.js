const Mongoose = require.main.require("mongoose")


let guild = new Mongoose.Schema({
    id: String,
    questions: [String],
    applicationChannel: String,
    verifiedRole: String
})
let user = new Mongoose.Schema({
    id: String
})
let application = new Mongoose.Schema({
    user: String,
    guild: String,
    message: String
}).index({user: 1, guild: 1},{unique:true})


module.exports = {
    users: Mongoose.model('users', user),
    guilds: Mongoose.model('guilds',guild),
    applications: Mongoose.model('applications',application)
}