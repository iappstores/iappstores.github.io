let url = document.location.href;
/*let fetcid = url.slice(url.indexOf("=") + 1);
console.log(fetcid);*/

let pl = new URL(url);
let params = new URLSearchParams(pl.search);
let fetcid = params.get("id");
console.log(fetcid);
/*fetcid = "-MupcPNlEFDncBBEuRPu"*/

if(fetcid === null){
	window.location.href = "https://iappstore.cf/index.html"
}

// Initialize Firebase
const config = {
    apiKey: "AIzaSyBvDLnPQOoUIoRLMQaocJdgeP1CRDnl6uQ",
    authDomain: "XXXXX",
    databaseURL: "https://imodstore-704e5-default-rtdb.firebaseio.com",
    projectId: "imodstore-704e5",
    storageBucket: "none",
    messagingSenderId: "XXXXXX"
}

var defaultApp = firebase.initializeApp(config);
/*firebase.auth().signInAnonymously();*/
/*firebase.auth().signInWithEmailAndPassword("email", "pass");*/
var database = firebase.database();
console.log(defaultApp.name);
function eventFunc() {
  window.location.href = "https://iappstore.cf/app.apk";
}
const dlNow = document.getElementById("dlBtn");
dlNow.addEventListener("click", eventFunc);
const app_ico = document.getElementById("app_icon");
app_ico.setAttribute("src", "https://play-lh.googleusercontent.com/Q-vjgotAJuTjGpxTBe8SOL5OChmTHhBq7LBsiKFRGFTslqYg1rcXD6wLciJAi__hEONR=w480-h960-r");

const appTitle = document.getElementById("app_title");
appTitle.textContent = "My Heading Text";

const appDev = document.getElementById("app_dev");
appDev.textContent = "My Paragraph Text";

const likeC = document.getElementById("likeCount");

const dlC = document.getElementById("dlCount");
const revC = document.getElementById("reviewCount");

const desc = document.getElementById("desc");
const whatsN = document.getElementById("whatsN");

const dbRef = firebase.database().ref();
dbRef.child("Published").child(fetcid).get().then((snapshot) => {
  if (snapshot.exists()) {
     app_ico.setAttribute("src", snapshot.child("AppIcon").val());
	 appTitle.textContent = snapshot.child("AppName").val();
    appDev.textContent = snapshot.child("Developer").val();
	likeC.textContent = snapshot.child("Liker").numChildren();
    revC.textContent = snapshot.child("Reviews").numChildren();
    dlC.textContent = snapshot.child("Download").val();
    
     desc.textContent = snapshot.child("Desc").val()
    whatsN.textContent = snapshot.child("WhatsNew").val();
    /*dlNow.setAttribute("href", snapshot.child("DownloadUrl").val());*/
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
})
