const express = require("express");
const cors =  require("cors")
const dotenv = require("dotenv");
const { router } = require("./router/route");
dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', "http://localhost:3002"],
    credentials: true
}))
app.use(express.json());
app.get("/", (req, res)=>{
    console.log("Default\n");
    res.status(200).json({sucess: true})
})
app.use("/api/v1", router)
app.listen(port, ()=>{
    console.log(`Serve started successfully at port ${port}`);
})
