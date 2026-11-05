const mongoose = require("mongoose");

const PROPERTY_TYPES = ["apartment", "house", "studio", "villa", "condo", "cabin"];
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80";

const propertySchema = new mongoose.Schema(
  {
    // Short numeric id used in URLs (/property/12) so links stay readable.
    listingId: { type: Number, unique: true, index: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    name: { type: String, required: [true, "Title is required"], trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 5000, default: "" },
    type: { type: String, enum: PROPERTY_TYPES, default: "apartment" },

    address: { type: String, trim: true, default: "" },
    location: { type: String, required: true, trim: true }, // e.g. "Manhattan, New York"
    city: { type: String, required: [true, "City is required"], trim: true, index: true },
    state: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },

    price: { type: Number, required: [true, "Price is required"], min: [1, "Price must be at least $1"] },
    cleaningFee: { type: Number, min: 0, default: 50 },
    bedrooms: { type: Number, min: 0, default: 1 },
    bathrooms: { type: Number, min: 0, default: 1 },
    guests: { type: Number, min: 1, default: 2 },

    amenities: { type: [String], default: [] },
    houseRules: { type: [String], default: [] },
    // URLs or compressed data URLs uploaded from the listing form.
    images: { type: [String], default: [] },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
  },
  { timestamps: true }
);

propertySchema.pre("save", async function () {
  if (this.listingId) return;
  const last = await this.constructor.findOne({}, { listingId: 1 }).sort({ listingId: -1 }).lean();
  this.listingId = (last?.listingId || 0) + 1;
});

propertySchema.methods.toPublicJSON = function () {
  const host = this.host && this.host.name ? { id: this.host._id.toString(), name: this.host.name } : undefined;
  return {
    id: this.listingId,
    name: this.name,
    description: this.description,
    type: this.type,
    address: this.address,
    location: this.location,
    city: this.city,
    state: this.state,
    country: this.country,
    price: this.price,
    cleaningFee: this.cleaningFee,
    bedrooms: this.bedrooms,
    bathrooms: this.bathrooms,
    guests: this.guests,
    amenities: this.amenities,
    houseRules: this.houseRules,
    image: this.images[0] || DEFAULT_IMAGE,
    images: this.images.length ? this.images : [DEFAULT_IMAGE],
    rating: this.rating,
    reviews: this.reviews,
    status: this.status,
    host,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Property", propertySchema);
module.exports.PROPERTY_TYPES = PROPERTY_TYPES;
