//importing express module
const exp = require('express')
//creating express object
const app = exp();
//import path module
const path = require("path")

//connect angular app with server
app.use(exp.static(path.join(__dirname,'./dist/MyFirstMEAN/')))

//import APIs
const userApi = require("./APIS/user-api")
//const productApi = require("./APIS/product-api")

//execute speicfic api based on path
app.use("/user",userApi)
//app.use("/product",productApi)

//invalid path
app.use((req,res,next)=>{
    res.send({message:`Path ${req.url} is invalid`})
})

//error handling middleware
app.use((err,req,res,next)=>{
    res.send({message:`Error is ${err.message}`})
})

//assigning port number
const port = 3236;
app.listen(port,()=>{
    console.log(`Server listening on port ${port}...`)
})