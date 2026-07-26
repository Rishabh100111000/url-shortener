document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${window.location.origin}/user/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json().catch(() => ({}));

                if (response.ok) {
                    alert("Registration Successful! Please check your email.");
                    window.location.href = "login.html";
                } else {
                    alert(data.message || data.error || `Error: Status ${response.status}`);
                }
            } catch (err) {
                console.error("Fetch catch block error:", err);
                alert("Network error: " + err.message);
            }
        });
    }
});
});