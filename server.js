const express = require('express');
const mongoose = require('mongoose');
const app = express();

const port = process.env.PORT || 3000;
/* Importing schema */
const shortUrl = require('./models/shortUrl');
/* mongoose connection */
mongoose.connect('mongodb://localhost/url');

/* setting up view engine for ejs */
app.set('view engine', 'ejs');
/* url  */
app.use(express.urlencoded({ extended: false }));
/* welcome screen */
app.get('/', async (req, res) => {
  /* finding all data in mongoDB and rendering */
  const shortUrls = await shortUrl.find({});
  res.render('index', { shortUrls: shortUrls });
});
/*  post request from form and  */
app.post('/shortUrl', async (req, res) => {
  /* creating data in mongoDB */
  await shortUrl.create({ full: req.body.url });
  res.redirect('/');
});
app.get('/:shortUrl', async (req, res) => {
  /* finding the url */
  const short = await shortUrl.findOne({ short: req.params.shortUrl });
  if(short == null) return res.sendStatus(404)
  /* updating clicks */
  short.clicks++
  short.save()
  /* redirecting to the url */
  res.redirect(short.full)
});

app.listen(port, () => {
  console.log('server is listnenig port:' + port);
});
