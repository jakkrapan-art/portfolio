import express from "express";
import cors from "cors";
import mysql from "mysql";
const app = express();

const PORT = process.env.PORT | 3001

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

app.listen(PORT, ()=> 
{       
  console.log("server is running on port", PORT);

  connection.connect(err => 
    {
      if(err)
      {
        console.log("an error occurs:", err);
        return;
      }

      console.log("database connected.");
    });
})