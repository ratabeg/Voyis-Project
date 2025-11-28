
//Error-handling middleware 
const fileTypeError = ((err, req, res, next) => {
  if (err.message && err.message.includes("Invalid file type")) {
    // Send JSON response with 400 status
    console.error("Error:", err.message);
    return res.status(400).json({
      success: false,
      error: `⛔️ ` + err.message,
    });
  }
});


export default fileTypeError;