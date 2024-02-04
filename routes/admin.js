const  
     express = require('express') ,
     client = require("../database/db"),
     validateAdmin=require("../models/admin"),
     createToken=require("../utils/AdminToken")
     router =express.Router();

     
     
     router.post('/register', async (req, res) => {
      try {
        const { error } = validateAdmin(req.body);
        if (error) return res.status(404).json({ msg: error.details[0].message });
    
        await client.query("INSERT INTO Admins (username, password) VALUES ($1, $2)", [req.body.user_name, req.body.pass]);
        res.json({ msg: "admin registered" });
      } catch (error) {
        return res.status(404).json({ msg: error.message });
      }
    });


     router.post('/login',async(req,res)=>{
     try {
       
        const { error } = validateAdmin(req.body);
        if (error) return res.status(404).json({ msg: error.details[0].message });
       
        let sqlQuery = `SELECT * FROM Admins WHERE username = $1 and password = $2 `
        let  result = await client.query(sqlQuery,[req.body.user_name,req.body.pass]) ;
        if(result.rows.length>0)
        {
           return res.json({token:createToken(result.rows[0].id,result.rows[0].username),Data:{name:"admin",role:"admin"}})
        }
        else
        {
          return  res.status(404).json({msg:"USER NAME OR PASSWOR INVLID"});
        }
        
     } catch (error) {
       return  res.status(404).json({msg:error.message})
     }
})

























     module.exports = router;


