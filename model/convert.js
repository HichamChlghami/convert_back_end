const mongoose = require('mongoose')
const schema = mongoose.Schema(
    {
        fileOutput:{
            type:String,
            required:true
        },
        
        convertType:{
            type:String,
     
        },
        filename:{
            type:String,
            required:true
        }
        
    }
)

const Convert = mongoose.model("convert",schema)
module.exports=Convert