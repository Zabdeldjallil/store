require("dotenv").config()
const express=require("express")
const app=express();
const bodyparser=require("body-parser")
const ejs=require("ejs");
const mysql=require("mysql");
var dbconfig = require('./database');
const { json } = require("express");
const SecretKey=process.env.STRIPE_SECRET_KEY
const PublicKey=process.env.STRIPE_PUBLIC_KEY
const stripe = require('stripe')(SecretKey)
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
app.use(bodyparser.json())
app.use(express.json())
app.set("view engine",'ejs')
app.use(express.static("public"))
app.get("/",(req,res)=>{
connection.query("SELECT * FROM hommes",(err,result)=>{
    if(err)throw err
    res.render("index",{articles:result,stripePublicKey:PublicKey})
})  
})
app.get("/ladies",(req,res)=>{
    connection.query("SELECT * FROM femmes",(err,result)=>{
        if(err) throw err;
        res.render("ladies",{articles:result})
    })
})
app.get("/bebes",(req,res)=>{
    connection.query("SELECT * FROM bebes",(err,result)=>{
        if(err) throw err;
        res.render("bebes",{articles:result})
    })
})
app.get("/gentleman",(req,res)=>{
    connection.query("SELECT * FROM hommes",(err,result)=>{
        if(err) throw err;
        console.log(result)
        res.render("gentleman",{articles:result})
    })
})
app.get("/articleinfo/:ID",(req,res)=>{
    connection.query("SELECT * FROM hommes WHERE ID=?",[req.params.ID],(err,result)=>{
        console.log(result[0])
        res.render("articlesInfo",{article:result[0]})
    })
})
app.post("/purchase",(req,res)=>{
   /* console.log(req.body)
    res.json({message:"yeah"})*/
    connection.query("SELECT * FROM hommes",(err,results)=>{
        if(err) throw err;
        let total=0;
    req.body.items.forEach(item => {
         for (let index = 0; index < results.length; index++) {
               const result = results[index];
               if(result.ID==item.id) {
                console.log(result.price);
                console.log(item)
                total = total + parseFloat(result.price.replace("$",""))* item.quantity
                 console.log(total)
            }
           }
       });
       console.log(total)
        stripe.charges.create({
            amount:total*100,
            source:req.body.stripeTokenId,
            currency:'usd'
        }).then(function(){
            console.log('Charge Successfull')
            res.json({message:'Successfully purchased'})
        }).catch(function(){
            console.log("charge fail")
            res.status(500).end()
        })
    })
})
app.listen(8080)