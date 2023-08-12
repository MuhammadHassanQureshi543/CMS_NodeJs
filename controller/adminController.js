const attendanceModel = require('../Model/attendanceModel')
const user = require('../Model/userModel')
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const userModel = require('../Model/userModel')

const formattedDate = `${year}-${month}-${day}`;


exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (email === 'admin@gmail.com' && password === 'admin') {
      res.status(200).json({
        status: 'Success',
        user: {
          email,
          password
        }
      });
    } else {
      res.status(400).json({
        status: 'Unsuccessful',
        message: 'Error in username or password'
      });
    }
  };
  

  exports.getAttendance = async (req, res, next) => {
    try {
      const attendance = await attendanceModel.find().lean();
  
      const userIds = attendance.map((entry) => entry.user_id);
      const users = await userModel.find({ _id: { $in: userIds } }).lean();
  
      const attendanceWithNames = attendance.map((entry) => {
        const user = users.find((user) => user._id.toString() === entry.user_id.toString());
        const name = user ? user.name : 'Unknown';
  
        return { name, date: entry.date, status: entry.status };
      });
  
      res.status(200).json({
        status: 'Success',
        attendance: attendanceWithNames,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: 'Unsuccessful',
        message: 'Failed to fetch attendance',
      });
    }
  };
  

  exports.changeAttendance = async (req, res) => {
    try {
      const { id, newStatus } = req.body;
  
      // Find the attendance record using the provided _id
      const attendanceRecord = await attendanceModel.findById(id);
  
      if (!attendanceRecord) {
        return res.status(404).json({ error: 'Attendance record not found' });
      }
  
      // Update the attendance status
      attendanceRecord.status = newStatus;
  
      // Save the updated attendance record
      const updatedAttendance = await attendanceRecord.save();
  
      res.json(updatedAttendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


exports.generateAttendanceReport = async (req, res, next) => {
  try {
    const { name, fromDate, toDate, status } = req.body;

    // Fetch the user ID based on the provided name
    const user = await userModel.findOne({ name });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = user._id;

    const attendanceRecords = await attendanceModel.find({
      user_id: userId,
      date: { $gte: fromDate, $lte: toDate },
      status: status
    });

    res.status(200).json({
      status: 'Successful',
      name: user.name, // Include the user's name in the response
      attendanceRecords
    });
  } catch (error) {
    console.error('Error:', error);
    next(error); // Pass the error to the error handler middleware
  }
};

  


exports.gradeSystem = async (req, res, next) => {
  try {
    const { name } = req.query; // Retrieve the name from the query parameter


    // Find the user by name in the userModel
    const user = await userModel.findOne({ name });
    
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }

    const userId = user._id;

    // Retrieve the attendance records for the specified user
    const attendanceRecords = await attendanceModel.find({
      user_id: userId,
    });

    // Filter the attendance records to include only "Present" status
    const presentRecords = attendanceRecords.filter((record) =>
      record.status.includes('Present')
    );

    // Get the count of "Present" records
    const presentCount = presentRecords.length;

    // Implement the grading system logic
    let grade = '';
    if (presentCount >= 26) {
      grade = 'A';
    } else if (presentCount >= 10) {
      grade = 'D';
    } else {
      // Define additional grading system conditions if needed
      grade = 'N/A';
    }

    res.status(200).json({
      status: 'Success',
      grade,
    });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

  
  