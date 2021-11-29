module.exports = (res,STATUS,data) => {
    STATUS.data = data;
    res.status(STATUS.httpCode).send(STATUS);
}