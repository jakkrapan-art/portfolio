import express from "express";
import cors from "cors";
import mysql from "mysql";

import Storage from "./src/storage.js"

const app = express();

const PORT = process.env.PORT | 3001

let storage;

const connection = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "portfolio_web",
    port: 3306,
  }
)

app.use(cors(
  {
    origin: "http://localhost:3000/",
  }))

app.use(express.json());

app.get("/", (req, res)=>
{
  res.send("hello");
})

app.post("/projects/create", (req, res)=>{
  const {name, type, desc, img, url, start, finish} = req.body;
  connection.query(
    "INSERT INTO `project` (`name`, `type`, `description`, `image`, `url`, `start`, `finish`) VALUES (?, ?, ?, ?, ?, ?, ?)",[name, type, desc, img, url, start, finish],
    (err, result, field) => 
    {
      if(err)
      {
        return res.status(400).send();
      }

      return res.status(201).send({message: "inset project successfully"});
    }
  )
})

app.get("/projects", (req, res) => 
{
  storage.insert("project", {name: "test", description:"desc", type: "type", image: "img", url: "url", start:"2023-7-10"}, (err, insert_id) => 
  {
    if(err)
    {
      console.log(err);
      return;
    }

    console.log(result_id);
  });
  return res.status(200).send();
})

app.listen(PORT, ()=> 
{       
  console.log("server is running on port", PORT);
  storage = new Storage();
})