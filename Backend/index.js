require("dotenv").config();
const { DBconnection } = require("./src/database/db.js");
const { server } = require("./src/app.js");

const port = process.env.PORT || 4000;

DBconnection()
  .then(() => {
    server.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server Running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("❌ Database Connection error:", error);
  });
  