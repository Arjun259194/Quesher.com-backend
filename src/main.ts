import express, { json, urlencoded } from "express";
import AuthRouter from "./routes/auth";

const server = express();

//Config
const PORT = process.env.PORT || 3000;

//Middleware
server.use(json());
server.use(urlencoded({ extended: false }));

//Router
server.use("/auth", AuthRouter);

server.get("/health-check", (req, res) => {
  return res.status(200).json({ message: `Server is running port: ${PORT}` });
});

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
