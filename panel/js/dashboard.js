const apiUrl = "https://api.github.com/repos/denverku/sfhacks/contents/thx";
var notyf = new Notyf();
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
const dbRef = firebase.database().ref().child("AppConfig").child("Token");

let curr_token = "";
dbRef.once("value", function (snapshot) {
    // The value of the "Token" node
    const tokenValue = snapshot.val();
    curr_token = tokenValue;
    //console.log("Token value:", tokenValue);
    getUsers();
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

function openEditModal(user, hwid) {

    console.log(user);
    var myModal = new bootstrap.Modal(document.getElementById("editUserModal"), {});
    myModal.show();

    const editForm = document.getElementById('editUserModal');

    editForm.querySelector('#licenseid').value = user;
    editForm.querySelector('#hwid').value = hwid;


    editForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const hwidEdit = editForm.querySelector('#hwid').value;
        editUser(user, hwidEdit);
    });
}

function openCreateModal() {

    var myModal = new bootstrap.Modal(document.getElementById("createUserModal"), {});
    myModal.show();
    const Form = document.getElementById('createForm');

    Form.addEventListener('submit', function (event) {
        event.preventDefault();
        const hwid = Form.querySelector('#hwid').value
        const subs = Form.querySelector('#subsDate').value;
        const selectElement = Form.querySelector('#subscriptionSelect');
        const durationUnitEl = Form.querySelector('#durationUnitSelect');
        const timeUnit = durationUnitEl.value;
        const subtype = selectElement.selectedIndex;
        if (/^\d+$/.test(subs)) {
            generateUser(subtype, subs, timeUnit, hwid);
        } else {
            notyf.error('Subscription Expiry must be a numeric value.');
        }
    });
}

const deleteAllUserModal = document.getElementById('delete-allusers');
// Find the button element by its ID
const deleteAllUser = document.getElementById('deleteAll');
// Add an onclick event listener
deleteAllUser.addEventListener('click', function () {
    clearAllUser();

});

const itemsPerPage = 10; // Number of items per page
let currentPage = 1; // Current page

async function getUsers() {
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `token ${curr_token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users data');
        }
        const data = await response.json();
        const content = atob(data.content);
        const jsonData = JSON.parse(content);


        // Extract the current time and timezone
        const users = jsonData.Users.length;


        document.getElementById("registedUsers").textContent = users;
        let paidCount = 0;
        let unpaidCount = 0;
        // Get the table body element by its ID
        var tableBody = document.getElementById('myUserTable');
        tableBody.innerHTML = '';
        for (const user of jsonData.Users) {
            /* var subs = new Date(user.subscription);
             const options = {
                 year: 'numeric',
                 month: '2-digit',
                 day: '2-digit',
                 hour: '2-digit',
                 minute: '2-digit',
                 hour12: true,
             };
 
             const formattedDate = subs.toLocaleString('en-US', options);
             var newRow = document.createElement('tr');
             var hwid = user.hwid;
             var type = "Free";
             if (user.paid == 1) {
                 type = "VIP";
             } else if (user.paid == 2) {
                 type = "SVIP";
             }
             //<td><a class="btn btn-sm btn-primary" onclick="openEditModal('${user.pwd}', '${user.hwid}')">Edit</a></td>
             newRow.innerHTML = `
                 <th scope="row"><span class="secret">${user.pwd}</span></th>
                 <td><span class="secret">${user.hwid}</span></td>
                 <td>??</td>
                 <td><label class="badge bg-warning text-dark">${type}</label></td>
                 <td>${formattedDate}</td>
                 <td>??</td>
                 <td><a class="btn btn-sm btn-light btn-active-light-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Actions</a>
                 <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                     <li><a class="dropdown-item" onclick="openEditModal('${user.pwd}', '${user.hwid}')">Edit</a></li>
                     <li><a class="dropdown-item" onclick="deleteUser('${user.pwd}')">Delete</a></li>
                 </ul>
                 </td>
                 
             `;
 
             // Append the new row to the table body
             tableBody.appendChild(newRow);*/
            if (user.paid == 0) {
                unpaidCount++;
            } else {
                paidCount++;
            }
        }
        document.getElementById("premiumUsers").textContent = paidCount;
        document.getElementById("freeUsers").textContent = unpaidCount;
        generatePageButtons(jsonData);
        renderPage(currentPage, jsonData);
        updateActivePageIndicator(currentPage, jsonData);

        //initPieChart(paidCount, unpaidCount);
    } catch (error) {
        console.error('Error:', error);
    }
}




// Function to calculate the total number of pages
function calculateTotalPages(jsonData) {
    return Math.ceil(jsonData.Users.length / itemsPerPage);
}

// Function to generate page number buttons
function generatePageButtons(jsonData) {
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing buttons

    const totalPages = calculateTotalPages(jsonData);
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('li');
            pageButton.className = 'page-item';
            pageButton.id = `page${i}`;
            const pageLink = document.createElement('a');
            pageLink.className = 'page-link';
            //pageLink.href = '#';
            pageLink.textContent = i;
            pageButton.appendChild(pageLink);

            // Add an event listener for the page button
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderPage(currentPage, jsonData);
                updateActivePageIndicator(currentPage, jsonData);
            });

            pagination.insertBefore(pageButton, nextPageButton);
        }
    }
}

// Function to update the active page indicator
function updateActivePageIndicator(page, jsonData) {
    for (let i = 1; i <= calculateTotalPages(jsonData); i++) {
        const pageButton = document.getElementById(`page${i}`);
        if (i === page) {
            pageButton.classList.add('active');
        } else {
            pageButton.classList.remove('active');
        }
    }
}

// Function to render a page of data
function renderPage(page, jsonData) {
    var tableBody = document.getElementById('myUserTable');
    tableBody.innerHTML = ''; // Clear the table

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const usersOnPage = jsonData.Users.slice(start, end);

    for (const user of usersOnPage) {
        var subs = new Date(user.subscription);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        const formattedDate = subs.toLocaleString('en-US', options);
        var newRow = document.createElement('tr');
        var hwid = user.hwid;
        var type = "Free";
        if (user.paid == 1) {
            type = "VIP";
        } else if (user.paid == 2) {
            type = "SVIP";
        }
        //<td><a class="btn btn-sm btn-primary" onclick="openEditModal('${user.pwd}', '${user.hwid}')">Edit</a></td>
        newRow.innerHTML = `
                <th scope="row"><span class="secret">${user.pwd}</span></th>
                <td><span class="secret">${user.hwid}</span></td>
                <td>??</td>
                <td><label class="badge bg-warning text-dark">${type}</label></td>
                <td>${formattedDate}</td>
                <td>??</td>
                <td><a class="btn btn-sm btn-light btn-active-light-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Actions</a>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" onclick="openEditModal('${user.pwd}', '${user.hwid}')">Edit</a></li>
                    <li><a class="dropdown-item" onclick="deleteUser('${user.pwd}')">Delete</a></li>
                </ul>
                </td>
                
            `;

        // Append the new row to the table body
        tableBody.appendChild(newRow);
    }
}

/*function generateUser(substype, subsdate, timeUnit) {
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
            const content = atob(data.content);
            const jsonData = JSON.parse(content);

            let licenseKey = generateLicenseKey(); // generate license

            let licenseFound = false;

            // Loop through the "Users" array to find and update the "pwd"
            for (let i = 0; i < jsonData.Users.length; i++) {
                if (jsonData.Users[i].pwd === licenseKey) {
                    licenseFound = true;
                    break; // Exit the loop once "hwid" is found
                }
            }

            if (licenseFound) {

            } else {
                const currentDate = new Date(curr_time);
                const daysInMilliseconds = subsdate * timeUnit * 1000;
                currentDate.setTime(currentDate.getTime() + daysInMilliseconds);
                const newUser = {
                    "pwd": licenseKey,
                    "paid": substype,
                    "ban": false,
                    "subscription": currentDate,
                    "hwid": ""
                };
                jsonData.Users.push(newUser);
            }

            const updatedJsonString = JSON.stringify(jsonData, null, 2);
            // Step 2: Update the content
            const updateContent = {
                message: `Update ${licenseKey}`,
                content: btoa(updatedJsonString),
                sha: sha,
            };

            return fetch(apiUrl, {
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
                notyf.success('License Generated!');
            } else if (response.status === 201) {
                notyf.success('License Generated!');
            } else {
                notyf.error('Failed to generate license');
                
            }
            //getUsers();
            // Reload the current page
            setTimeout(function () {
                location.reload();
              }, 2000);
        })
        .catch(error => {
            console.error("An error occurred: " + error);
        });
}*/

/*async function generateUser(substype, subsdate, timeUnit) {
    // Step 1: Get the current SHA
    $.ajax({
        url: apiUrl,
        method: "GET",
        headers: {
            "Authorization": `token ${curr_token}`,
            "Content-Type": "application/json",
        },
        success: function(data) {
            const sha = data.sha;
            const content = atob(data.content);
            const jsonData = JSON.parse(content);

            let licenseKey = generateLicenseKey(); // generate license

            let licenseFound = false;

            // Loop through the "Users" array to find and update the "pwd"
            for (let i = 0; i < jsonData.Users.length; i++) {
                if (jsonData.Users[i].pwd === licenseKey) {
                    licenseFound = true;
                    break; // Exit the loop once "hwid" is found
                }
            }

            if (licenseFound) {

            } else {
                const currentDate = new Date(curr_time);
                const daysInMilliseconds = subsdate * timeUnit * 1000;
                currentDate.setTime(currentDate.getTime() + daysInMilliseconds);
                const newUser = {
                    "pwd": licenseKey,
                    "paid": substype,
                    "ban": false,
                    "subscription": currentDate,
                    "hwid": ""
                };
                jsonData.Users.push(newUser);
            }

            const updatedJsonString = JSON.stringify(jsonData, null, 2);
            // Step 2: Update the content
            const updateContent = {
                message: `Update ${licenseKey}`,
                content: btoa(updatedJsonString),
                sha: sha,
            };

            $.ajax({
                url: apiUrl,
                method: "PUT",
                headers: {
                    "Authorization": `token ${curr_token}`,
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(updateContent),
                success: function(response) {
                    if (response.status === 200) {
                        notyf.success('License Generated!');
                    } else if (response.status === 201) {
                        notyf.success('License Generated!');
                    } else {
                        notyf.error('Failed to generate license');
                    }
                    getUsers();
                    // Reload the current page
                    
                },
                error: function(error) {
                    console.error("An error occurred: " + error);
                }
            });
        },
        error: function(error) {
            console.error("An error occurred: " + error);
        }
    });
}*/

async function generateUser(substype, subsdate, timeUnit, hwid) {
    // Step 1: Get the current SHA
    await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `token ${curr_token}`,
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => {
            const sha = data.sha;
            const content = atob(data.content);
            const jsonData = JSON.parse(content);

            let licenseKey = generateLicenseKey(); // generate license

            let licenseFound = false;

            // Loop through the "Users" array to find and update the "pwd"
            for (let i = 0; i < jsonData.Users.length; i++) {
                if (jsonData.Users[i].pwd === licenseKey) {
                    licenseFound = true;
                    break; // Exit the loop once "hwid" is found
                }
            }

            if (licenseFound) {

            } else {
                const currentDate = new Date(curr_time);
                const daysInMilliseconds = subsdate * timeUnit * 1000;
                currentDate.setTime(currentDate.getTime() + daysInMilliseconds);
                const newUser = {
                    "pwd": licenseKey,
                    "paid": substype,
                    "ban": false,
                    "subscription": currentDate,
                    "hwid": hwid
                };
                jsonData.Users.push(newUser);
            }

            const updatedJsonString = JSON.stringify(jsonData, null, 2);
            // Step 2: Update the content
            const updateContent = {
                message: `Update ${new Date()}`,
                content: btoa(updatedJsonString),
                sha: sha,
            };

            return fetch(apiUrl, {
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
                notyf.success('License Generated!');
                
            } else if (response.status === 201) {
                notyf.success('License Generated!');
            } else {
                notyf.error('Failed to generate license');
            }
            getUsers();
            // Reload the current page
            /*setTimeout(function () {
                location.reload();
              }, 2000);*/
        })
        .catch(error => {
            console.error("An error occurred: " + error);
        });
}


function editUser(license, hwid) {
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
            const content = atob(data.content);
            const jsonData = JSON.parse(content);
            const userIndex = jsonData.Users.findIndex(user => user.pwd == license);
            if (userIndex != -1) {
                // User found, update the properties
                jsonData.Users[userIndex].hwid = hwid;
                // Save or use the updatedJsonString as needed
            } else {
                //console.log("User not found"); // Handle the case where the user is not found
                notyf.error('Not Found License!');
            }

            const updatedJsonString = JSON.stringify(jsonData, null, 2);
            // Step 2: Update the content
            const updateContent = {
                message: `Update ${new Date()}`,
                content: btoa(updatedJsonString),
                sha: sha,
            };
            return fetch(apiUrl, {
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
                //const label = document.getElementById("license");
                //label.value = genlicense;
                notyf.success('License Updated!');
            } else if (response.status === 201) {
                //console.log("Content updated successfully.");
                //const label = document.getElementById("license");
                //label.value = genlicense;
                notyf.success('License Updated!');
            } else {
                //const label = document.getElementById("license");
                //label.value = "Failed to generate license!";
                notyf.error('Failed to update license');
                //console.error("Failed to update content.");
            }
            getUsers();

        })
        .catch(error => {
            console.error("An error occurred: " + error);
        });
}

function deleteUser(license) {
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
            const content = atob(data.content);
            const jsonData = JSON.parse(content);


            const userIndex = jsonData.Users.findIndex(user => user.pwd == license);
            if (userIndex != -1) {
                // User found, update the properties
                jsonData.Users.splice(userIndex, 1);
            } else {
                //console.log("User not found"); // Handle the case where the user is not found
                notyf.error('Not Found License!');
            }

            const updatedJsonString = JSON.stringify(jsonData, null, 2);
            // Step 2: Update the content

            const updateContent = {
                message: `Update ${new Date()}`,
                content: btoa(updatedJsonString),
                sha: sha,
            };
            return fetch(apiUrl, {
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
                
                notyf.success('License Deleted!');
            } else if (response.status === 201) {
                
                notyf.success('License Deleted!');
            } else {
                
                notyf.error('Failed to delete license');
                //console.error("Failed to update content.");
            }
            //getUsers();
            setTimeout(function () {
                location.reload();
            }, 2000);
        })
        .catch(error => {
            console.error("An error occurred: " + error);
        });
}

function clearAllUser() {
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
            const content = atob(data.content);
            const jsonData = JSON.parse(content);

            jsonData.Users.length = 0;

            const updatedJsonString = JSON.stringify(jsonData, null, 2);
            // Step 2: Update the content
            const updateContent = {
                message: `Clear all ${new Date()}`,
                content: btoa(updatedJsonString),
                sha: sha,
            };

            return fetch(apiUrl, {
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
                //const label = document.getElementById("license");
                //label.value = genlicense;
                notyf.success('All License Deleted!');
            } else if (response.status === 201) {
                //console.log("Content updated successfully.");
                //const label = document.getElementById("license");
                //label.value = genlicense;
                notyf.success('All License Deleted!');
            } else {
                //const label = document.getElementById("license");
                //label.value = "Failed to generate license!";
                notyf.error('Failed to delete license');
                //console.error("Failed to update content.");
            }
            //getUsers();
            setTimeout(function () {
                location.reload();
            }, 2000);
        })
        .catch(error => {
            console.error("An error occurred: " + error);
        });
}

function clearAllExpiredUser() {
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
            const content = atob(data.content);
            const jsonData = JSON.parse(content);

            for (let i = 0; i < jsonData.Users.length; i++) {
                const currentDate = new Date(curr_time);
                const expirationDate = new Date(jsonData.Users[i].subscription);
                if (currentDate < expirationDate) {
                   // jsonData.Users.splice(i, 1);
                }else{
                    console.log(jsonData.Users[i].pwd + " expired")
                }
            }

            const updatedJsonString = JSON.stringify(jsonData, null, 2);
            // Step 2: Update the content
            const updateContent = {
                message: `Clear all ${new Date()}`,
                content: btoa(updatedJsonString),
                sha: sha,
            };

            return fetch(apiUrl, {
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
                notyf.success('All License Deleted!');
            } else if (response.status === 201) {
                notyf.success('All License Deleted!');
            } else {
                notyf.error('Failed to delete license');
            }
            //getUsers();
            setTimeout(function () {
                location.reload();
            }, 2000);
        })
        .catch(error => {
            console.error("An error occurred: " + error);
        });
}

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

 // Get the input field and table
 var input = document.getElementById("filterInput");
 var table = document.getElementById("myUserTable");

 // Add an event listener to the input field
 input.addEventListener("input", function() {
     // Get the filter value from the input
     var filter = input.value.toUpperCase();

     // Get all rows of the table
     var rows = table.getElementsByTagName("tr");

     // Loop through all table rows and hide those that don't match the filter
     for (var i = 1; i < rows.length; i++) {
         var row = rows[i];
         var cells = row.getElementsByTagName("td");
         var shouldHide = true;

         // Loop through all cells in the current row
         for (var j = 0; j < cells.length; j++) {
             var cell = cells[j];
             if (cell) {
                 var cellText = cell.textContent || cell.innerText;
                 if (cellText.toUpperCase().indexOf(filter) > -1) {
                     shouldHide = false;
                     break;
                 }
             }
         }

         // Toggle the display property based on whether the row should be hidden
         row.style.display = shouldHide ? "none" : "";
     }
 });

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
getCurrentTime();
