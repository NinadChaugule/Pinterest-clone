const mongoose= require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    user:{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'user',
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    likes:{
        type:Array,
        default: [],
    },
})

module.exports=mongoose.model('Post',postSchema);