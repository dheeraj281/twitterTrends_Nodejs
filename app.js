const express = require('express');
const bodyParser = require('body-parser');
const twitterWoeid = require('twitter-woeid');
const app = express();
const port = 3000;
const Twit = require('twit');
app.set('view engine', 'ejs');
var trend_list = [];
 
var T = new Twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  '',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});

	 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => res.render('trend', {trends: trend_list, add_class:"hide-error"}));

app.post('/', validate_woeid, (req,res)=> {
	
	if (trend_list.length > 0){
		trend_list.length = 0;
	}
    	T.get('trends/place', { id: req.woiedList[0].woeid, count: 10 }, function(err, data, response) {		
			for (i=0;i<data[0].trends.length; i++){
			 var useful_data= { trend_name: data[0].trends[i].name , tweetcount:data[0].trends[i].tweet_volume}
			 trend_list.push(useful_data);
			 };
			 
	         res.render('trend', {trends: trend_list, add_class:"hide-error"});	
	  })         
})	
	             	      	

function validate_woeid(req,res,next){
	let place= req.body.placeName; 
	req.woiedList=twitterWoeid.getSingleWOEID(place);
	console.log(req.woiedList)
	if (req.woiedList.length > 0){
		return next()
	}
	if (trend_list.length > 0){trend_list.length = 0;}	
	res.render('trend', {trends: trend_list, add_class:"show-error"})
}


app.listen(port, () => console.log('Example app listening at http://localhost:3000'));
