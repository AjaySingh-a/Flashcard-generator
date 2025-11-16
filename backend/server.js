require("dotenv").config();
const express = require("express");
const cors = require("cors");
const generateRoute = require("./routes/generate");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/generate-flashcards", generateRoute);

app.get("/", (req, res) => res.send("Flashcard generator backend is up."));

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

