const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {MongoClient} = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = 5000

app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7xlib.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true ,  useUnifiedTopology: true});
client.connect(err => {
  const volunteersCollection = client.db("volunteer-network").collection("volunteers");
  const volunteerTasks = client.db("volunteer-network").collection("tasks");
    
  app.post("/addTask", (req, res) => {
      const volunteer = req.body;
      volunteerTasks.insertOne(volunteer)
    .then(result => {
        console.log(result);
        res.send(result.insertedCount);
    })
  })

  app.get("/mytsks", (req, res) => {
    volunteerTasks.find({ email: req.query.email})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.delete('/delete/:_id', (req, res) => {
    volunteerTasks.deleteOne({_id: ObjectId(req.params._id)})
    .then( (result) => {
       res.send(result.deletedCount > 0)
    })
})

  app.get("/volunteers", (req, res) => {
      volunteersCollection.find({})
      .toArray( (err, documents) => {
          res.send(documents);
      })
  })

  app.get("/task/:_id", (req, res) => {
    volunteersCollection.find({_id: ObjectId(req.params._id)})
    .toArray( (err, documents) => {
      console.log(documents[0]);
      res.send(documents[0]);
    })
  })

  app.get('/admin', (req, res) => {
    volunteerTasks.find({})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })


    
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})