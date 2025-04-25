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

let db;

firebase.auth().signInAnonymously()
  .then(() => {
    db = firebase.database();
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Firebase auth error:", error);
  });

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function handlePlay() {
  console.log("Play clicked!");
  const game = document.getElementById('gameInput').value.toLowerCase();
  const roomCodeInput = document.getElementById('roomInput').value.toUpperCase();
  const allowedGames = ['defusal'];

  if (!allowedGames.includes(game)) {
    document.getElementById('error').style.display = 'block';
    return;
  }

  if (!db) {
    alert("Firebase is not ready yet. Wait a second and try again.");
    return;
  }

  if (roomCodeInput) {
    db.ref("rooms/" + roomCodeInput).once("value").then((snapshot) => {
      if (snapshot.exists()) {
        window.location.href = `${game}.html?code=${roomCodeInput}`;
      } else {
        document.getElementById('error').style.display = 'block';
      }
    });
  } else {
    const newCode = generateRoomCode();
    db.ref("rooms/" + newCode).set({ createdAt: Date.now() }).then(() => {
      window.location.href = `${game}.html?code=${newCode}`;
    });
  }
}
