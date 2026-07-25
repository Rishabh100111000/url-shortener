const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("http://localhost:3000/user/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })

        });

        const data = await response.json();

        if(response.ok){

            alert("Registration Successful!\nPlease verify your email before logging in.");

            window.location.href="login.html";

        }
        else{

            alert(data.message || data.error);

        }

    }
    catch(err){

        console.log(err);

        alert("Server Error");

    }

});