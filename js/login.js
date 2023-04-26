async function tryLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Email: email, Password: password }),
  })
    .then(async (response) => {
      if (response.status === 401) {
        throw new Error(
          "Authentication failed! Email or password is incorrect!"
        );
      }
      const json = await response.json();
      localStorage.setItem("token", json["token"]);
      window.location.href = "index.html";
      alert("Login successful!");
    })
    .catch((error) => {
      alert(error.message);
    });
}
