import express from "express";
import cors from "cors";
import mysql from "mysql";

import Storage from "./src/storage.js"

const app = express();

const PORT = process.env.PORT | 3001

const storage = new Storage();

app.use(cors(
  {
    origin: "http://localhost:3000/",
  }))

app.use(express.json());

app.get("/", (req, res)=>
{
  res.send("hello");
})

app.post("/projects/create", async (req, res)=>{
  const {name, type, desc, img, url, start, finish} = req.body;

  try
  {
    storage.insert("project", {name, type, desc, img, url, start, finish})

    return res.statusCode(201).send("project data successfully added");
  } 
  catch (error)
  {
    return res.statusCode(400).send();
  }
})

app.get("/projects", async (req, res) => 
{
  try
  {
    const result = await storage.query("");
  }
  catch (error)
  {
    return res.statusCode(400).send("error found while getting projects\nerror:", error);
  }
})

app.listen(PORT, ()=> 
{       
  console.log("server is running on port", PORT);
})