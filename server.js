const express=require('express');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

const MongoClient = require('mongodb').MongoClient;
//const url = "mongodb://localhost:27017/";




/*
********************************************************************************************
*/
//You have to update the below variable. 
// url  will contains your mongodb cluster link
const url="";
// Your GmAil
let myemail='';
//Your gmail Password
let mypas='';
/*
********************************************************************************************
*/




const app=express();
app.set('view engine', 'ejs');



makeCollectiondb();
var gkey=-1;
var d;



app.get('/',(req,res)=>{
	res.render('form');
});


app.get('/selectSlot',(req,res)=>{
	

	console.log(req.query);
	gkey=generateKey();


	d=req.query;
	d['slot']=-1;
	d['slots']=[];
	d['verificationKey']=gkey;
	d['bookingconfirmed']=0;

	(async () => {
		await fetchslots(d);
		console.log("Welcomee");
		console.log(d);		
		console.log(getDateInString(d['slots']));
		d['time']=getDateInString(d['slots']);
		console.log("Fetch Slots");
		console.log(d);
		res.render('select_slot',{data:d});	   
	})();
	
});

app.get('/emailConfirmation',(req,res)=>{

	console.log(d);
	if(d && d['verificationKey'] && req.query.slot)
	{
		d['slot']=req.query.slot;
	}
	else
	{
		return res.redirect('/');
	}

	console.log("document is inserting");
	insertTrialRequestDb(d);
	console.log("Email is sending");
	sendTrialEmail(d,req.headers.host);

	console.log('Email');
	console.log(d);

	res.render('verification_link');
	//res.send("Verification link is sent on the mail");	
	
});

app.get('/confirmTrial',(req,res)=>{
	//res.send('Your class is confirmed'+req.query.key);

	if(req.query.key)
	{
	//	console.log('e');
		confirmBooking(req.query.key,(data,error)=>{
			console.log(data);
			if(data.length==1)
			{
				d=data[0];
				updateConfirmDb();
				var t = new Date(parseInt(d.slot));		
				
				res.render('booking_confirmed',{name:d.pname,time:t.toString()})
				//res.send(message);
			}
			else
			{
				res.send('Invalid key');
			}
		});
	}
	else{
		res.send('Invalid Key');
	}

});




const port=process.env.PORT||'5000';
app.listen(port,()=>{
	console.log('srever started at '+port);
});




function sendTrialEmail(data,baseUrl) {

	let verifylink='http://'+baseUrl+'/confirmTrial?key='+data.verificationKey;
	//console.log(verifylink);
	//console.log('sendTrialEmail');
	//return ;
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: myemail,
	    pass: mypas
	  }
	});

	var mailOptions = {
	  from: myemail,
	  to: data.pemail,
	  subject: ' NotchUp Trial Class Booked successfully',
	  html: `	<html>
				<head>
					<title></title>
					<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/4.5.2/flatly/bootstrap.min.css" integrity="sha384-qF/QmIAj5ZaYFAeQcrQ6bfVMAh4zZlrGwTPY7T/M+iTTLJqJBJjwwnsE5Y0mV7QK" crossorigin="anonymous">
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
					<script src="js/script.js"></script>
					
				</head>
				<body>


							<h4>Dear `+data.pname+`<br>

							`+data.cname+`'s class at `+millToDate(data.slot)+` has been booked.<br>
						   </h4>
					<h3>
								<a href='`+verifylink+`'><button type="button" class="btn btn-primary btn-lg">Confirm your booking</button></a> 
							

					</h3>


				</body>
				</html>
			`
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});

	// body...
}

function generateKey(){
	  key=Math.floor((Math.random() * 10000) + 54);
	  return key;
}


function insertTrialRequestDb(data)
{
	  MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("notchup");
	  console.log(data);
	  dbo.collection("bookingTrial").insertOne(data, function(err, res) {
	    if (err) throw err;
	    console.log("1 document added");
	    db.close();
	  });
});
}


function makeCollectiondb()
{
 	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("notchup");
	  dbo.createCollection("bookingTrial",{useNewUrlParser:true,useUnifiedTopology:true}, function(err, res) {
	    if (!err){
	    console.log("Collection created!");
		}
	    db.close();
	  });
    });
}

function confirmBooking(key,callback)
{
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("notchup");
	  var query = { 'verificationKey': parseInt(key) };
	  dbo.collection("bookingTrial").find(query).toArray(function(err, result) {
	    if (err) throw err;
	    db.close();
	    return callback(result);
	  });
	});
	return [];
}


async function fetchslots(data)
{
	var url='https://script.googleusercontent.com/macros/echo?user_content_key=LQpXDlgNTSCSjp0V0Zcp8fNjiDZl7MQ9lxRyj_zd44YXUrpR-ps3b5zlCZ0GrghtBSAp_llINX4gJvJ8FkUrGEjh4JiZysq4m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnC09Nb0QZ6ca_LU0vmo6mSiQ7SyFG3CgdL9-1Vgcha-TAYaAGhh-9xNG-9rMNEZHQRElvdDletx0&lib=MlJcTt87ug5f_XmzO-tnIbN3yFe7Nfhi6';


	const fetch = require('node-fetch');


	var currentTime=Math.floor(Date.now());

	currentTime=1609304400000;


	var earliestSlotTiming=currentTime+4*60*1000;
	var LatestSlotTiming=currentTime+7*24*60*60*1000;

	
	await 	fetch(url)
	    .then(res => {return res.json()})
	    .then(json => {
	    	console.log(json);
	    	console.log(json.length);
		        for(i=0;i<json.length;i++)
		        {
		        	
		        	if(json[i].course_name==data.ccourseName)
		        	{
		        		console.log(json[i].course_name+" "+data.ccourseName+" "+json[i].slots.length);
		        		for(j=0;j<json[i].slots.length;j++){
		        			slt=json[i].slots[j];
		        			console.log(slt);
		        			if(earliestSlotTiming<=parseInt(slt.slot)&&parseInt(slt.slot)<=LatestSlotTiming)
		        			{
		        				console.log(slt);
		        				data['slots'].push(slt);
		        			}
		        		}
		        	}
		        }
		        // console.log(json);
		});  
}



function updateConfirmDb()
{

	MongoClient.connect(url, function(err, db) {
	 if (err) throw err;
	  var dbo = db.db("notchup");
	  var myquery = { verificationKey: parseInt(d['verificationKey']) };
	  var newvalues = { $set: {bookingconfirmed: 1} };
	  dbo.collection("bookingTrial").updateOne(myquery, newvalues, function(err, res) {
	    if (err) throw err;

	    console.log("Booking confirmed in db updated");
	    db.close();
	  });
	});

}

function millToDate(s)
{
	var t = new Date(parseInt(s));		
	return t.toString();
}

function getDateInString(slots)
{
	t=[];
	console.log(slots);
	for(i=0;i<slots.length;i++)
	{
		var d = new Date(parseInt(slots[i].slot));		
		t.push(d.toString());
	}
	console.log(t);
	return t;
	
//document.getElementById("demo").innerHTML = d.toString();
}