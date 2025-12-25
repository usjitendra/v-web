const AppointmentModel = require("../model/appointment.model");
const { tryCatchFn } = require("../Utils/tryCatch.utils");
const responseHandler = require("../Utils/responseHandler.utils");
const appointmentModel = require("../model/appointment.model");
const { time } = require("console");

class appointmentController {

  // Add Appointment
  addAppointment = tryCatchFn(async (req, res) => {

    const {
      doctorId,
      patientId,
      appointmentDate,
      timeSlot,
      appointmentType,
      reason,
      consultationFee
    } = req.body;

    //  Basic validation
    if (!doctorId || !patientId || !appointmentDate || !timeSlot?.startTime || !timeSlot?.endTime) {
      return responseHandler.error(res, "Required fields are missing", 400);
    }

    //  Date validation
    const apptDate = new Date(appointmentDate);
    if (isNaN(apptDate.getTime())) {
      return responseHandler.error(res, "Invalid appointment date", 400);
    }

    //  Time validation
    if (timeSlot.startTime >= timeSlot.endTime) {
      return responseHandler.error(res, "Start time must be less than end time", 400);
    }

    try {
      const appointment = await AppointmentModel.create({
        doctorId,
        patientId,
        appointmentDate: apptDate,
        timeSlot: {
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime
        },
        appointmentType,
        reason,
        consultationFee
      });

      return responseHandler.success(
        res,
        "Appointment created successfully",
        appointment,
        201
      );

    } catch (error) {

      //  Duplicate appointment (unique index error)
      if (error.code === 11000) {
        return responseHandler.error(
          res,
          "This time slot is already booked for the doctor",
          409
        );
      }

      //  Mongoose validation error
      if (error.name === "ValidationError") {
        return responseHandler.error(
          res,
          error.message,
          400
        );
      }
      throw error;
    }
  });

  //appointment Update

  appointmentUpdate = tryCatchFn(async (req, res) => {
    const { id } = req.params

    const {
      doctorId,
      patientId,
      appointmentDate,
      timeSlot,
      appointmentType,
      reason,
      consultationFee
    } = req.body

    const appointment = await AppointmentModel.findById(id)

    if (!appointment || appointment.is_deleted) {
      return responseHandler.errorResponse(
        res,
        404,
        "Appointment not found"
      )
    }

    if (doctorId) appointment.doctorId = doctorId
    if (patientId) appointment.patientId = patientId
    if (appointmentDate) {
      appointment.appointmentDate = new Date(appointmentDate)
    }

    if (timeSlot?.startTime) {
      appointment.timeSlot.startTime = timeSlot.startTime
    }
    if (timeSlot?.endTime) {
      appointment.timeSlot.endTime = timeSlot.endTime
    }

    if (appointmentType) appointment.appointmentType = appointmentType
    if (reason) appointment.reason = reason
    if (consultationFee !== undefined) {
      appointment.consultationFee = consultationFee
    }

    await appointment.save()

    return responseHandler.successResponse(
      res,
      200,
      "Appointment updated successfully"
    )
  })

  //get Appontment 
  getAppointment = tryCatchFn(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit)
    const skip = (pageNumber - 1) * pageSize


    const pipeline = [
      { $match: { is_deleted: false, is_active: true } },

      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "_id",
          as: "patientDetail",
        }
      },
      { $unwind: "$patientDetail" },

      search && search.trim() !== "" ? {
        $match: {
          $or: [
            { "patientDetail.firstName": { $regex: search, $options: "i" } },
            { "patientDetail.lastName": { $regex: search, $options: "i" } },
          ]
        }
      } : null,


      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorDetail"
        }
      },
      { $unwind: "$doctorDetail" },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize }
    ]

    const [data, total] = await Promise.all([
      appointmentModel.aggregate(pipeline),
      appointmentModel.countDocuments({ is_deleted: false, is_active: true })
    ])

    return responseHandler.successResponse(
      res,
      200,
      "Data fetched successfully", {
      data: data,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total
      }
    }
    )

  })

  // delete appointment 
  deleteAppointment = tryCatchFn(async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return responseHandler.errorResponse(
        res,
        400,
        "Appointment id is required"
      )
    }

    const appointment = await AppointmentModel.findById(id);

    if (!appointment || appointment.is_deleted) {
      return responseHandler.errorResponse(
        res,
        404,
        "Appointment not found"
      )
    }
    appointment.is_deleted = true
    appointment.is_active = false
    await appointment.save()

    return responseHandler.successResponse(
      res,
      200,
      "Appointment deleted successfully"
    )
  })

}

module.exports = appointmentController;
