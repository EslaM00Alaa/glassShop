function sanitizeInput(req, res, next) {
    // Check request parameters
    for (const param in req.params) {
      req.params[param] = sanitizeString(req.params[param]);
    }
  
    // Check request body
    for (const field in req.body) {
      req.body[field] = sanitizeString(req.body[field]);
    }
  
    next();
  }
  
  function sanitizeString(value) {
    // Remove any characters that can potentially harm the database
    if(isNaN(value)){
      const sanitizedValue = value.replace(/[<>&'"`;]/g, '');
  
      return sanitizedValue;
    
    }
    return value;
    }

  module.exports = sanitizeInput ;