const apiUrl = "https://api.github.com/repos/denverku/sfhacks/contents/thx";
const config = {
  apiKey: "AIzaSyCKCBMCTbjg-Wazz_WhCYtxbmM0qsUHKsg",
  authDomain: "XXXXX",
  databaseURL: "https://vpnconfig-70581-default-rtdb.firebaseio.com",
  projectId: "vpnconfig-70581",
  storageBucket: "tweetgo-main.appspot.com",
  messagingSenderId: "XXXXXX"
}
var defaultApp = firebase.initializeApp(config);
//console.log(defaultApp.name);
//firebase.auth().signInWithEmailAndPassword("sidor@iappstore.cf", "trunks123");
const dbRef = firebase.database().ref().child("AppConfig").child("Token");
let curr_token = "";
dbRef.on("value", function (snapshot) {
  // The value of the "Token" node
  const tokenValue = snapshot.val();
  curr_token = tokenValue;
  //console.log("Token value:", tokenValue);
});

var div = document.getElementById('licenseRes');
 // div.style.display = 'none'; // Show the div


var curr_time = "";
// Function to fetch and display the current time
async function getCurrentTime() {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Manila');
    if (!response.ok) {
      throw new Error('Failed to fetch time data');
    }
    const data = await response.json();

    // Extract the current time and timezone
    const currentTime = data.datetime;
    const timeZone = data.timezone;
    curr_time = data.datetime;
    const currentDate = new Date(curr_time);
    // Display the current time and timezone
    console.log(currentDate);
    console.log(`Timezone: ${timeZone}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getUsers() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/denverku/sfhacks/main/db2');
    if (!response.ok) {
      throw new Error('Failed to fetch users data');
    }
    const data = await response.json();
    // Extract the current time and timezone
    const users = data.Users.length;

    console.log(`Users: ${users}`);
  } catch (error) {
    console.error('Error:', error);
  }
}
// getUsers();
// Call the function to get and display the current time
getCurrentTime();

var notyf = new Notyf();
function testaw(encodedContent, genlicense) {

  //var token = document.getElementById("token").value;
  // Step 1: Get the current SHA
  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Authorization": `token ${curr_token}`,
      "Content-Type": "application/json",
    },
  })
    .then(response => response.json())
    .then(data => {
      const sha = data.sha;

      // Step 2: Update the content
      const updateUrl = apiUrl;
      const updateContent = {
        message: `Update ${name}`,
        content: btoa(encodedContent),
        sha: sha,
      };

      return fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Authorization": `token ${curr_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateContent),
      });
    })
    .then(response => {
      if (response.status === 200) {
        //console.log("Content updated successfully.");
        const label = document.getElementById("license");
        label.value = genlicense;
        notyf.success('License Generated!');
      } else {
        const label = document.getElementById("license");
        label.value = "Failed to generate license!";
        notyf.error('Failed to generate license');
        //console.error("Failed to update content.");
      }
    })
    .catch(error => {
      console.error("An error occurred: " + error);
    });
}

function test() {
  //var token = document.getElementById("token").value;
  const userAgent = "YourApp";

  // Set up the request headers
  const headers = new Headers({
    "Authorization": `token ${curr_token}`,
    "User-Agent": userAgent
  });

  // Create a request object
  const request = new Request(apiUrl, {
    method: "GET",
    headers: headers
  });

  // Perform the HTTP request
  fetch(request)
    .then(response => {
      if (response.ok) {
        return response.json(); // assuming the response is in JSON format
      } else {
        throw new Error("HTTP request failed");
      }
    })
    .then(data => {
      // Process the data
      //console.log("Data received: " + JSON.stringify(data));
      // Extract "content" and "sha" from the JSON data
      const content = atob(data.content); // Decode base64-encoded content
      const sha = data.sha;

      // Do something with the "content" and "sha" values
      //console.log("Content: " + content);
      //console.log("SHA: " + sha);
      var xhwid = document.getElementById("hwid").value;
      let licenseKey = generateLicenseKey();

      const jsonData = JSON.parse(content);
      let hwidFound = false;
      let old_subs = "";

      // Loop through the "Users" array to find and update the "pwd"
      for (let i = 0; i < jsonData.Users.length; i++) {
        if (jsonData.Users[i].hwid === xhwid) {
          licenseKey = jsonData.Users[i].pwd;
          old_subs = jsonData.Users[i].subscription;

          hwidFound = true;
          break; // Exit the loop once "hwid" is found
        }
      }

      if (hwidFound) {
        const currentDate = new Date(curr_time);
        const expirationDate = new Date(old_subs);
        if (currentDate < expirationDate) {
          notyf.success('License still active!');
          //Here you can perform actions for items that are still valid
          const label = document.getElementById("license");
          label.value = licenseKey;
        } else {
          //console.log("The item has expired.");
          // Here you can handle items that have expired
          const userId = licenseKey; // Replace with the actual user ID
          // Find the index of the user you want to update in the jsonData.Users array
          const userIndex = jsonData.Users.findIndex(user => user.pwd === userId);
          if (userIndex !== -1) {
            const currentDate = new Date(curr_time);
            const oneDayInMilliseconds = 3 * 60 * 1000;
            currentDate.setTime(currentDate.getTime() + oneDayInMilliseconds);
            console.log(currentDate);
            // User found, update the properties
            jsonData.Users[userIndex].paid = 0;
            jsonData.Users[userIndex].subscription = currentDate;
            // Convert the JSON data back to a string
            const updatedJsonString = JSON.stringify(jsonData, null, 2); // The second argument (null) is for replacer function, and the third argument (2) is for pretty printing.
            testaw(updatedJsonString, licenseKey);
            // Save or use the updatedJsonString as needed
          } else {
            //console.log("User not found"); // Handle the case where the user is not found
            notyf.error('Not Found Hwid!');
          }
        }
      } else {
        const currentDate = new Date(curr_time);
        const oneDayInMilliseconds = 3 * 60 * 1000;
        currentDate.setTime(currentDate.getTime() + oneDayInMilliseconds);
        const newUser = {
          "pwd": licenseKey,
          "paid": 0,
          "subscription": currentDate,
          "hwid": xhwid
        };
        jsonData.Users.push(newUser);
        // Convert the JSON data back to a string
        const updatedJsonString = JSON.stringify(jsonData, null, 2); // The second argument (null) is for replacer function, and the third argument (2) is for pretty printing.
        testaw(updatedJsonString, licenseKey);
      }

    })
    .catch(error => {
      console.error("An error occurred: " + error);
    });
}

const copyButton = document.getElementById("license");
copyButton.addEventListener("click", function () {
  var xlicense = copyButton.value;
  if (xlicense == "") {
    notyf.error('Generate a license first!');
  } else {
    // Select the text in the input element
    copyButton.select();

    // Copy the selected text to the clipboard
    document.execCommand("copy");

    // Deselect the input element
    copyButton.setSelectionRange(0, 0);

    // Alert the user that the text has been copied (you can use other UI feedback)
    notyf.success('Text copied to clipboard!');
  }

});

// Find the button element by its ID
const button = document.getElementById('myButton');

// Add an onclick event listener
button.addEventListener('click', function () {
  var xhwid = document.getElementById("hwid").value;
  if (xhwid == "") {
    notyf.error('You must fill out the hardware id');
  } else {
    test();
  }
});
function generateLicenseKey() {
  const segments = [];

  for (let i = 0; i < 4; i++) {
    let segment = "";
    for (let j = 0; j < 4; j++) {
      segment += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
    }
    segments.push(segment);
  }

  return segments.join("-");
}

const sidRegex = /^S-\d{1,}-\d{1,}-\d{1,}-\d{1,}-\d{1,}$/;

function isSID(str) {
  return sidRegex.test(str);
}

function startCountdown() {

  
  var seconds = 30; // Set the countdown duration in seconds
  var button = document.getElementById('myButton');

  // Update the button text and disable it initially
  button.innerText = 'Wait for ' + seconds + ' seconds';
  button.disabled = true;

  // Function to update the countdown and enable the button
  function updateCountdown() {
    seconds--;

    if (seconds > 0) {
      button.innerText = 'Wait for ' + seconds + ' seconds';
    } else {
      button.innerText = 'ACTIVATE';
      button.disabled = false;
      clearInterval(interval);
    }
  }

  // Set up an interval to update the countdown every second
  var interval = setInterval(updateCountdown, 1000);
}

// Call the startCountdown function when the page loads
window.onload = startCountdown;
