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
            const sortOrder = req.query.sortOrder || 1;

            const bikeStations = bikeStationsCollection
                .find(query)
                .sort({ name: sortOrder })
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
            // console.log(id);
            const filter = { _id: ObjectId(id) };
            const bikeStation = await bikeStationsCollection.findOne(filter);
            res.send({
                status: "success",
                data: bikeStation
            });
        });


        app.get('/stationsSearch', async (req, res) => {
            const key = req.query.key;
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            console.log(key, limit, page);
            let query = {};

            if (key && key.length) {
                const regex = new RegExp(String(key), 'i');
                // console.log(regex);
                query = {
                    $or: [
                        { name: { $regex: regex } },
                        { namn_swedish: { $regex: regex } },
                        { nimi_finnish: { $regex: regex } },
                        { operaattor: { $regex: regex } },
                        { osite: { $regex: regex } },
                        { stad: { $regex: regex } },
                        { address: { $regex: regex } },
                        { kaupunki: { $regex: regex } },
                    ]
                };
            }

            try {
                const count = await bikeStationsCollection.countDocuments(query);
                const result = await bikeStationsCollection
                    .find(query)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .toArray();
                res.status(200).send({
                    status: 'success',
                    count: count,
                    data: result
                });
            } catch (error) {
                res.status(500).send({
                    status: 'error',
                    error: error.message
                });
            }
        });

        //Get all destinations of May
        app.get('/journey-destinations/may', async (req, res) => {
            const query = {};

            // current page
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            const sortOrder = req.query.sortOrder || 1;

            await journeyList01Collection.createIndex({ departure_station_name: 1 });

            const journeyList01 = journeyList01Collection
                .find(query)
                .sort({ departure_station_name: sortOrder })
                .limit(limit)
                .skip(limit * (page - 1))
                .allowDiskUse(true);

            const result = await journeyList01.toArray();
            const count = await journeyList01Collection.countDocuments(query)

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
            // console.log(id);
            const filter = { _id: ObjectId(id) };
            const journeyDetails = await journeyList01Collection.findOne(filter);
            res.send({
                status: "success",
                data: journeyDetails
            });
        });

        app.get('/destinationsOnMaySearch', async (req, res) => {
            const key = req.query.key;
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            // console.log(key);
            let query = {};

            if (key && key.length) {
                const regex = new RegExp(String(key), 'i');
                // console.log(regex);
                query = {
                    $or: [
                        { covered_distance_in_meter: { $regex: regex } },
                        { departure_time: { $regex: regex } },
                        { departure_station_id: { $regex: regex } },
                        { departure_station_name: { $regex: regex } },
                        { return_time: { $regex: regex } },
                        { return_station_id: { $regex: regex } },
                        { return_station_name: { $regex: regex } },
                        { duration_in_seconds: { $regex: regex } }
                    ]
                };
            }

            try {
                const count = await journeyList01Collection.countDocuments(query);
                const result = await journeyList01Collection
                    .find(query)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .toArray();
                res.status(200).send({
                    status: 'success',
                    count: count,
                    data: result
                });
            } catch (error) {
                res.status(500).send({
                    status: 'error',
                    error: error.message
                });
            }
        });

        //Get all destinations of June
        app.get('/journey-destinations/june', async (req, res) => {
            const query = {};

            // current page
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            const sortOrder = req.query.sortOrder || 1;

            await journeyList02Collection.createIndex({ departure_station_name: 1 });

            const journeyList02 = journeyList02Collection
                .find(query)
                .sort({ departure_station_name: sortOrder })
                .limit(limit)
                .skip(limit * (page - 1))
                .allowDiskUse(true);

            const count = await journeyList02Collection.countDocuments(query);
            const result = await journeyList02.toArray();

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
            // console.log(id);
            const filter = { _id: ObjectId(id) };
            const journeyDetails = await journeyList02Collection.findOne(filter);
            res.send({
                status: "success",
                data: journeyDetails
            });
        });

        // Get searched destinations of June
        app.get('/destinationsOnJuneSearch', async (req, res) => {
            const key = req.query.key;
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            // console.log(key);

            let query = {};

            if (key && key.length) {
                const regex = new RegExp(String(key), 'i');
                // console.log(regex);
                query = {
                    $or: [
                        { covered_distance_in_meter: { $regex: regex } },
                        { departure_time: { $regex: regex } },
                        { departure_station_id: { $regex: regex } },
                        { departure_station_name: { $regex: regex } },
                        { return_time: { $regex: regex } },
                        { return_station_id: { $regex: regex } },
                        { return_station_name: { $regex: regex } },
                        { duration_in_seconds: { $regex: regex } }
                    ]
                };
            }

            try {
                const count = await journeyList02Collection.countDocuments(query);
                const result = await journeyList02Collection
                    .find(query)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .toArray();

                res.status(200).send({
                    status: 'success',
                    count: count,
                    data: result
                });

            } catch (error) {
                res.status(500).send({
                    status: 'error',
                    error: error.message
                });
            }
        });

        //Get all destinations of July
        app.get('/journey-destinations/july', async (req, res) => {
            const query = {};

            // current page
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            const sortOrder = req.query.sortOrder || 1;

            await journeyList02Collection.createIndex({ departure_station_name: 1 });

            const journeyList03 = journeyList03Collection
                .find(query)
                .sort({ departure_station_name: sortOrder })
                .limit(limit)
                .skip(limit * (page - 1))
                .allowDiskUse(true);

            const count = await journeyList03Collection.countDocuments(query)
            const result = await journeyList03
                .toArray();
            res.send(
                {
                    status: "success",
                    count: count,
                    data: result
                });
        });

        app.get('/journey-destinations/june', async (req, res) => {
            const query = {};

            // current page
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            const sortOrder = req.query.sortOrder || 1;

            await journeyList02Collection.createIndex({ departure_station_name: 1 });

            const journeyList02 = journeyList02Collection
                .find(query)
                .sort({ departure_station_name: sortOrder })
                .limit(limit)
                .skip(limit * (page - 1))
                .allowDiskUse(true);

            const count = await journeyList02Collection.countDocuments(query);
            const result = await journeyList02.toArray();

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
            // console.log(id);
            const filter = { _id: ObjectId(id) };
            const journeyDetails = await journeyList03Collection.findOne(filter);
            res.send({
                status: "success",
                data: journeyDetails
            });
        });

        // Get searched destinations of July
        app.get('/destinationsOnJulySearch', async (req, res) => {
            const key = req.query.key;
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            // console.log(key);
            let query = {};

            if (key && key.length) {
                const regex = new RegExp(String(key), 'i');
                // console.log(regex);
                query = {
                    $or: [
                        { covered_distance_in_meter: { $regex: regex } },
                        { departure_time: { $regex: regex } },
                        { departure_station_id: { $regex: regex } },
                        { departure_station_name: { $regex: regex } },
                        { return_time: { $regex: regex } },
                        { return_station_id: { $regex: regex } },
                        { return_station_name: { $regex: regex } },
                        { duration_in_seconds: { $regex: regex } }
                    ]
                };
            }

            try {
                const count = await journeyList03Collection.countDocuments(query);
                const result = await journeyList03Collection
                    .find(query)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .toArray();

                res.status(200).send({
                    status: 'success',
                    count: count,
                    data: result
                });

            } catch (error) {
                res.status(500).send({
                    status: 'error',
                    error: error.message
                });
            }
        });

    }
    finally {

    }
}

run().catch(error => console.error(error))

app.get('/', (req, res) => {
    res.send('City Bike server is running')
});

app.listen(port, () => {
    console.log(`City Bike server is running on port: ${port}`);
});
