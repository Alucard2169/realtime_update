import pgPromise from "pg-promise";
import sqlite3 from "sqlite3";

const { verbose } = sqlite3;
const pgp = pgPromise();

const isProduction = process.env.NODE_ENV === "production";

const db = isProduction
  ? pgp(process.env.CYCLIC_DB || "postgres://localhost:5432/mylocaldb")
  : new sqlite3.Database(
      "./src/database/users.db",
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Connected to the SQlite database.");
        }
      }
    );

export const initializeDatabase = async () => {
  if (isProduction) {
    await db.none(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT
    )`);
  } else {
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
        } else {
          console.log("Table created successfully.");
        }
      }
    );
  }
};

export const insertUser = async (name, email, password) => {
  if (isProduction) {
    const user = await db.one(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    return { status: "OK", message: "User inserted successfully", user };
  } else {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (name,email,password) VALUES (?,?,?)",
        [name, email, password],
        function (error) {
          if (error) {
            reject(error);
          } else {
            db.get(
              "SELECT * FROM users WHERE id = ?",
              [this.lastID],
              (error, row) => {
                if (error) {
                  reject(error);
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
  }
};

export const getAllUsers = async () => {
  if (isProduction) {
    const users = await db.any("SELECT * FROM users");
    return users;
  } else {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
          console.error("Error retrieving users: ", err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
};
