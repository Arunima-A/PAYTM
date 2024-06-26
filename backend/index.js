// backend/index.js
const express = require('express');
const cors = require("cors");
const rootRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

const PORT = process.env.PORT || 3001; // Use 3001 or another port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});