// require("dotenv").config();
// const pg = require("pg");

// // Read the database connection details from the environment variables
// const database = process.env.DATABASE;

// // Configure the SSL/TLS options
// const sslConfig = {
//   rejectUnauthorized: false, // This line allows self-signed certificates; remove it for production use with valid certificates
// };

// // Create a new PostgreSQL client with SSL/TLS enabled
// const client = new pg.Client({
//   connectionString: database,
//   ssl: sslConfig,
// });

require("dotenv").config()
const
pg =require("pg"),
database = process.env.DATABASE ,
client = new pg.Client(database) ;

module.exports = client;