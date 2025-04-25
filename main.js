// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAyTz4mSZ3Cz7NPQi74lKildQWSqm5zgVo",
  authDomain: "defusalgame.firebaseapp.com",
  projectId: "defusalgame",
  storageBucket: "defusalgame.firebasestorage.app",
  messagingSenderId: "817365072928",
  appId: "1:817365072928:web:86b7975cc1dd25fe3d9045",
  databaseURL: "https://defusalgame.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
firebase.auth().signInAnonymously();
const db = firebase.database();

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function handlePlay() {
  const game = document.getElementById('gameInput').value.toLowerCase();
  const roomCodeInput = document.getElementById('roomInput').value.toUpperCase();
  const allowedGames = ['defusal']; // expand later
  console.log("Play clicked!");

  if (!allowedGames.includes(game)) {
    document.getElementById('error').style.display = 'block';
    return;
  }

  if (roomCodeInput) {
    // join existing room
    db.ref("rooms/" + roomCodeInput).get().then((snapshot) => {
      if (snapshot.exists()) {
        window.location.href = `${game}.html?code=${roomCodeInput}`;
      } else {
        document.getElementById('error').style.display = 'block';
      }
    });
  } else {
    // create new room
    let newCode = generateRoomCode();
    db.ref("rooms/" + newCode).set({ createdAt: Date.now() }).then(() => {
      window.location.href = `${game}.html?code=${newCode}`;
    });
  }
}
