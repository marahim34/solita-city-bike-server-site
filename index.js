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

            // current page
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;

            const bikeStations = bikeStationsCollection
                .find(query)
                .limit(limit)
                .skip(limit * (page - 1));
            const result = await bikeStations.toArray();
            const count = await bikeStationsCollection.countDocuments(query);
            res.send({
                status: "success",
                count: count,
                data: result
            });
        });

        // Get single bike station
        app.get('/bike-stations/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const bikeStation = await bikeStationsCollection.findOne(filter);
            res.send({
                status: "success",
                data: bikeStation
            });
        });

        // Get searched bikeStations
        app.get('/bike-stations/search', async (req, res) => {
            let query = {};
            const key = req.query.key;

            // Current Page
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;

            if (key && key.length) {
                query = {
                    // text indexes
                    $or: [
                        { name: { $regex: key, $options: 'i' } },
                        { namn_swedish: { $regex: key, $options: 'i' } },
                        { nimi_finnish: { $regex: key, $options: 'i' } },
                        { operaattor: { $regex: key, $options: 'i' } },
                        { osite: { $regex: key, $options: 'i' } },
                        { stad: { $regex: key, $options: 'i' } },
                        { address: { $regex: key, $options: 'i' } },
                    ]
                }
            }
            const count = await bikeStationsCollection.countDocuments(query);
            const result = await bikeStationsCollection.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray();
            res.send({
                status: "success",
                count: count,
                data: result
            });
        });

        //Get all destinations of May
        app.get('/journey-destinations/may', async (req, res) => {

            // current page
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;

            const query = {};
            const count = await journeyList01Collection.countDocuments(query)
            const journeyList01 = journeyList01Collection
                .find(query)
                .limit(limit)
                .skip(limit * (page - 1));
            const result = await journeyList01
                .toArray();
            res.send(
                {
                    status: "success",
                    count: count,
                    data: result
                });
        });

        // Get a journey details
        app.get('/journey-destinations/may/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const journeyDetails = await journeyList01Collection.findOne(filter);
            res.send({
                status: "success",
                data: journeyDetails
            });
        });

        // Get searched destinations of May
        // API link: http://localhost:5000/journey-destinations/may/search?key=It%C3%A4merentori
        app.get('/journey-destinations/may/search', async (req, res) => {
            let query = {};
            const key = req.query.key;

            // current page 
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;

            if (key && key.length) {
                query = {
                    $or: [
                        { covered_distance_in_meter: { $regex: key, $options: 'i' } },
                        { departure: { $regex: key, $options: 'i' } },
                        { departure_station_id: { $regex: key, $options: 'i' } },
                        { departure_station_name: { $regex: key, $options: 'i' } },
                        { return: { $regex: key, $options: 'i' } },
                        { return_station_id: { $regex: key, $options: 'i' } },
                        { return_station_name: { $regex: key, $options: 'i' } }
                    ]
                }
            }
            const count = await journeyList01Collection.countDocuments(query);
            const result = await journeyList01Collection.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray();
            res.send({
                status: "success",
                count: count,
                data: result
            });
        });


        //Get all destinations of June
        app.get('/journey-destinations/june', async (req, res) => {

            // current page
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;

            const query = {};
            const count = await journeyList02Collection.countDocuments(query)
            const journeyList02 = journeyList02Collection
                .find(query)
                .limit(limit)
                .skip(limit * (page - 1));
            const result = await journeyList02
                .toArray();
            res.send(
                {
                    status: "success",
                    count: count,
                    data: result
                });
        });

        // Get a journey details
        app.get('/journey-destinations/june/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const journeyDetails = await journeyList02Collection.findOne(filter);
            res.send({
                status: "success",
                data: journeyDetails
            });
        });

        // Get searched destinations of June
        // API link: http://localhost:5000/journey-destinations/june/search?key=It%C3%A4merentori
        app.get('/journey-destinations/june/search', async (req, res) => {
            let query = {};
            const key = req.query.key;

            // current page 
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;

            if (key && key.length) {
                query = {
                    $or: [
                        { covered_distance_in_meter: { $regex: key, $options: 'i' } },
                        { departure: { $regex: key, $options: 'i' } },
                        { departure_station_id: { $regex: key, $options: 'i' } },
                        { departure_station_name: { $regex: key, $options: 'i' } },
                        { return: { $regex: key, $options: 'i' } },
                        { return_station_id: { $regex: key, $options: 'i' } },
                        { return_station_name: { $regex: key, $options: 'i' } }
                    ]
                }
            }
            const count = await journeyList02Collection.countDocuments(query);
            const result = await journeyList02Collection.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray();
            res.send({
                status: "success",
                count: count,
                data: result
            });
        });

        //Get all destinations of July
        app.get('/journey-destinations/july', async (req, res) => {

            // current page
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;

            const query = {};
            const count = await journeyList03Collection.countDocuments(query)
            const journeyList03 = journeyList03Collection
                .find(query)
                .limit(limit)
                .skip(limit * (page - 1));
            const result = await journeyList03
                .toArray();
            res.send(
                {
                    status: "success",
                    count: count,
                    data: result
                });
        });

        // Get a journey details
        app.get('/journey-destinations/july/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const journeyDetails = await journeyList03Collection.findOne(filter);
            res.send({
                status: "success",
                data: journeyDetails
            });
        });

        // Get searched destinations of July
        // API link: http://localhost:5000/journey-destinations/june/search?key=It%C3%A4merentori
        app.get('/journey-destinations/july/search', async (req, res) => {
            let query = {};
            const key = req.query.key;

            // current page 
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;

            if (key && key.length) {
                query = {
                    $or: [
                        { covered_distance_in_meter: { $regex: key, $options: 'i' } },
                        { departure: { $regex: key, $options: 'i' } },
                        { departure_station_id: { $regex: key, $options: 'i' } },
                        { departure_station_name: { $regex: key, $options: 'i' } },
                        { return: { $regex: key, $options: 'i' } },
                        { return_station_id: { $regex: key, $options: 'i' } },
                        { return_station_name: { $regex: key, $options: 'i' } }
                    ]
                }
            }
            const count = await journeyList03Collection.countDocuments(query);
            const result = await journeyList03Collection.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray();
            res.send({
                status: "success",
                count: count,
                data: result
            });
        });

    }
    finally {

    }
}

run().catch(error => console.error(error))

app.get('/', (req, res) => {
    res.send('Solita server is running')
});

app.listen(port, () => {
    console.log(`Solita server is running on port: ${port}`);
});