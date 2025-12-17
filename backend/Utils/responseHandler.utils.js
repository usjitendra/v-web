
module.exports.successResponse = (res, status = 200, message, data, error) => {
    res.status(status).send({
      success: true,
      message,
      data
    });
};
  
module.exports.errorResponse = (res, status , message, data, error) => {
   // logger.error(typeof error === "Array" ? JSON.stringify(error) : message);
    res.status(status).send({
        success: false,
        message,
        data,
        error,
    });
};