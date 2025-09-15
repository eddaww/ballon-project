import express from "express";
import axios from "axios";
import cors from "cors";
import { fileURLToPath } from "url"; 
import path from "path";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../dist")));

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

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

const PORT = 4000;
app.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});

