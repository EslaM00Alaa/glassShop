const  
     express = require('express') ,
     client = require("../database/db"),
     validateClassifay=require("../models/classifay"),
     isAdmin=require("../middlewares/IsAdmin"),
     router =express.Router();

    router.route("/")
    .get(isAdmin,async(req,res)=>{
        try {
            let sqlQuery = "SELECT * FROM Classifications ;",
                result = await client.query(sqlQuery);

             res.json(result.rows)
        } catch (error) {
            res.status(503).json({msg:error.message})
        }
    })
    .post(isAdmin,async(req,res)=>{
   try {
    const { error } = validateClassifay(req.body);
    if (error) return res.status(404).json({ msg: error.details[0].message });
    let sqlQuery = "INSERT INTO Classifications (classify_name) VALUES ($1) ;"
    await client.query(sqlQuery,[req.body.classify_name])
    res.json({msg:"you insertd successfully"})
   } catch (error) {
    res.status(503).json({msg:error.message})
   }    
    })

    router.get("/types/:id",isAdmin,async(req,res)=>{
        try {
            let sqlQuery = 'SELECT type_id,type_name FROM types where classify_id = $1',
            result =await client.query(sqlQuery,[req.params.id])
            res.json(result.rows)

        } catch (error) {
            res.status(503).json({msg:error.message})
        }
    })
 

    
 
    
    



     module.exports = router ; 