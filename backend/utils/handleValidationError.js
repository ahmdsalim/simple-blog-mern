const handleValidationError = (err, res) => {
    return res.status(400).json({
        success: false,
        message: err.details.map((e) => e.message).join(", ")
    })
}
export default handleValidationError