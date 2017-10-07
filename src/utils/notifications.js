const https = require('https');
const querystring = require('querystring');

//Credentials is used to configure the notification
//Notifications are the details 

const credentials = {
    //IonicApplicationID : "artapp",
    IonicApplicationAPItoken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZDczZjM0Yi1iMzViLTQzN2MtODQwNi0wZWU2ZjZmMDEyNzQifQ.w5m5MR_grNgIl9gC4MmZpG0QvfQvwMiUMTGjsUXBBvk"
};


const notification = {
  "tokens": [""],
  "profile": "qyudelivery_security_1",
  "app_id" : "84616aae",
  "send_to_all" : false,
  "notification": {
	"payload" : {
		"page":"NEWS",
		},
	"android": {
		"title": "",
		"message": ""
		},
	"ios": {
		"title": "",
		"message": ""
		} 
    }
}

//First we'll need to set the notification data properly 

exports.setNotificationInfo = (title, message, token,sendToAll, payloadPage)=>{
	
  notification.notification.android.title = title;
	notification.notification.android.message = message;
	notification.notification.ios.title = title;
	notification.notification.ios.message = message;
	notification.notification.payload.page = payloadPage;

  notification.send_to_all = sendToAll;

	notification.tokens[0] = token;

}




exports.notifyPush = ()=>{
    var postData = querystring.stringify(notification);
    
    const options = {
	    hostname: 'api.ionic.io',
	    path: '/push/notifications',
	    method: 'POST',
	    headers: {
	        "Content-Type" : "application/json",
	        "Authorization": "Bearer " + credentials.IonicApplicationAPItoken
	    }
    };

     const req = https.request(options, function(res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        });
     });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.write(JSON.stringify(notification));
  req.end();

}
