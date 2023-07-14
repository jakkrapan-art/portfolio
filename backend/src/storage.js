import mysql from "mysql";

const connection = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "portfolio_web",
    port: 3306,
  })

class Storage
{
  constructor()
  {
    connection.connect(err => 
      {
        if(err)
        {
          console.log("an error occurs:", err);
          return;
        }
  
        console.log("database connected.");
      });
  }

  insert(table, data, callback)
  {
    if(table.trim() === "")
    {
      callback("need table name for inserting.");
      return;
    }

    try{
      const keys = Object.keys(data);
      const values = Object.values(data);
      
      return new Promise((resolve, reject)=>
      {
        const query = "INSERT INTO " + table + " (" + keys.join(", ") + ") VALUES (" + values.join(", ") + ");";
        connection.query(query, (err, result)=>
        {
          if(err)
          {
            reject(err);
            return;
          }
  
          resolve(result);
        });
      })
    }
    catch(err)
    {
      console.log("error found while insert.\nerror:", err);
    }
  }

  delete(table, condition)
  {
    if(!condition) return;

    connection.query("DELETE FROM " + table + " WHERE " + condition);
  }

  query(query, args = [])
  {
    if(connection) return;

    return new Promise((resolve, reject) => 
    {
      connection.query(query, args, (err, result) => 
      {
        if(err) reject(err);

        resolve(result);
      });
    });
  }
}

export default Storage;