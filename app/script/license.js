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
