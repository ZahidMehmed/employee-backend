const express = require('express');
const app = express();
const cors = require('cors');
require('../db/config')
const events = require('../ScheemaModels/EventsSchema')
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const { findOne } = require('../ScheemaModels/EmployeeDataScheema');
app.use(express.json())
app.use(cors())
// app.use(`/Uploads`, express.static('../Uploads'))
const { upload } = require('./middleware')
const eventPostRouter = express.Router()
eventPostRouter.post('/', upload.single('posterImage'), async (req, resp) => {
    try {
        const { title, description, location, eventStartDate, eventStartTime, eventEndDate, eventEndTime } = req.body;
        const posterImage = req.file?.filename;
        const result = new events({
            title,
            description,
            location,
            posterImage,
            eventStartDate,
            eventStartTime,
            eventEndDate,
            eventEndTime
        });

        await result.save();
        console.log(result)


    } catch (error) {
        console.log("error: " + error);
    }
});


const eventGetRouter = express.Router()
eventGetRouter.get('/', async (req, resp) => {
    let result = await events.find()
    if (result.length > 0) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No Product Avalaibal" })
    }
})

const eventGetRouterbyID = express.Router()
eventGetRouterbyID.get('/:id', async (req, res) => {
    try {

        let result = await events.findOne({ _id: req.params.id });
        if (result) {
            res.send(result)
        }
        else {
            res.send("No result found")
        }
    } catch (error) {

    }
})


const eventPutRouterbyId = express.Router()
eventPutRouterbyId.put('/:id', upload.single('posterImage'), async (req, res) => {



    const { title, description, location, eventStartDate, eventStartTime, eventEndDate, eventEndTime } = req.body;
    let posterImage = req.file?.filename;

    try {
        let event = await events.findById(req.params.id);
        if (!event) {
            return res.status(404).send('Employee not found');
        }

        if (posterImage) {
            // Delete the previous image file if it exists
            if (event.posterImage) {
                const imagePath = path.join(__dirname, '../uploads', event.posterImage);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        } else {
            // If no new image file was uploaded, use the existing image file
            posterImage = event.posterImage;
        }

        const result = await events.findByIdAndUpdate(req.params.id, {
            posterImage,
            title, description, location, eventStartDate, eventStartTime, eventEndDate, eventEndTime
        }, { new: true });

        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating event");
    }
});



const eventDeleteRouter = express.Router()
eventDeleteRouter.delete('/:id', async (req, resp) => {
    const employee = await events.findById(req.params.id);
    if (!employee) {
        return resp.status(404).send('Product not found');
    }

    const result = await events.deleteOne({ _id: req.params.id });
    resp.send(result);

    // Delete the image file from the folder
    if (employee.posterImage) {
        const imagePath = path.join(__dirname, '../uploads', employee.posterImage);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

});


module.exports = { eventPostRouter, eventGetRouter, eventGetRouterbyID, eventPutRouterbyId, eventDeleteRouter }