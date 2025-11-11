require("dotenv").config();
const { DBconnection } = require("./src/database/db.js");
const { server } = require("./src/app.js");

const port = process.env.PORT || 4000;

// 🧠 Render-এ অবশ্যই 0.0.0.0 address-এ bind করতে হবে
DBconnection()
  .then(() => {
    server.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server Running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("❌ Database Connection error:", error);
  });
  