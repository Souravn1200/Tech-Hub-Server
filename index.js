const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.yctm60s.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yctm60s.mongodb.net/?retryWrites=true&w=majority`;

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

    const productsCollection = client.db("techhubDB").collection("products");
    const commentsCollection = client.db("techhubDB").collection("comments");
    const userCollection = client.db("techhubDB").collection("users");

    // Getting all products data

    app.get('/products', async(req, res) => {
        const result = await productsCollection.find().toArray();
        res.send(result)
    })

    // Getting Single Product

    app.get('/product/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result =  await productsCollection.findOne(query);
      res.send(result)
    })

    // Posting comments for product

    app.post('/comments', async(req, res) => {
      const data = req.body;
      const result = await commentsCollection.insertOne(data)
      res.send(result)
    })

    //Fetching comments of perticular product
    
    app.get('/comments/:id', async(req, res) => {
      const id = req.params.id
      const query = { commentId : id}
      const result = await commentsCollection.find(query).toArray();
      res.send(result);
    })

    // Fetching for searc bar
    app.get('/search/:item', async(req, res) => {
      const item = req.params.item
      const query = {tag : item}
      const result = await productsCollection.find(query).toArray();
      res.send(result)
    })

    // Posting users products

    app.post('/products', async(req, res) => {
      const data = req.body;
      const result = await productsCollection.insertOne(data);
      res.send(result)
    })

  // Getting perticular users product to my products

    app.get('/myproducts/:email', async(req, res) => {
      const email = req.params.email;
      const query = {ownerEmail : email}
      const result = await productsCollection.find(query).toArray();
      res.send(result)
    })

    // Updating product
    app.patch('/update/:id', async(req, res) => {
      const item = req.body
      const id = req.params.id
      const filter = {_id : new ObjectId(id)}
      const updatedDoc = {
        $set: {
          product_name: item.product_name,
        product_image: item.product_image,
        ddescription: item. ddescription,
        tag: item.tag,
        eexternalLinks: item.eexternalLinks,
       
        }
      }
      const result =  await productsCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })

    // Deleting Product

    app.delete('/delete/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    })

    // Users Releted API

    app.post('/users', async(req, res) => {

      const user = req.body;
      const query = {email : user.email}
      const existingUser =  await userCollection.findOne(query);

      if(existingUser){
        return res.send({message: 'User aldeady in db', insertedId: null})
      }

      const result =  await userCollection.insertOne(user);
      res.send(result)
    })

    // Mod Releted

    //  Making product featured

    app.patch('/prodcutreviewqueue/:id', async(req, res) =>{
      const id =  req.params.id;
      const query =  {_id : new ObjectId(id)}
      const updateDoc = {
        $set : {
          isFeatured : true
        }
      }
      const result = await productsCollection.updateOne(query, updateDoc);
      res.send(result)
    })
   
    // Accepting Product 

    app.patch('/prodcutaccept/:id', async(req, res) =>{
      const id =  req.params.id;
      const query =  {_id : new ObjectId(id)}
      const updateDoc = {
        $set : {
          status : 'Accepted'
        }
      }
      const result = await productsCollection.updateOne(query, updateDoc);
      res.send(result)
    })

    // Rejecting Product

    app.patch('/prodcutreject/:id', async(req, res) =>{
      const id =  req.params.id;
      const query =  {_id : new ObjectId(id)}
      const updateDoc = {
        $set : {
          status : 'Rejected'
        }
      }
      const result = await productsCollection.updateOne(query, updateDoc);
      res.send(result)
    })

    // Reporting product

    app.patch('/prodcutreport/:id', async(req, res) =>{
      const id =  req.params.id;
      const query =  {_id : new ObjectId(id)}
      const updateDoc = {
        $set : {
          isReported : true
        }
      }
      const result = await productsCollection.updateOne(query, updateDoc);
      res.send(result)
    })

    // Admin releted
    // Fetching all users

    app.get('/users', async(req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    //Making Admin

    app.patch('/makeadmin/:id', async(req, res) =>{
      const id =  req.params.id;
      const query =  {_id : new ObjectId(id)}
      const updateDoc = {
        $set : {
          isAdmin : true
        }
      }
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result)
    })

    //Making MOD

    
    app.patch('/makemod/:id', async(req, res) =>{
      const id =  req.params.id;
      const query =  {_id : new ObjectId(id)}
      const updateDoc = {
        $set : {
          isMod : true
        }
      }
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result)
    })

    // app.get('/search/:item', async (req, res) => {
    //   const item  = req.params.item; // Access item from URL parameter
    //   const query = { tag: item }; // Assuming 'tag' is the field to search for in products
    //   try {
    //     const result = await productsCollection.find(query).toArray();
    //     res.send(result);
    //   } catch (error) {
    //     res.status(500).send(error.message);
    //   }
    // });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Tech is runnig')
})

app.listen(port, () => {
    console.log(`Tech server running on the port ${port}`);
})