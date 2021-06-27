//importing express module
const exp = require('express')
//creating mini express object
const productApi = exp.Router();

//sample route
productApi.get("/getproducts",(req,res)=>{
    res.send({message:"Reply from Product API"})
})


//export
module.exports=productApi;