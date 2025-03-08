const app = require("./app");
const connectDB = require("./db");

require("dotenv").config({ path: "./.env" });

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongodb connection error ", err);
  });
