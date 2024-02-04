const  
     express = require('express') ,
     client = require("../database/db"),
     isAdmin=require("../middlewares/IsAdmin")
     router =express.Router();

 
     router.get("/brands",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from glassBrands ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
     
     router.post("/brands",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into glassBrands (brand_name) values($1) ;"
            await client.query(sqlQuery,[req.body.brand_name]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
 
     router.get("/glassLensesColor",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from glassLensesColor ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
     
     router.post("/glassLensesColor",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into glassLensesColor (color) values($1) ;"
            await client.query(sqlQuery,[req.body.color]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
 
     router.get("/sizes",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from glassSize ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
          
     router.post("/sizes",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into glassSize (size) values($1) ;"
            await client.query(sqlQuery,[req.body.size]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })

     router.get("/framType",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from framType ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
          
     router.post("/framType",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into framType (type) values($1) ;"
            await client.query(sqlQuery,[req.body.type]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })

     router.get("/matrials",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from frameMaterial ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
     
     router.post("/matrials",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into frameMaterial (material) values($1) ;"
            await client.query(sqlQuery,[req.body.matrial]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })

     router.get("/colors",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from frameColor ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
     

     
     router.post("/colors",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into frameColor (color) values($1) ;"
            await client.query(sqlQuery,[req.body.color]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })


     router.get("/shaps",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="select * from frameShape ;"
           let result= await client.query(sqlQuery);
            res.json(result.rows)
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })
     

     
     router.post("/shaps",isAdmin,async(req,res)=>{
 
        try {
            let sqlQuery="insert into frameShape (shape) values($1) ;"
            await client.query(sqlQuery,[req.body.shap]);
            res.json({msg:"inserted successfuly"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }

     })

























     module.exports = router;


