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


// === INDEX PAGE ===
function goToGame() {
  const game = document.getElementById("gameInput").value.toLowerCase();
  if (game === "defusal") {
    window.location.href = "defusal-lobby.html?code=null";
  } else {
    alert("Game not found.");
  }
}


// === DEFUSAL LOBBY ===
if (window.location.pathname.includes("defusal-lobby.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const roomCode = urlParams.get("code")?.toUpperCase();
  const username = localStorage.getItem("username");
  const lastRoom = localStorage.getItem("lastRoom");

  // Show login if username not found
  if (!username) {
    document.getElementById("loginSection").style.display = "block";
  } else {
    document.getElementById("lobbySection").style.display = "block";
  }

  // Only save if it's a real room
  if (roomCode && roomCode !== "NULL" && lastRoom !== roomCode && username) {
    localStorage.setItem("lastRoom", roomCode);
    db.ref("users/" + username).update({ lastRoom: roomCode });
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
  if (!username) return showError("Please enter a username.");

  const userRef = db.ref("users/" + username);
  userRef.once("value").then(snapshot => {
    if (snapshot.exists()) {
      localStorage.setItem("username", username);
      showLobby();
    } else {
      userRef.set({ lastRoom: "null" }).then(() => {
        localStorage.setItem("username", username);
        showLobby();
      });
    }
  });
}

function showLobby() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("lobbySection").style.display = "block";
}

function showError(msg) {
  document.getElementById("loginError").textContent = msg;
}

function createRoom() {
  const code = generateRoomCode();
  alert("Your room code is: " + code);

  // Save room in storage and Firebase
  const username = localStorage.getItem("username");
  localStorage.setItem("lastRoom", code);
  db.ref("users/" + username).update({ lastRoom: code });

  // Go to game with room code
  window.location.href = "defusal-game.html?code=" + code;
}

function joinRoom() {
  document.getElementById("roomInstructions").innerHTML = 
    "To join a room, add <code>?code=ROOMCODE</code> at the end of the URL.";
}

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
