const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

// middlewere
app.use(cors())
app.use(express.json())


// <-------mongodb------->
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.askanda.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        const homeHeroDB = client.db('HomeHeroDB')
        const servicesColl = homeHeroDB.collection('Services')

        // <----------apis here--------->
        app.get('/services', async (req, res) => {
            const result = await servicesColl.find().toArray();
            res.send(result)
        })

        // add services 
        app.post('/services', async (req, res) => {
            const newServices = req.body;
            const result = await servicesColl.insertOne(newServices);
            res.send(result)
        })
        // </---------apis here--------->

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);
// </-------mongodb------->




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
