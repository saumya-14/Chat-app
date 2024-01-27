const mongoose = require('mongoose');


const connect = async () => {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/chatapp", {
       
        
      });
      
    } catch (error) {
      
    }
  };
  

module.exports=connect;
