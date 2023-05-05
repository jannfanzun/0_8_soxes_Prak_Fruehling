async function tryRegister() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Invalid email format!");
    return;
  }

  await fetch("http://localhost:5000/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Email: email, Password: password }),
  })
    .then(async (response) => {
      if (response.status === 401) {
        throw new Error("Authentication failed! Email already exists!");
      }
      await response;
      window.location.href = "login.html";
      alert("Register successful!");
    })
    .catch((error) => {
      alert(error.message);
    });
}

document.body.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    tryRegister();
  }
});
