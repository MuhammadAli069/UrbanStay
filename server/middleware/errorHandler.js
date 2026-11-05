const notFound = (req, res) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Upload is too large. Try fewer or smaller photos." });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  console.error(err);
  res.status(err.status || 500).json({ message: "Something went wrong on the server" });
};

module.exports = { notFound, errorHandler };
