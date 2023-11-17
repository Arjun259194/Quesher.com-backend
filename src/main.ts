import express, { json, urlencoded } from "express";

const server = express();

const PORT = process.env.PORT || 3000;

server.use(json());
server.use(urlencoded({ extended: false }));

server.get("/health-check", (req, res) => {
  return res.status(200).json({ message: `Server is running port: ${PORT}` });
});

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
