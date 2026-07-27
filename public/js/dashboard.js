document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------
    // 1. LOGOUT HANDLER
    // ------------------------------------
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // Clear authentication session
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            console.log("Logged out successfully");

            // Redirect to login page
            window.location.href = "/login.html";
        });
    }

    // ------------------------------------
    // 2. URL SHORTENER HANDLER
    // ------------------------------------
    const urlForm = document.getElementById("urlForm");
    const urlInput = document.getElementById("urlInput");
    const resultDiv = document.getElementById("result");

    if (!urlForm) {
        console.error("Form element NOT found in HTML!");
        return;
    }

    urlForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent page reload

        const longUrl = urlInput ? urlInput.value.trim() : "";

        if (!longUrl) {
            alert("Please enter a valid URL");
            return;
        }

        // Retrieve JWT token
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Session expired or token missing. Please log in again.");
            window.location.href = "/login.html";
            return;
        }

        try {
            console.log("Sending request to backend...");

            const response = await fetch("/url/shorten", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ url: longUrl })
            });

            const data = await response.json();

            if (response.ok) {
                // Generates clean short link matching router.get("/:shortCode")
                const shortUrl = `${window.location.origin}/${data.shortCode}`;

                if (resultDiv) {
                    resultDiv.innerHTML = `
                        <div style="margin-top: 15px; padding: 12px; background: #e0f2fe; border-radius: 6px; word-break: break-all;">
                            <p style="margin: 0 0 5px 0; color: #0369a1; font-weight: 500;">Short URL created:</p>
                            <a href="${shortUrl}" target="_blank" style="font-weight: bold; color: #0284c7; text-decoration: underline;">${shortUrl}</a>
                        </div>
                    `;
                } else {
                    alert(`Short URL Created: ${shortUrl}`);
                }

                // Reset input box
                urlInput.value = "";
            } else {
                alert(`Error: ${data.error || "Failed to create short URL"}`);
            }

        } catch (err) {
            console.error("Fetch error:", err);
            alert("Network error or server unreachable. Please check the console!");
        }
    });
});