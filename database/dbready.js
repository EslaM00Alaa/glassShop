const client = require("./db");

async function isReady() {
  try {
    const tableCheckQuery = `
       SELECT EXISTS (
         SELECT 1
         FROM information_schema.tables
         WHERE table_name = ANY($1::text[])
       );
     `;
    const tablesToCheck = [
      "admins",
      "classifications",
      "types",
      "glasslensescolor",
      "glasssize",
      "framtype",
      "framematerial",
      "glassbrands",
      "frameshape",
      "framecolor",
      "glassproducts",
      "lensesbrands",
      "lensescolor",
      "lensesreplacement",
      "lenstype",
      "lensesproducts",
      "imagesglassesproduct",
      "imageslensessproduct",
      "users",
      "basket",
    ];

    const res = await client.query(tableCheckQuery, [tablesToCheck]);
    const existingTables = res.rows[0].exists;

    if (!existingTables) {
      const createTableQueries = [
        `
         CREATE TABLE admins (
           id SERIAL PRIMARY KEY,
           password VARCHAR(255) NOT NULL,
           username VARCHAR(255) NOT NULL
         );
         `,
        `
         CREATE TABLE classifications (
           classify_id SERIAL PRIMARY KEY,
           classify_name VARCHAR(255) NOT NULL
         );
         `,
        `CREATE TABLE Types (
            type_id SERIAL PRIMARY KEY,
            type_name VARCHAR(255) NOT NULL,
            classify_id INT REFERENCES Classifications(classify_id) NOT NULL
        );`,
        `CREATE TABLE glassLensesColor (
            glassLensesColor_id SERIAL PRIMARY KEY,   
            color VARCHAR(100) NOT NULL
          );`,
        `CREATE TABLE glassSize (
            glassSize_id SERIAL PRIMARY KEY,
            size VARCHAR(10) NOT NULL
          );`,
        `
          CREATE TABLE framType (
           framType_id SERIAL PRIMARY KEY,   
            type VARCHAR(255) NOT NULL
          );`,
        `CREATE TABLE frameMaterial (
            frameMaterial_id SERIAL PRIMARY KEY,
            material VARCHAR(255) NOT NULL
          );`,
        `CREATE TABLE glassBrands (
            brand_id SERIAL PRIMARY KEY,
            brand_name VARCHAR(255) NOT NULL
          );`,
        `CREATE TABLE frameShape (
            frameShape_id SERIAL PRIMARY KEY,
            shape VARCHAR(255) NOT NULL
          );`,
        `CREATE TABLE frameColor (
            frameColor_id SERIAL PRIMARY KEY,
            color VARCHAR(255) NOT NULL
          );
          `,
        `CREATE TABLE glassProducts (
            product_id SERIAL PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL,
            salary INT NOT NULL,
            model_number VARCHAR(255) ,
            type_id INT REFERENCES types(type_id),
            brand_id INT REFERENCES glassBrands(brand_id),
            frameShape_id INT REFERENCES frameShape(frameShape_id),
            framType_id INT REFERENCES framType(framType_id),
            frameColor_id INT REFERENCES frameColor(frameColor_id),
            frameMaterial_id INT REFERENCES frameMaterial(frameMaterial_id),
            glassSize_id INT REFERENCES glassSize(glassSize_id),
            glassLensesColor_id INT REFERENCES glassLensesColor(glassLensesColor_id)
          );`,
        `CREATE TABLE lensesBrands (
            brand_id SERIAL PRIMARY KEY,
            brand_name VARCHAR(255) NOT NULL
          );`,
        `CREATE TABLE lensesColor (
            lensesColor_id SERIAL PRIMARY KEY,
            color VARCHAR(255) NOT NULL
          );`,
        `CREATE TABLE lensesReplacement (
            lensesReplacement_id SERIAL PRIMARY KEY,
            replacement VARCHAR(255) NOT NULL
          );
          `,
        `CREATE TABLE lensesType (
            lensesType_id SERIAL PRIMARY KEY,
            lensesType VARCHAR(255) NOT NULL
          );
          `,
        `CREATE TABLE lensesProducts (
            product_id SERIAL PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL,
            salary INT NOT NULL,
            model_number VARCHAR(255) ,
            type_id INT REFERENCES types(type_id),
            brand_id INT REFERENCES lensesBrands(brand_id),
            lensesColor_id INT REFERENCES lensesColor(lensesColor_id),
            lensesReplacement_id INT REFERENCES lensesReplacement(lensesReplacement_id),
            lensesType_id INT REFERENCES lensesType(lensesType_id)
          );`,
        `
          create table imagesGlassesProduct (
              image_id varchar(255) primary key,
              product_id int references glassProducts(product_id) not null,
              image varchar(255) not null 
          )`,
        `create table imagesLensessProduct (
            image_id varchar(255) primary key,
            product_id int references lensesProducts(product_id) not null,
            image varchar(255) not null 
        )`,
        `
        CREATE TABLE users (
        id serial PRIMARY KEY ,
        fName VARCHAR(255) NOT NULL ,
        lName VARCHAR(255) NOT NULL ,
        city VARCHAR(255)  ,
        pass VARCHAR(255) NOT NULL ,
        address VARCHAR(255) ,
        phone VARCHAR(255)	, 
        mail  VARCHAR(255) 	NOT NULL UNIQUE ,
        verify_code VARCHAR(255)	
        )
        `,
        `
  
        CREATE TABLE basket (
        id serial PRIMARY KEY ,
        product_id INT NOT NULL ,
        type_id INT REFERENCES types(type_id),
        user_id INT REFERENCES users(id),	
        Quentity INT DEFAULT 1
        )
        `,

        // ... continue with other table creation queries
      ];

      for (const query of createTableQueries) {
        await client.query(query);
      }

      console.log("Tables created successfully!");
    } else {
      console.log("Tables already exist!");
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

module.exports = isReady;
