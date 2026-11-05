const mongoose = require("mongoose");
const crypto = require("crypto");

const makeReference = () => "URB" + crypto.randomBytes(4).toString("hex").toUpperCase().slice(0, 7);

const bookingSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, default: makeReference },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },

    // Prices are calculated on the server and stored, so later price changes
    // don't change what the guest agreed to pay.
    nights: { type: Number, required: true },
    pricePerNight: { type: Number, required: true },
    cleaningFee: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    total: { type: Number, required: true },

    guestInfo: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      specialRequests: { type: String, trim: true, maxlength: 1000 },
    },

    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed", index: true },
    cancelledAt: Date,
  },
  { timestamps: true }
);

bookingSchema.methods.toPublicJSON = function () {
  const p = this.property;
  const g = this.guest;
  const now = new Date();
  let displayStatus = this.status;
  if (this.status === "confirmed") displayStatus = this.checkOut < now ? "completed" : "upcoming";

  return {
    id: this._id.toString(),
    reference: this.reference,
    property:
      p && p.name
        ? { id: p.listingId, name: p.name, location: p.location, image: p.images?.[0] || null }
        : null,
    guest: g && g.name ? { id: g._id.toString(), name: g.name, email: g.email } : undefined,
    checkIn: this.checkIn,
    checkOut: this.checkOut,
    guests: this.guests,
    nights: this.nights,
    pricePerNight: this.pricePerNight,
    cleaningFee: this.cleaningFee,
    serviceFee: this.serviceFee,
    total: this.total,
    guestInfo: this.guestInfo,
    status: this.status,
    displayStatus, // "upcoming" | "completed" | "cancelled"
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Booking", bookingSchema);
