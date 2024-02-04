const  
     express = require('express') ,
     client = require("../database/db"),
     isAdmin=require("../middlewares/IsAdmin")
     router =express.Router();

 
     router.get("/brands",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from lensesBrands ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
     
     router.post("/brands",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into lensesBrands (brand_name) values($1) ;"
            await client.query(sqlQuery,[req.body.brand_name]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
 




     router.get("/lensesColor",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from lensesColor ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
     
     router.post("/lensesColor",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into lensesColor (color) values($1) ;"
            await client.query(sqlQuery,[req.body.color]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })

     


     router.get("/lensesReplacement",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from lensesReplacement ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
     
     router.post("/lensesReplacement",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into lensesReplacement (replacement) values($1) ;"
            await client.query(sqlQuery,[req.body.replacement]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
 

 






     router.get("/lensesType",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from lensesType ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
     
     router.post("/lensesType",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into lensesType (lensesType) values($1) ;"
            await client.query(sqlQuery,[req.body.lensesType]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
 

 













     



     module.exports = router;




