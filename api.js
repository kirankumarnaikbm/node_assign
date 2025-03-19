const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const {PORT, db_password, db_username} = process.env;
const app = express();
const dbURL = `mongodb+srv://${db_username}:${db_password}@cluster0.asl73.mongodb.net/`;
mongoose.connect(dbURL).then(function(connection){
    console.log("Connection Success");
}).catch(err => console.log(err));


const userSchemaRules = {
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    website:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
}

const postSchemaRules = {
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
}

const commentSchemaRules = {
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    body:{
        type:String,
        required:true
    },
}

const userSchema = new mongoose.Schema(userSchemaRules);
const UserModel = mongoose.model("users",userSchema);
const postSchema = new mongoose.Schema(postSchemaRules);
const PostModel = mongoose.model("post",postSchema);
const commentSchema = new mongoose.Schema(commentSchemaRules);
const CommentModel = mongoose.model("comment",commentSchema);


app.use(express.json());

app.use(function(req,res,next){
    if(req.method == "POST"){
        const userDetails = req.body;
        const isEmpty = Object.keys(userDetails).length == 0;
        if(isEmpty){
            res.status(404).json({
                status:"failure",
                message:"user Details are empty"
            })
        }else{
            next()
        }
    }else{
        next();
    }
});

app.post("/users",createUserHandler);
app.get("/users",getAllUsers);
app.get("/load",getAll);
app.delete("/users/:userId",deleteUserById);
app.get("/users/:userId",getUserById)

async function createUserHandler(req,res){
   try{
    const userDetails = req.body;
    const user = await UserModel.create(userDetails);
    res.status(200).json({
        status:"success",
        message:`added the user`,
        user,
    })
   }catch(err){
    res.status(500).json({
        status:"failure",
        message:err.message
    })
   }
}

async function getUserById(req,res){
    try{
        const userId = req.params.userId;
    const userDetails = await UserModel.findById(userId);
    if(userDetails == {}){
        throw new Error(`user with ${userId} not found`);
    }else{
        res.status(200).json({
            status:"success",
            message:userDetails
        })
    }
    }catch(err){
        res.status(404).json({
            status:"failure",
            message:err.message
        })
    }
}
async function deleteUserById(req,res){
    try{
        const userId  = req.params.userId;
        const userDetails = await UserModel.findById(userId);
    if(userDetails == {}){
        throw new Error(`user with ${userId} not found`);
    }else{
        await UserModel.findByIdAndDelete(userId);
        res.status(200).json({
            status:"successfull Deletion",
            message:userDetails
        })
    }
    }catch(err){
        res.status(404).json({
            status:"failure",
            message:`element with id:${elementId} not found to delete`
        })
    }
}

async function getAllUsers(req,res){
    try{
     console.log("I am inside get method");
 
    const userDataStore = await UserModel.find();
     if(userDataStore.length == 0){
         throw new Error("No Users Found");
     }
     res.status(200).json({
         status:"success",
         message:userDataStore
     })
    }catch(err){
         res.status(404).json({
             status:"failure",
             message:err.message
         })
    }}
    async function getAll(req,res){
        try{
         console.log("I am inside get method");
     
        const userDataStore = await UserModel.find();
        const postData=await PostModel.find();
        const commentData=await CommentModel.find();
         if(userDataStore.length == 0 && postData==0 && commentData==0){
             throw new Error("No Data Found");
         }
         res.status(200).json({
             status:"success",
             message:{users:userDataStore,posts:postData,comments:commentData}
         })
        }catch(err){
             res.status(404).json({
                 status:"failure",
                 message:err.message
             })
        }}


app.use(function(req,res){
    res.status(404).json({
        status:"failure",
        message:"404 Page Not Found"
    })
})


app.listen(PORT,function(){
    console.log(`server is running at this port ${PORT}`);
})