const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Dynamically uses current host (localhost in dev, Render in production)
        const API_URL = `${window.location.origin}/user/login`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token in localStorage for authenticated requests
            localStorage.setItem("token", data.token);

            alert("Login Successful!");

            // Redirect to dashboard or main URL shortener page
            window.location.href = "dashboard.html"; // Change to your actual home/dashboard page name
        } else {
            alert(data.message || data.error);
        }

    } catch (err) {
        console.error(err);
        alert("Server Error");
    }
});