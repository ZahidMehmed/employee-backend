const express = require('express');
const app = express();
const cors = require('cors');
require('../db/config')
app.use(`/Uploads`, express.static('../Uploads'))
const EmployeDataList = require('../ScheemaModels/EmployeeDataScheema')
const multer = require('multer')
const path = require('path');
const fs = require('fs');
app.use(express.json())
app.use(cors())
//midleWare
const {upload} = require('./middleware')
// const storage = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, callBack) {
//             callBack(null, "./Uploads")
//         },
//         filename: function (req, file, callBack) {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//             const ext = path.extname(file.originalname);
//             callBack(null, file.fieldname + '-' + uniqueSuffix + ext)
//         }
//     })
// }).single('image')

const EmployePostRouter = express.Router()
EmployePostRouter.post('/', upload.single('image'), async (req, resp) => {
    try {
        
    const {  fullName, email, password, CNIC, designation, salary, lastDegree, address, joiningDate} = req.body
    let proPhoto = req.file?.filename
    // const images = req.files?.map(file => file.filename);
    let result = new EmployeDataList({proPhoto, fullName, email, password, CNIC, designation, salary, lastDegree, address, joiningDate});
    result = await result.save();
    resp.send(result)
    console.log(result)
} catch (error) {
        console.log(error)
}
})

const EmployeGetRouter = express.Router()
EmployeGetRouter.get('/', async (req, resp) => {
    let result = await EmployeDataList.find()
    if (result.length > 0) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No Product Avalaibal" })
    }
})


const EmployeDeleteRouter = express.Router()
 EmployeDeleteRouter.delete('/:id', async (req, resp) => {
    const employee = await EmployeDataList.findById(req.params.id);
    if (!employee) {
        return resp.status(404).send('Product not found');
    }

    const result = await EmployeDataList.deleteOne({ _id: req.params.id });
    resp.send(result);

    // Delete the image file from the folder
    if (employee.proPhoto) {
        const imagePath = path.join(__dirname, '../uploads', employee.proPhoto);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

});

const EmployeGetRouterbyID = express.Router()
EmployeGetRouterbyID.get('/:id', async(req, res)=>{
    try {
        
        let result = await EmployeDataList.findOne({_id: req.params.id });
        if (result) {
            res.send(result)
        }
        else {
            res.send("No result found")
        }
    } catch (error) {
          
    }
})




const EmployePutRouterbyId = express.Router()
EmployePutRouterbyId.put('/:id',  upload.single('image'),async (req, res) => {
    const { fullName, email, password, CNIC, designation, salary, lastDegree, address, joiningDate } = req.body;
    let proPhoto = req.file?.filename;

    try {
        let employee = await EmployeDataList.findById(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }

        if (proPhoto) {
            // Delete the previous image file if it exists
            if (employee.proPhoto) {
                const imagePath = path.join(__dirname, '../uploads', employee.proPhoto);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        } else {
            // If no new image file was uploaded, use the existing image file
            proPhoto = employee.proPhoto;
        }

        const result = await EmployeDataList.findByIdAndUpdate(req.params.id, {
            proPhoto,
            fullName,
            email,
            password,
            CNIC,
            designation,
            salary,
            lastDegree,
            address,
            joiningDate
        }, { new: true });

        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating employee");
    }
});

const EmploginPostRouter = express.Router()
EmploginPostRouter.post('/', async (req, resp) => {

     if (req.body.password && req.body.email) {

        const user = await EmployeDataList.findOne(req.body).select('-password')
        if (user) {
           
            resp.send(user)
        }
        else {
            resp.send("no Result found")
        }
    }
    else {
        resp.status(401).send({ message: 'Invalid email or password' });
    }
})

module.exports = {
    EmployePostRouter,
    EmployeGetRouter,
    EmployeDeleteRouter,
    EmployeGetRouterbyID,
    EmployePutRouterbyId,
    EmploginPostRouter
}