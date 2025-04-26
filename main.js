// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAyTz4mSZ3Cz7NPQi74lKildQWSqm5zgVo",
  authDomain: "defusalgame.firebaseapp.com",
  projectId: "defusalgame",
  storageBucket: "defusalgame.firebasestorage.app",
  messagingSenderId: "817365072928",
  appId: "1:817365072928:web:86b7975cc1dd25fe3d9045",
  databaseURL: "https://defusalgame-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
firebase.auth().signInAnonymously();
const db = firebase.database();

// --- index.html
function goToGame() {
  const game = document.getElementById("gameInput").value.toLowerCase();
  if (game === "defusal") {
    window.location.href = "defusal-lobby.html?code=null";
  } else {
    alert("Game not found.");
  }
}
// --- defusal-lobby.html
if (window.location.pathname.includes("defusal-lobby.html")) {
  const username = localStorage.getItem("username");

  if (!username) {
    document.getElementById("loginSection").style.display = "block";
  } else {
    document.getElementById("lobbySection").style.display = "block";
  }
}

function returningUser() {
  document.getElementById("usernameSection").style.display = "block";
}
function newUser() {
  document.getElementById("usernameSection").style.display = "block";
}
function submitUsername() {
  const username = document.getElementById("usernameInput").value.trim();
  if (!username) {
    showError("Please enter a username.");
    return;
  }

  const userRef = db.ref("users/" + username);
  userRef.once("value").then(snapshot => {
    if (snapshot.exists()) {
      // returning user
      localStorage.setItem("username", username);
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("lobbySection").style.display = "block";
    } else {
      // new user
      userRef.set({ lastRoom: "null" }).then(() => {
        localStorage.setItem("username", username);
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("lobbySection").style.display = "block";
      });
    }
  });
}
function showError(msg) {
  document.getElementById("loginError").textContent = msg;
}

function createRoom() {
  const code = generateRoomCode();
  alert("Share this code: " + code);
  const username = localStorage.getItem("username");

  // Save new room for user
  db.ref("users/" + username).update({ lastRoom: code });
  localStorage.setItem("lastRoom", code);

  // Redirect manually
  window.location.href = "defusal-game.html?code=" + code;
}

function joinRoom() {
  document.getElementById("roomInstructions").innerHTML = 
    "To join a room, add ?code=YOURFRIENDSCODE to the URL.";
}

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// --- defusal-game.html
if (window.location.pathname.includes("defusal-game.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const currentRoom = urlParams.get("code")?.toUpperCase();
  const username = localStorage.getItem("username");
  const lastRoom = localStorage.getItem("lastRoom");

  if (currentRoom && lastRoom !== currentRoom) {
    db.ref("users/" + username).update({ lastRoom: currentRoom });
    localStorage.setItem("lastRoom", currentRoom);
  }

  document.getElementById("roleDisplay").textContent = "Host/Guest (basic for now)";
}

function switchRoles() {
  alert("Switching roles (not implemented yet)");
}

function startGame() {
  document.getElementById("menuSection").style.display = "none";
  document.getElementById("gameSection").style.display = "block";
}

function abortGame() {
  window.location.href = "defusal-lobby.html";
}
