import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

const url = "mongodb+srv://admin:admin@cluster0.whjwszv.mongodb.net/?retryWrites=true&w=majority";
const dbName = "users";
const client = new MongoClient(url);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  connectDB();
});

// Testing Service
app.get("/", (req, res) => {
  res.status(200).json("Hello World from Express JS");
});

// SIGN UP
app.post("/signup", async (req, res) => {
  try {
    if (!db) return res.status(500).json("Database not connected");

    const existingUser = await db.collection("users").findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const result = await db.collection("users").insertOne(req.body);
    res.status(200).json({
      message: "Registered Successfully",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    if (!db) return res.status(500).json("Database not connected");

    const user = await db.collection("users").findOne({
      email: req.body.email,
      password: req.body.password // Plain text for demo; use hashing in production
    });

    if (!user) return res.status(401).json({ code: "401", message: "Invalid Credentials!" });

    res.status(200).json({ code: "300", message: "Login Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
});

// GET FULL NAME (required by Dashboard)
app.post("/getfullname", async (req, res) => {
  try {
    if (!db) return res.status(500).json("Database not connected");
    const user = await db.collection("users").findOne({ email: req.body.email });
    if (!user) return res.status(404).json("Invalid User");
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
});
