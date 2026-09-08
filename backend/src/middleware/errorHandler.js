export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  res.status(500).json({
    message: "Internal server error.",
    ...(process.env.NODE_ENV !== "production" ? { detail: error.message } : {})
  });
}