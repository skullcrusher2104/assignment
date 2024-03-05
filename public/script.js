// Function to navigate back to the login page
function goBack() {
  window.location.href = '/'; // Redirect to the login page
}

// Function to display users in a table
function displayUsers(users) {
  const table = document.getElementById('userTable');

  // Clear existing table content
  table.innerHTML = '';

  // Create table header
  const headerRow = document.createElement('tr');
  const userIdHeader = document.createElement('th');
  userIdHeader.textContent = 'User ID';
  const passwordHashHeader = document.createElement('th');
  passwordHashHeader.textContent = 'Password Hash';
  const roleHeader = document.createElement('th');
  roleHeader.textContent = 'Role';
  headerRow.appendChild(userIdHeader);
  headerRow.appendChild(passwordHashHeader);
  headerRow.appendChild(roleHeader);
  table.appendChild(headerRow);

  // Create table rows for each user
  users.forEach(user => {
    const row = document.createElement('tr');
    const userIdCell = document.createElement('td');
    userIdCell.textContent = user.userid;
    const passwordHashCell = document.createElement('td');
    passwordHashCell.textContent = user.password_hash;
    const roleCell = document.createElement('td');
    roleCell.textContent = user.role;
    row.appendChild(userIdCell);
    row.appendChild(passwordHashCell);
    row.appendChild(roleCell);
    table.appendChild(row);
  });
}

function displayUser(user) {
  const table = document.createElement('table');
  const row = table.insertRow();
  
  const userIdCell = row.insertCell(0);
  const passwordHashCell = row.insertCell(1);
  const roleCell = row.insertCell(2);
  
  userIdCell.textContent = 'User ID';
  passwordHashCell.textContent = 'Password Hash';
  roleCell.textContent = 'Role';
  
  const dataRow = table.insertRow();
  
  const dataUserIdCell = dataRow.insertCell(0);
  const dataPasswordHashCell = dataRow.insertCell(1);
  const dataRoleCell = dataRow.insertCell(2);
  
  dataUserIdCell.textContent = user.userid;
  dataPasswordHashCell.textContent = user.password_hash;
  dataRoleCell.textContent = user.role;

  // Display the table in the HTML document
  document.body.appendChild(table);
}


// Function to handle loading user list when page loads
function loadUsers() {
  // Send request to server to fetch user list
  axios.get('/api/users')
       .then(response => {
           console.log("Fetched users:", response.data); // Debugging line
           // Display fetched user list
           displayUsers(response.data);
       })
       .catch(error => {
           console.error('Error fetching users:', error);
           alert('An error occurred while fetching users.');
       });
}
 

// Call loadUsers function when page loads
window.onload = loadUsers;

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Send login request to the server
  axios.post('/api/login', { username, password })
      .then(response => {
          if (response.data.success) {
              const role = response.data.role;

              if (role === 'admin') {
                  // Redirect to user list page
                  window.location.href = '/users.html';
              } else if (role === 'basic') {
                  // Redirect to user list page
                  window.location.href = '/user.html';
                  
                  // Fetch user details and display in a table
                  axios.get(`/api/user?username=${username}`)
                       .then(userResponse => {
                           displayUser(userResponse.data);
                       })
                       .catch(error => {
                           console.error('Error fetching user details:', error);
                           alert('An error occurred while fetching user details.');
                       });
              } else {
                  // Handle other roles here (if any)
                  // Redirect to some default page for unknown roles
                  window.location.href = '/default.html';
              }
          } else {
              // Login unsuccessful, display error message
              document.getElementById('error').innerText = response.data.error;
          }
      })
      .catch(error => {
          console.error('Error logging in:', error);
          document.getElementById('error').innerText = 'An error occurred while logging in.';
      });
}

// Add event listener to login form
const form = document.getElementById('loginForm');
form.addEventListener('submit', handleSubmit);
