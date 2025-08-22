const express = require('express')
const cors = require('cors');
require('dotenv').config();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tnmpmcr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();

        const db = client.db("prodexdb");
        const productsCollection = db.collection("products");

        app.post("/products", async (req, res) => {
            try {
                const product = req.body;
                const result = await productsCollection.insertOne(product);
                res.status(201).send(result);
            } catch (err) {
                res.status(500).send({
                    error: "Failed to add product"
                });
            }
        });

        app.get("/products", async (req, res) => {
            try {
                const products = await productsCollection.find().toArray();
                res.send(products);
            } catch (err) {
                res.status(500).send({
                    error: "Failed to fetch products"
                });
            }
        });

        app.get("/products/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const product = await productsCollection.findOne({
                    _id: new ObjectId(id)
                });

                if (!product) {
                    return res.status(404).send({
                        error: "Product not found"
                    });
                }

                res.send(product);
            } catch (err) {
                res.status(400).send({
                    error: "Invalid ID format"
                });
            }
        });

        // await client.db("admin").command({
        //     ping: 1
        // });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Prodex is running!')
})

app.listen(port, () => {
    console.log(`Prodex listening on port ${port}`)
})