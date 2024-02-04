const  
     express = require('express') ,
     client = require("../database/db"),
     validateType=require("../models/type"),
     isAdmin=require("../middlewares/IsAdmin"),
     router =express.Router();





     router.post("/:id",isAdmin,async (req,res) =>{
       try {
        req.body.classify_id=req.params.id;
        const { error } = validateType(req.body);
        if (error) return res.status(404).json({ msg: error.details[0].message });   
        let sqlQuery = "INSERT INTO Types (type_name,classify_id) VALUES ($1,$2) ;"
        await client.query(sqlQuery,[req.body.type_name,req.params.id])
        res.json({msg:"you insertd successfully"})
       } catch (error) {
        res.status(503).json({msg:error.message})
       }
     })
 

     

     router.get("/",isAdmin,async (req,res) =>{
      try {
        let sqlQuery = 'SELECT type_id,type_name FROM types',
        result =await client.query(sqlQuery)
        res.json(result.rows)

    } catch (error) {
        res.status(503).json({msg:error.message})
    }
    })

 
    




     module.exports = router ; 