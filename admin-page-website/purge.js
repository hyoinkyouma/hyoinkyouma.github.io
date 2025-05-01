const purgeBtn = document.getElementById("purge-link");

purgeBtn.onclick = () => {
  if (confirm("This will log out all users then purge rsa key pairs.")) {
    try {
      fetch("https://romanaugusto.up.railway.app/v1/regenerate-keys")
        .then((e) => e.json())
        .then((data) => {
          if (data.result_success) {
            alert("Key pair successfully purged.");
            location.reload();
          } else {
            alert("Failed to renew key pair");
            location.reload();
          }
        });
    } catch (e) {
      alert("Internal Server Error.");
    }
  }
};
