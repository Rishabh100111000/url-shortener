const USER = require("../model/USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../configure/mail");

// ====================== REGISTER USER ======================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if user already exists
        const existingUser = await USER.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await USER.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate verification token
        const verificationToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        const verificationLink = `http://localhost:3000/user/verify/${verificationToken}`;

        // Send verification email
     const info=   await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email",
            html: `
                <h2>Welcome to URL Shortener</h2>

                <p>Thank you for registering.</p>

                <p>Please click the button below to verify your email.</p>

                <a href="${verificationLink}">
                    <button style="
                        padding:10px 20px;
                        background:#2563eb;
                        color:white;
                        border:none;
                        border-radius:5px;
                        cursor:pointer;
                    ">
                        Verify Email
                    </button>
                </a>

                <br><br>

                <p>If the button doesn't work, copy this link:</p>

                <a href="${verificationLink}">
                    ${verificationLink}
                </a>
            `,
        });
        console.log("=================================");
console.log("Mail Response:");
console.log(info);
console.log("=================================");

        res.status(201).json({
            message: "Registration successful. Please verify your email.",
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message,
        });
    }
};

// ====================== VERIFY EMAIL ======================

const verifyEmail = async (req, res) => {

    try {

        const { token } = req.params;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await USER.findById(decoded.id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.verified) {
            return res.send(`
                <h2>Email already verified ✅</h2>
 <a href="http://localhost:3000/login.html">
    Go to Login
</a>
            `);
        }

        user.verified = true;

        await user.save();

        return res.send(`
            <h2>Email Verified Successfully ✅</h2>

            <p>Your account has been activated.</p>

           <a href="http://localhost:3000/login.html">
    Click here to Login
</a>
        `);

    } catch (err) {

        console.error(err);

        return res.status(400).send(`
            <h2>Verification Failed ❌</h2>

            <p>Invalid or Expired Verification Link.</p>
        `);

    }

};

// ====================== LOGIN USER ======================

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required",
            });

        }

        const user = await USER.findOne({ email });

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        // Check Email Verification

        if (!user.verified) {

            return res.status(403).json({
                message: "Please verify your email first.",
            });

        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {

            return res.status(401).json({
                message: "Invalid credentials",
            });

        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        return res.status(200).json({

            message: "Login successful",

            token,

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            message: err.message,

        });

    }

   
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
};