// index.js
import { registerUser, loginUser, logoutUser } from "./components/auth.js";

document.getElementById("registerBtn").addEventListener("click", async () => {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (email && password) {
        await registerUser(email, password);
    } else {
        console.error("Please fill in both email and password fields.");
    }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email && password) {
        await loginUser(email, password);
    } else {
        console.error("Please fill in both email and password fields.");
    }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await logoutUser();
});
