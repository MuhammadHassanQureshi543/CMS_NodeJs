const userModel = require('../Model/userModel');
const attendanceModel = require('../Model/attendanceModel')
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;

const multerStorage = multer.diskStorage({
  destination: "public/img/user",
  filename: (req, file, next) => {
    if (file.fieldname === "photo") {
      next(null, `${file.fieldname}-${Date.now()}.png`);
    } else {
      next();
    }
  }
});

const uploadImage = multer({
  storage: multerStorage
});

exports.uploadUserPhoto = uploadImage.single('photo');

exports.createUser = async (req, res, next) => {
  try {
    req.body.photo = req.file.filename
    const user = await userModel.create(req.body);
    res.status(200).json({
      status: 'Success',
      data: user
    });
  } catch (err) {
    if (err.code === 11000) {
      let fieldArray = Object.keys(err.keyPattern);
      res.status(200).json({
        status: 'error',
        message: `Duplicate entry on ${fieldArray.join(", ")}`,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }
};

exports.getdata = async(req,res,next)=>{
  let user = await userModel.findById(req.query.myid)
  res.status(200).json({
    status:"Success",
    user
  })
}

exports.changeUserPhoto = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const photoFilename = req.file.filename;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Update the user's photo filename in the database
    user.photo = photoFilename;
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        user: user
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const user = await userModel.findOne({
      email: req.body.email,
      password: req.body.password
    });

    if (user === null) {
      res.status(200).json({
        status: 'Error',
        message: "Login Denied. Maybe Mail or Password Incorrect."
      });
    } else {
      res.status(200).json({
        status: 'Success',
        message: "Login Successful",
        data: user
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.markAttendance = async (req, res, next) => {
  try {
    let finduser = await attendanceModel.find({ user_id: req.body.user_id }); // Updated: changed req.body.userid to req.body.user_id
    let attendanceRecord = finduser.find((record) => record.date === formattedDate);
    if (attendanceRecord) {
      res.status(200).json({
        status: "Unsuccessful",
        message: "You have already marked attendance",
      });
    } else {
      let create = await attendanceModel.create({
        user_id: req.body.user_id, // Updated: changed req.body.userid to req.body.user_id
        date: formattedDate,
        status: req.body.status,
      });
      res.status(200).json({
        status: "Successful",
        create,
      });
    }
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};
