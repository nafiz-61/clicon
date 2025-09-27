require("dotenv").config();
const { DBconnection } = require("./src/database/db.js");
const { app } = require("./src/app.js");
const port = process.env.PORT;

DBconnection()
  .then(() => {
    app.listen(port || 4000, () => {
      console.log(`Server Running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Database Connection error ", error);
  });
