
const express = require("express");
const app = express();

app.use(express.json());
const port = 3000;

const origin = require("./routes/originUpdate");

app.use("/", origin);
app.listen(port, () => {
  console.log(`Server is up at ${port}`);
});
