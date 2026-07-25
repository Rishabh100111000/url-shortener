const form = document.getElementById("urlForm");
const result = document.getElementById("result");
const logoutBtn = document.getElementById("logoutBtn");

const token = localStorage.getItem("token");

// If user is not logged in
if (!token) {
    window.location.href = "login.html";
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const url = document.getElementById("url").value;

    try {

        const response = await fetch("http://localhost:3000/url/shorten", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                url: url
            })

        });

        const data = await response.json();

        if (response.ok) {

            result.innerHTML = `
                <h3>Short URL</h3>
                <a href="http://localhost:3000/url/${data.shortCode}" target="_blank">
                    http://localhost:3000/url/${data.shortCode}
                </a>
                <br><br>
                <button onclick="copyLink('http://localhost:3000/url/${data.shortCode}')">
                    Copy
                </button>
            `;

        } else {

            alert(data.message || data.error);

        }

    } catch (err) {

        console.log(err);
        alert("Server Error");

    }

});

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");

    window.location.href = "login.html";

});

function copyLink(link) {

    navigator.clipboard.writeText(link);

    alert("Link Copied!");

}