// Locate your form and input elements from the HTML
const urlForm = document.getElementById("urlForm"); // Match your HTML form ID
const urlInput = document.getElementById("urlInput"); // Match your HTML input ID
const resultDiv = document.getElementById("result"); // Where you want to show the short link

urlForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop page refresh

    const longUrl = urlInput.value.trim();
    const token = localStorage.getItem("token"); // Retrieve JWT saved during login

    if (!token) {
        alert("You must be logged in to shorten URLs.");
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch("/url/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Sends token to your auth middleware
            },
            body: JSON.stringify({ url: longUrl })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Shortened URL object:", data);
            
            // Build full URL for user to copy
            const shortUrl = `${window.location.origin}/url/${data.shortCode}`;
            
            // Display result on screen
            resultDiv.innerHTML = `
                <p>Short URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
            `;
        } else {
            // Show error message returned from backend
            alert(data.error || "Failed to shorten URL");
        }
    } catch (err) {
        console.error("Network or script error:", err);
        alert("Something went wrong. Check console.");
    }
});