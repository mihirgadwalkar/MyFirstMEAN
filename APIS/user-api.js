//importing express module
const exp = require('express')
//creating mini express object
const userApi = exp.Router();
//error handling in async
const expressErrorHandler = require("express-async-handler")
//importing bcryptjs
const bcryptjs = require("bcryptjs")
//importing jwt
const jwt = require("jsonwebtoken")
//add body parsing middleware
userApi.use(exp.json())

//import MongoClient
const mc = require("mongodb").MongoClient;

//connection string
const databaseUrl = "mongodb+srv://mg261:Nopassword%23@mgcluster.i0kfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//global variabl
let userCollectionObj;
//connect to DB
mc.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.log("Error in DB Connection", err)
    }
    else {
        //get database object
        let dbObj = client.db("myfirstdb")
        //create user collection object
        userCollectionObj = dbObj.collection("usercollection")
        console.log("Connected to Database Successfully")
    }
})

//GET
//http://localhost:3236/user/getusers
userApi.get("/getusers", expressErrorHandler(async (req, res) => {
    let usersList = await userCollectionObj.find().toArray()
    res.send({ message: usersList })

}))

//http://localhost:3236/user/getusers/<username>
userApi.get("/getusers/:username", expressErrorHandler(async (req, res, next) => {
    //get username from url params
    let un = req.params.username;
    //search for user
    let userObj = await userCollectionObj.findOne({ username: un })
    if (userObj === null) {
        res.send({ message: "User doesn't exist" })
    }
    else {
        res.send({ message: userObj })
    }
}))

//POST
//http://localhost:3236/user/createuser
userApi.post("/createuser", expressErrorHandler(async (req, res, next) => {
    //get user obj
    let newUser = req.body;
    //check user in db with the username
    let user = await userCollectionObj.findOne({ username: newUser.username })
    //if user exists
    if (user != null) {
        res.send({ message: "User already exists" })
    }
    else {
        //hash password
        let hashedPassword = await bcryptjs.hash(newUser.password, 7)
        //replace password
        newUser.password = hashedPassword;
        //insert
        await userCollectionObj.insertOne(newUser)
        res.send({ message: "User created" })
    }
}))

//PUT
//http://localhost:3236/user/updateuser/<username>
userApi.put("/updateuser/:username", expressErrorHandler(async (req, res, next) => {
    //get modified user
    let toModifyUser = req.body;
    //update
    await userCollectionObj.updateOne({ username: toModifyUser.username }, {
        $set: {
            ...toModifyUser
        }
    })
    res.send({ message: "User Modified" })
}))

//DELETE
//http://localhost:3236/user/deleteuser/<username>
userApi.delete("/deleteuser/:username", expressErrorHandler(async (req, res, next) => {
    //get username from url
    let un = req.params.username;
    //find user
    let user = await userCollectionObj.findOne({ username: un })
    if (user === null) {
        res.send({ message: "User doesn't exist" })
    }
    else {
        await userCollectionObj.deleteOne({ username: un })
        res.send({ message: "User removed" })
    }
}))

//user login
userApi.post('/login', expressErrorHandler(async (req, res) => {
    //get user credentials
    let credentials = req.body;
    let user = await userCollectionObj.findOne({ username: credentials.username })
    if (user === null) {
        res.send({ message: "Invalid Username" })
    }
    else {
        //compare the password
        let result = await bcryptjs.compare(credentials.password, user.password)
        if (result === false) {
            res.send({ message: "Invalid Password" })
        }
        else {
            //create token
            let signedToken = jwt.sign({ username: credentials.username }, 'abcdef', { expiresIn: 120 })
            res.send({ message: "Login Successful", token: signedToken, username: credentials.username, userObj: user })
        }
    }
}))

//export
module.exports = userApi;