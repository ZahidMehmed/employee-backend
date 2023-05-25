const mongoose = require('mongoose')
const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    posterImage: String,
    eventStartTime: String,
    eventStartDate: String,
    eventEndDate: String,
    eventEndTime: String,
 })

module.exports = mongoose.model('Events',  EventSchema)