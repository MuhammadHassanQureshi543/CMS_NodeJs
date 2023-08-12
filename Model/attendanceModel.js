const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
    date:{
        type:String
    },
    status:{
        type:String
    }
})

const Attendance = mongoose.model('Attendance',attendanceSchema)
module.exports = Attendance;