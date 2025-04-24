
function enterGame() {
  const code = document.getElementById('codeInput').value.toLowerCase();
  const allowedGames = ['defusal', 'maze', 'password'];
  if (allowedGames.includes(code)) {
    window.location.href = code + ".html";
  } else {
    document.getElementById('error').classList.remove('hidden');
  }
}
