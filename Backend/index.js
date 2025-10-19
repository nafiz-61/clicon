require("dotenv").config();
const { DBconnection } = require("./src/database/db.js");
const { server } = require("./src/app.js");
const port = process.env.PORT;

DBconnection()
  .then(() => {
    server.listen(port || 4000, () => {
      console.log(`Server Running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Database Connection error ", error);
  });
