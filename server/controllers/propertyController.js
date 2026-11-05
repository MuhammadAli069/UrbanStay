const Property = require("../models/Property");
const Booking = require("../models/Booking");
const User = require("../models/User");
const { PROPERTY_TYPES } = require("../models/Property");

const EDITABLE_FIELDS = [
  "name", "description", "type", "address", "location", "city", "state", "country",
  "price", "cleaningFee", "bedrooms", "bathrooms", "guests", "amenities", "houseRules", "images", "status",
];

const MAX_IMAGES = 8;

const pick = (body) => {
  const out = {};
  for (const key of EDITABLE_FIELDS) if (body[key] !== undefined) out[key] = body[key];
  if (out.images) out.images = [].concat(out.images).filter((s) => typeof s === "string").slice(0, MAX_IMAGES);
  if (out.type && !PROPERTY_TYPES.includes(out.type)) delete out.type;
  return out;
};

const findByListingId = (id) => {
  const listingId = Number(id);
  if (!Number.isInteger(listingId)) return null;
  return Property.findOne({ listingId }).populate("host", "name");
};

const canManage = (user, property) =>
  user.role === "admin" || (property.host != null && property.host._id.toString() === user._id.toString());

// GET /api/properties?city=&type=&minPrice=&maxPrice=&guests=&q=
exports.list = async (req, res, next) => {
  try {
    const { city, type, minPrice, maxPrice, guests, q } = req.query;
    const filter = { status: "active" };
    if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, "i");
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (guests) filter.guests = { $gte: Number(guests) };
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: rx }, { location: rx }, { city: rx }];
    }

    const properties = await Property.find(filter).sort({ listingId: 1 }).limit(500).populate("host", "name");
    res.json({ properties: properties.map((p) => p.toPublicJSON()) });
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/mine  (host's own listings, incl. inactive, with booking stats)
exports.mine = async (req, res, next) => {
  try {
    const properties = await Property.find({ host: req.user._id }).sort({ createdAt: -1 }).populate("host", "name");
    const ids = properties.map((p) => p._id);

    const stats = await Booking.aggregate([
      { $match: { property: { $in: ids }, status: "confirmed" } },
      {
        $group: {
          _id: "$property",
          bookings: { $sum: 1 },
          revenue: { $sum: "$total" },
          nextCheckIn: { $min: { $cond: [{ $gte: ["$checkIn", new Date()] }, "$checkIn", null] } },
        },
      },
    ]);
    const byId = new Map(stats.map((s) => [s._id.toString(), s]));

    res.json({
      properties: properties.map((p) => {
        const s = byId.get(p._id.toString());
        return {
          ...p.toPublicJSON(),
          bookings: s?.bookings || 0,
          revenue: s?.revenue || 0,
          nextCheckIn: s?.nextCheckIn || null,
        };
      }),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/:id
exports.getOne = async (req, res, next) => {
  try {
    const property = await findByListingId(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ property: property.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

// POST /api/properties  (any signed-in user; guests become hosts on their first listing)
exports.create = async (req, res, next) => {
  try {
    const data = pick(req.body);
    if (!data.location) data.location = [data.city, data.state].filter(Boolean).join(", ");

    const property = await Property.create({ ...data, host: req.user._id, status: "active" });

    if (req.user.role === "guest") {
      await User.updateOne({ _id: req.user._id }, { role: "host" });
      req.user.role = "host";
    }

    await property.populate("host", "name");
    res.status(201).json({ property: property.toPublicJSON(), user: req.user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

// PUT /api/properties/:id
exports.update = async (req, res, next) => {
  try {
    const property = await findByListingId(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    if (!canManage(req.user, property)) return res.status(403).json({ message: "This isn't your listing" });

    Object.assign(property, pick(req.body));
    await property.save();
    res.json({ property: property.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/properties/:id
exports.remove = async (req, res, next) => {
  try {
    const property = await findByListingId(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    if (!canManage(req.user, property)) return res.status(403).json({ message: "This isn't your listing" });

    const upcoming = await Booking.countDocuments({
      property: property._id,
      status: "confirmed",
      checkOut: { $gte: new Date() },
    });
    if (upcoming > 0) {
      return res.status(409).json({
        message: `This property has ${upcoming} upcoming booking(s). Cancel them before deleting it.`,
      });
    }

    await property.deleteOne();
    res.json({ message: "Property deleted" });
  } catch (err) {
    next(err);
  }
};

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
