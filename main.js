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
function setupLobby() {
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

  const username = localStorage.getItem("username");
  localStorage.setItem("lastRoom", code);
  db.ref("users/" + username).update({ lastRoom: code });

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
