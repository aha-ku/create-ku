import express from "express";
import { styleText } from "node:util";
const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Normal Express Typescript!");
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Server is running at ${styleText(["green", "underline"], `http://localhost:` + PORT)}`,
  );
});
