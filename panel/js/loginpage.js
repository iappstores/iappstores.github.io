
var notyf = new Notyf();
// Initialize Firebase with your project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKCBMCTbjg-Wazz_WhCYtxbmM0qsUHKsg",
    authDomain: "XXXXX",
    databaseURL: "https://vpnconfig-70581-default-rtdb.firebaseio.com",
    projectId: "vpnconfig-70581",
    storageBucket: "tweetgo-main.appspot.com",
    messagingSenderId: "XXXXXX"
  }
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        window.location.href = "index.html";
    }
});
document.getElementById("formAuthentication").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Sign in with Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            // Redirect to the dashboard page on successful login
            window.location.href = "dashboard.html";
        })
        .catch(function(error) {
            //document.getElementById("error").innerText = "Invalid credentials. Please try again.";
            notyf.error(error);
        });
});