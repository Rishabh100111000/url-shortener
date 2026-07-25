require("dotenv").config();

const app = require("./app/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
require("dotenv").config();

console.log(process.cwd());