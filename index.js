const { DBconnection } = require("./src/database/db");
const { app } = require("./src/app");
require("dotenv").config();
const port = process.env.PORT;

DBconnection()
  .then(() => {
    app.listen(port || 6000, () => {
      console.log(`Server Running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Database connection error", error);
  });
 