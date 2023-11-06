const express = require("express");
const router = express.Router();

router.get("/short-polling", (req, res)=>{
    const {currTime} = req.body;
    console.log("Time " + currTime);
    let min = 1, max = 100;
    let store =  Math.floor(Math.random() * (max - min + 1)) + min;
    res.status(200).json({
        val: store
    });
})

module.exports = {router}