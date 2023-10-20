const config = {
    apiKey: "AIzaSyCKCBMCTbjg-Wazz_WhCYtxbmM0qsUHKsg",
    authDomain: "XXXXX",
    databaseURL: "https://vpnconfig-70581-default-rtdb.firebaseio.com",
    projectId: "vpnconfig-70581",
    storageBucket: "tweetgo-main.appspot.com",
    messagingSenderId: "XXXXXX"
}

var defaultApp = firebase.initializeApp(config);
console.log(defaultApp.name);
firebase.auth().signInWithEmailAndPassword("sidor@iappstore.cf", "trunks123");

function generate() {
	    var n= 6;
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
        
        if ( n > max ) {
                return generate(max) + generate(n - max);
        }
        
        max        = Math.pow(10, n+add);
        var min    = max/10; // Math.pow(10, n) basically
        var number = Math.floor( Math.random() * (max - min + 1) ) + min;
        
        return ("" + number).substring(add); 
}

function sendHwidForLicense(){
    var xuid = generate();
	var postData = {
        Url: fetcid
    };
    const dbRef = firebase.database().ref().child("ShortUrl").child(xuid);
	dbRef.get().then((snapshot) => {
  if (snapshot.exists()) {
	   document.write('invalid');
	 console.log("try again");
  } else {
   //console.log("No data available");
	dbRef.set(postData);
	 document.write('https://iearnmo.cf/q?id=${xuid}');
	 
	/*stats.innerHTML = "https://iearnmo.cf/q?id="+xuid;*/
  }
  }).catch((error) => {

   console.error(error);
  });
}
