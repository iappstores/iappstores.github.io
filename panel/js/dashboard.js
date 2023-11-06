// Initialize Firebase with your project configuration (same as in login.js)
const firebaseConfig = {
    apiKey: "AIzaSyCKCBMCTbjg-Wazz_WhCYtxbmM0qsUHKsg",
    authDomain: "XXXXX",
    databaseURL: "https://vpnconfig-70581-default-rtdb.firebaseio.com",
    projectId: "vpnconfig-70581",
    storageBucket: "tweetgo-main.appspot.com",
    messagingSenderId: "XXXXXX"
}

firebase.initializeApp(firebaseConfig);

document.getElementById("logout").addEventListener("click", function () {
    // Sign out from Firebase
    firebase.auth().signOut().then(function () {
        window.location.href = "login.html";
    }).catch(function (error) {
        console.log("Error during logout: " + error);
    });
});

// Check if the user is logged in. If not, redirect to the login page.
firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
        window.location.href = "login.html";
    } else {
        // User is logged in; fetch the username from the Realtime Database and display it
        var userId = user.uid;
        var userRef = firebase.database().ref('Users/' + userId);

        userRef.once('value').then(function (snapshot) {
            var userData = snapshot.val();
            if (userData) {
                var username = userData.username;
                document.getElementById("mytoken").textContent = userData.token;
                document.getElementById("xUsers").textContent = "Hello, " + username;
            }
        }).catch(function (error) {
            console.log("Error reading data from the database: " + error);
        });
    }
});

async function getUsers() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/denverku/sfhacks/main/db2');

        if (!response.ok) {
            throw new Error('Failed to fetch users data');
        }
        const data = await response.json();
        // Extract the current time and timezone
        const users = data.Users.length;


        document.getElementById("registedUsers").textContent = users;
        let paidCount = 0;
        let unpaidCount = 0;
        // Get the table body element by its ID
        var tableBody = document.getElementById('myUserTable');
        for (const user of data.Users) {
            var subs = new Date(user.subscription);
            // Create a new row (item)
            var newRow = document.createElement('tr');
            
            // Add the content for each cell in the row
            newRow.innerHTML = `
    <th scope="row">${user.pwd}</th>
    <td>${user.hwid}</td>
    <td>${user.paid ? "PREMIUM" : "FREE"}</td>
    <td>${subs.toLocaleDateString()}</td>
    <td><a href="#" class="btn btn-sm btn-primary">Edit</a></td>
`;
            // Append the new row to the table body
            tableBody.appendChild(newRow);
            if (user.paid === true) {
                paidCount++;
            } else {
                unpaidCount++;
            }
        }
        document.getElementById("premiumUsers").textContent = paidCount;
        document.getElementById("freeUsers").textContent = unpaidCount;


        //initPieChart(paidCount, unpaidCount);
    } catch (error) {
        console.error('Error:', error);
    }
}
getUsers();

function initPieChart(paid, notpaid) {
    //-------------
    //- PIE CHART -
    //-------------
    var pieOptions = {
        responsive: true,
        segmentShowStroke: true,
        segmentStrokeColor: '#fff',
        segmentStrokeWidth: 1,
        animationSteps: 100,
        animationEasing: 'easeOutBounce',
        animateRotate: true,
        animateScale: true,
        maintainAspectRatio: true,
        legend: {
            display: true,
            position: 'right',
            labels: {
                boxWidth: 15,
                defaultFontColor: '#343a40',
                defaultFontSize: 11,
            }
        }
    }

    var ctx = document.getElementById("pieChart");
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [paid, notpaid],
                backgroundColor: [
                    '#f56954',
                    '#00a65a'
                ],
            }],
            labels: [
                'Premium',
                'Free'

            ]
        },
        options: pieOptions
    });
}

