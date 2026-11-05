const Booking = require("../models/Booking");
const Property = require("../models/Property");

const DAY = 24 * 60 * 60 * 1000;
const SERVICE_FEE_RATE = 0.12;
const MAX_NIGHTS = 60;

// Accepts "YYYY-MM-DD" and returns a Date at UTC midnight, or null.
const parseDay = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
};

const populateForGuest = (query) => query.populate("property", "listingId name location images");
const populateForHost = (query) =>
  query.populate("property", "listingId name location images").populate("guest", "name email");

// POST /api/bookings
exports.create = async (req, res, next) => {
  try {
    const { propertyId, checkIn, checkOut, guests, guestInfo = {} } = req.body;

    const property = await Property.findOne({ listingId: Number(propertyId), status: "active" });
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.host.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't book your own property" });
    }

    const start = parseDay(checkIn);
    const end = parseDay(checkOut);
    if (!start || !end) return res.status(400).json({ message: "Please choose valid dates" });

    const todayUtc = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
    if (start < new Date(todayUtc.getTime() - DAY)) {
      return res.status(400).json({ message: "Check-in can't be in the past" });
    }

    const nights = Math.round((end - start) / DAY);
    if (nights < 1) return res.status(400).json({ message: "Check-out must be after check-in" });
    if (nights > MAX_NIGHTS) return res.status(400).json({ message: `Stays are limited to ${MAX_NIGHTS} nights` });

    const guestCount = Number(guests) || 1;
    if (guestCount < 1 || guestCount > property.guests) {
      return res.status(400).json({ message: `This property allows up to ${property.guests} guests` });
    }

    // Two stays overlap when one starts before the other ends.
    const clash = await Booking.exists({
      property: property._id,
      status: "confirmed",
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    });
    if (clash) {
      return res.status(409).json({ message: "Those dates are already booked. Please choose different dates." });
    }

    const subtotal = nights * property.price;
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);

    const booking = await Booking.create({
      property: property._id,
      guest: req.user._id,
      checkIn: start,
      checkOut: end,
      guests: guestCount,
      nights,
      pricePerNight: property.price,
      cleaningFee: property.cleaningFee,
      serviceFee,
      total: subtotal + serviceFee + property.cleaningFee,
      guestInfo: {
        firstName: guestInfo.firstName,
        lastName: guestInfo.lastName,
        email: guestInfo.email || req.user.email,
        phone: guestInfo.phone,
        specialRequests: guestInfo.specialRequests,
      },
    });

    const populated = await populateForGuest(Booking.findById(booking._id));
    res.status(201).json({ booking: populated.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/mine  (bookings I made as a guest)
exports.mine = async (req, res, next) => {
  try {
    const bookings = await populateForGuest(Booking.find({ guest: req.user._id }).sort({ checkIn: -1 }));
    res.json({ bookings: bookings.map((b) => b.toPublicJSON()) });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/host  (bookings on my listings; admins see everything)
exports.forHost = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role !== "admin") {
      const ids = await Property.find({ host: req.user._id }).distinct("_id");
      filter.property = { $in: ids };
    }
    const bookings = await populateForHost(Booking.find(filter).sort({ checkIn: 1 }));
    res.json({ bookings: bookings.map((b) => b.toPublicJSON()) });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/:reference
exports.getOne = async (req, res, next) => {
  try {
    const booking = await populateForHost(Booking.findOne({ reference: req.params.reference.toUpperCase() }));
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isGuest = booking.guest?._id.toString() === req.user._id.toString();
    const property = booking.property ? await Property.findById(booking.property._id, "host") : null;
    const isHost = property && property.host.toString() === req.user._id.toString();
    if (!isGuest && !isHost && req.user.role !== "admin") {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ booking: booking.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/bookings/:id/cancel  (the guest, the property's host, or an admin)
exports.cancel = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).catch(() => null);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const property = await Property.findById(booking.property, "host");
    const userId = req.user._id.toString();
    const allowed =
      booking.guest.toString() === userId ||
      (property && property.host.toString() === userId) ||
      req.user.role === "admin";
    if (!allowed) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "cancelled") return res.status(400).json({ message: "This booking is already cancelled" });
    if (booking.checkIn <= new Date()) {
      return res.status(400).json({ message: "Stays that have already started can't be cancelled" });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    const populated = await populateForHost(Booking.findById(booking._id));
    res.json({ booking: populated.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};
