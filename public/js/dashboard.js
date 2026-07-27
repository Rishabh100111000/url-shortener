document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------
    // 1. LOGOUT LOGIC
    // ------------------------------------
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // Clear stored authentication token & user session
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            console.log("Logged out successfully");

            // Redirect to login page
            window.location.href = "/login.html";
        });
    }

    // ------------------------------------
    // 2. URL SHORTENER LOGIC
    // ------------------------------------
    const urlForm = document.getElementById("urlForm");
    const urlInput = document.getElementById("urlInput");
    const resultDiv = document.getElementById("result");

    if (!urlForm) {
        console.error("Form element NOT found in HTML!");
        return;
    }

    urlForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent form page reload

        console.log("Form submitted!");

        const longUrl = urlInput ? urlInput.value.trim() : "";

        if (!longUrl) {
            alert("Please enter a valid URL");
            return;
        }

        // Check if JWT token exists in localStorage
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
            console.log("Server response:", data);

            if (response.ok) {
                // FIXED: Removed /url/ prefix to match router.get("/:shortCode")
                const shortUrl = `${window.location.origin}/${data.shortCode}`;
                
                if (resultDiv) {
                    resultDiv.innerHTML = `
                        <div style="margin-top: 15px; padding: 10px; background: #e0f2fe; border-radius: 5px; word-break: break-all;">
                            <p style="margin: 0; color: #0369a1; font-weight: 500;">Short URL created:</p>
                            <a href="${shortUrl}" target="_blank" style="font-weight: bold; color: #0284c7;">${shortUrl}</a>
                        </div>
                    `;
                } else {
                    alert(`Short URL Created: ${shortUrl}`);
                }

                // Clear input after success
                urlInput.value = "";
            } else {
                alert(`Error: ${data.error || "Failed to create short URL"}`);
            }

        } catch (err) {
            console.error("Fetch error:", err);
            alert("Server reach nahi ho raha ya network error hai. Console check karein!");
        }
    });
});