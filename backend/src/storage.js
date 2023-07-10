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

  insert(table, insertingObj, callback)
  {
    if(table.trim() === "")
    {
      callback("need table name for inserting.");
      return;
    }

    try{
      const insertingMap = Object.entries(insertingObj);
      const keys = [];
      const values = [];
      for(const v of insertingMap.values())
      {
        keys.push("`"+v[0]+"`");
        values.push("'"+v[1]+"'");
      }
      
      const query = "INSERT INTO " + table + " (" + keys.join(", ") + ") VALUES (" + values.join(", ") + ");";
      connection.query(query, (err, result)=>
      {
        if(err)
        {
          callback(err);
          return;
        }

        callback(null, result.insertId)
      });
    }
    catch(err)
    {
      console.log("error found while insert.\nerror:", err);
    }
  }

  delete(table, condition)
  {
    connection.query("DELETE FROM " + table + (condition ? (" WHERE " + condition) : ""));
  }
}

export default Storage;