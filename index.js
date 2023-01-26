const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connecting MongoDB
const uri_01 = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ivhgvma.mongodb.net/?retryWrites=true&w=majority`;
const uri_02 = `mongodb+srv://${process.env.DB1_USER}:${process.env.DB_PASSWORD}@cluster0.wzkdpde.mongodb.net/?retryWrites=true&w=majority`;
const uri_03 = `mongodb+srv://${process.env.DB1_USER}:${process.env.DB_PASSWORD}@cluster0.vzokzot.mongodb.net/?retryWrites=true&w=majority`;

// List of MongoDB clients
const client01 = new MongoClient(uri_01, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client02 = new MongoClient(uri_02, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client03 = new MongoClient(uri_03, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // collection list
        const bikeStationsCollection = client01.db('bikeApp').collection('bikeStation');
        const journeyList01Collection = client01.db('bikeApp').collection('journeyList01');
        const journeyList02Collection = client02.db('bikeApp').collection('journeyList02');
        const journeyList03Collection = client03.db('bikeApp').collection('journeyList03');

        //Get all bike stations
        app.get('/bike-stations', async (req, res) => {
            const query = {};
            const bikeStations = bikeStationsCollection.find(query);
            const result = await bikeStations.toArray();
            res.send(result);
        })

        // Get single bike station
        app.get('/bike-stations/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const bikeStation = await bikeStationsCollection.findOne(filter);
            res.send(bikeStation);
        })


    }
    finally {

    }
}

run().catch(error => console.error(error))

app.get('/', (req, res) => {
    res.send('delta-clinic server is running')
});

app.listen(port, () => {
    console.log(`delta-clinic server is running on port: ${port}`);
});