const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;


// middleware
app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    // database
    const tasks = client.db("task-management").collection("tasks");
    
    // task post request
    app.post("/tasks",async(req,res)=>{
        const task = req.body;
        // console.log(task)
        const result = await tasks.insertOne(task)
        res.send(result)
    })

    // get tasks
    app.get("/tasks/:email",async(req,res)=>{
        const email = req.params.email ;
        const userEmail = {email: email}
        const result = await tasks.find(userEmail).toArray();
        console.log(result)
        res.send(result)
    })

    // delete
    app.delete("/tasks/:id", async(req,res) =>{
      const id = req.params.id
      const query = { _id: new ObjectId(id)}
      // console.log(id)
      const result = await tasks.deleteOne(query);
      res.send(result)
    })






    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("Hi route home")
})

app.listen(port, () =>{
    console.log(`localhost connect on ${port}`)
})