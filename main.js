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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Sign in anonymously
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Firebase auth error:", error);
  });

const db = firebase.database();

// Only keep one enterGame() function!
function enterGame() {
  const code = document.getElementById('codeInput').value.toLowerCase();
  const allowedGames = ['defusal', 'maze', 'password'];
  if (allowedGames.includes(code)) {
    window.location.href = code + ".html?code=" + code;
  } else {
    document.getElementById('error').classList.remove('hidden');
  }
}
