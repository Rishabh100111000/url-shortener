document.addEventListener("DOMContentLoaded", () => {
    // Apne HTML elements ki ID verify karein
    const urlForm = document.getElementById("urlForm") || document.querySelector("form");
    const urlInput = document.getElementById("urlInput") || document.querySelector("input[type='url']") || document.querySelector("input[type='text']");
    const resultDiv = document.getElementById("result");

    if (!urlForm) {
        console.error("Form element NOT found in HTML!");
        return;
    }

    urlForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Form reload hone se roko

        console.log("Form submitted!");

        const longUrl = urlInput ? urlInput.value.trim() : "";

        if (!longUrl) {
            alert("Please enter a valid URL");
            return;
        }

        // Check if user has token stored from login
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
                const shortUrl = `${window.location.origin}/url/${data.shortCode}`;
                
                if (resultDiv) {
                    resultDiv.innerHTML = `
                        <div style="margin-top: 15px; padding: 10px; background: #e0f2fe; border-radius: 5px;">
                            <p style="margin: 0; color: #0369a1;">Short URL created:</p>
                            <a href="${shortUrl}" target="_blank" style="font-weight: bold; color: #0284c7;">${shortUrl}</a>
                        </div>
                    `;
                } else {
                    alert(`Short URL Created: ${shortUrl}`);
                }
            } else {
                alert(`Error: ${data.error || "Failed to create short URL"}`);
            }

        } catch (err) {
            console.error("Fetch error:", err);
            alert("Server reach nahi ho raha ya network error hai. Console check karein!");
        }
    });
});