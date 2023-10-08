// database.js
import sqlite3 from "sqlite3";

const { verbose } = sqlite3;

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      "./src/database/users.db",
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          console.log("Connected to the SQlite database.");
          resolve(db);
        }
      }
    );

    // Define a function to create the table (if it doesn't exist).
    function createTable() {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT
      )`,
        (err) => {
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
};

export const insertUser = async (db, name, email, password) => {
  return new Promise((resolve, rejects) => {
    db.run(
      "INSERT INTO users (name,email,password) VALUES (?,?,?)",
      [name, email, password],
      function (error) {
        // Use a regular function here to access this.lastID
        if (error) {
          rejects(error);
        } else {
          db.get(
            "SELECT * FROM users WHERE id = ?",
            [this.lastID],
            (error, row) => {
              if (error) {
                rejects(error);
              } else {
                const result = {
                  status: "OK",
                  message: "User inserted successfully",
                  user: row
                    ? { id: row.id, name: row.name, email: row.email }
                    : null,
                };
                resolve(result);
              }
            }
          );
        }
      }
    );
  });
};

export const getAllUsers = async (db) => {
  return new Promise((resolve, rejects) => {
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) {
        console.error("Error retrieving users: ", err.message);
        rejects(err);
      } else {
        resolve(rows);
      }
    });
  });
};
