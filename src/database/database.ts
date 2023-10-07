// database.js
import sqlite3 from "sqlite3";

const { verbose } = sqlite3;

// Create a function that establishes the database connection and returns a Promise.
export const initializeDatabase = () => {
  return new Promise<sqlite3.Database>((resolve, reject) => {
    const db:sqlite3.Database = new (verbose().Database)("./users.db");

    // Define a function to create the table (if it doesn't exist).
    function createTable() {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT,
          password TEXT
        )`,
        (err:any) => {
          if (err) {
            console.error("Error creating table:", err.message);
            reject(err);
          } else {
            console.log("Table created successfully.");
            resolve(db); // Resolve the promise with the database instance.
          }
        }
      );
    }

    // Call the function to create the table.
    createTable();
  });
}




export const insertUser =  async (db: sqlite3.Database, name: string, email: string, password: string): Promise<{status:string,message:string}> => {
    return new Promise<{ status: string; message: string }>(
      (resolve, rejects) => {
        db.run(
          "INSERT INTO users (name,email,password) VALUES (?,?,?)",
          [name, email, password],
          (error) => {
            if (error) {
              console.error("Error inserting user: ", error.message);
              rejects(error);
            } else {
              const result = {
                status: "OK",
                message: "User inserted successfully",
              };
              resolve(result);
            }
          }
        );
      }
    );
};


export const getAllUsers = async (db:sqlite3.Database):Promise<any[]> => {
    return new Promise<any[]>((resolve, rejects) => {
        db.all('SELECT * FROM users', (err, rows) => {
            if (err) {
                console.error('Error retrieving users: ', err.message);
                rejects(err)
            }
            else {
                resolve(rows);
            }
        })
        
 })
}