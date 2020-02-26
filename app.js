const express = require('express');
const app = express();
const shorturl = require('./models/shortUrl');
const mongoose = require('mongoose');
const url = 'mongodb+srv://alok:12345@cluster0-t7wfy.gcp.mongodb.net/test?retryWrites=true&w=majority'


mongoose.connect(url , {useUnifiedTopology:true, useNewUrlParser:true}, (err)=>{
   if(err) {
       console.log(err)
   }
   console.log('connected to the db')

})


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}))

app.get('/', async(req,res)=> {
    const shortUrls = await shorturl.find()
    res.render('index', {shortUrls : shortUrls})
})

app.post('/shortUrls',  async(req,res)=> {
    await shorturl.create({full : req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrls', async(req,res)=>{
   const shortUrl = await shorturl.findOne({
       short:req.params.shortUrls
   })
     if(shortUrl  == null) {
         return res.sendStatus(404).json({message:'Not found'})
     }
     shortUrl.clicks++;
     shortUrl.save();
     res.redirect(shortUrl.full)

})



app.listen(process.env.PORT || 5000 , ()=> {
    console.log(`App running on the server`)
})