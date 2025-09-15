import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/balloons/:hour", async (req, res)=>{
  const hour = req.params.hour|| "00";
  try{
    const response = await axios.get(`https://a.windbornesystems.com/treasure/${hour}.json`);
    res.json(response.data);
  }catch(err){
    console.error(err.message);
    res.status(500).json({error: "Failed to fetch balloon data at hour"});
  }
});

const PORT = 4000;
app.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});

