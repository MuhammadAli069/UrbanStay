import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  MapPin,
  Wifi,
  Coffee,
  Car,
  Dumbbell,
  Users,
  Bed,
  Bath,
  Home,
  Shield,
  Clock,
  Calendar,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  UserPlus,
  X,
  Mail,
  LogIn,
} from "lucide-react";
import { propertyImages } from "../data/propertyImages";
import { useSavedProperties } from "../context/SavedPropertiesContext";
import { allProperties } from "../data/propertiesData";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { FAQ } from "../pages/FAQ";
import type { FAQItem } from "../pages/FAQ";

type Contributor = {
  name: string;
  email: string;
};

const propertyFAQs: FAQItem[] = [
  {
    question: "What is the cancellation policy?",
    answer: "Free cancellation for 48 hours after booking. After that, cancel before check-in for a 50% refund. No refund for cancellations within 7 days of check-in."
  },
  {
    question: "When can I check in and check out?",
    answer: "Standard check-in time is 3:00 PM and check-out is 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability."
  },
  {
    question: "Is the property professionally cleaned?",
    answer: "Yes, all properties are professionally cleaned and sanitized between each guest stay. We follow enhanced cleaning protocols to ensure your safety and comfort."
  },
  {
    question: "What's included in the cleaning fee?",
    answer: "The cleaning fee covers professional deep cleaning of the entire property, fresh linens, towels, and restocking of essential amenities before your arrival."
  },
  {
    question: "Can I bring pets?",
    answer: "Pet policies vary by property. Please check the property details or contact the host directly to inquire about bringing pets."
  },
  {
    question: "How do I access the property?",
    answer: "You'll receive detailed check-in instructions including access codes or key pickup information 24 hours before your check-in date via email and in your booking confirmation."
  },
  {
    question: "What if I need to modify my booking dates?",
    answer: "You can request to modify your booking dates from your profile. The host will review and respond within 24 hours. Price may change based on new dates."
  },
  {
    question: "Is parking available?",
    answer: "Parking availability varies by property. Check the amenities section for parking details. Some properties offer free parking while others may have street parking only."
  }
];

export function PropertyDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { toggleSaveProperty, isPropertySaved } = useSavedProperties();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
  });
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showContributorForm, setShowContributorForm] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [newContributor, setNewContributor] = useState({ name: "", email: "" });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRemoveContributorDialog, setShowRemoveContributorDialog] = useState(false);
  const [contributorToRemove, setContributorToRemove] = useState<number | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const propertyId = parseInt(id || "1");
  const isSaved = isPropertySaved(propertyId);

  const property = {
    id: parseInt(id || "1"),
    name: "Modern Downtown Loft",
    location: "Manhattan, New York",
    fullAddress: "123 West 57th Street, New York, NY 10019",
    price: 185,
    rating: 4.9,
    reviews: 127,
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    size: "1,200 sq ft",
    images: propertyImages.gallery,
    description:
      "Experience luxury living in the heart of Manhattan. This stunning loft features floor-to-ceiling windows with breathtaking city views, modern furnishings, and all the amenities you need for a comfortable stay. Located within walking distance of Central Park, world-class dining, and shopping.",
    amenities: [
      { icon: Wifi, label: "High-Speed WiFi", description: "100 Mbps fiber connection" },
      { icon: Coffee, label: "Full Kitchen", description: "Fully equipped with appliances" },
      { icon: Car, label: "Free Parking", description: "Secure underground parking" },
      { icon: Dumbbell, label: "Fitness Center", description: "24/7 access to gym" },
    ],
    host: {
      name: "Sarah Johnson",
      avatar: "👩‍💼",
      joinedDate: "Member since 2020",
      responseRate: "100%",
      responseTime: "within an hour",
    },
    houseRules: [
      "Check-in: 3:00 PM - 10:00 PM",
      "Checkout: 11:00 AM",
      "No smoking",
      "No pets",
      "No parties or events",
    ],
    cancellationPolicy:
      "Free cancellation for 48 hours. Cancel before 2:00 PM on Apr 28 for a partial refund.",
  };

  const calculateTotal = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = nights * property.price;
    const serviceFee = Math.round(subtotal * 0.12);
    const cleaningFee = 50;
    return { nights, subtotal, serviceFee, cleaningFee, total: subtotal + serviceFee + cleaningFee };
  };

  const handleAddContributor = () => {
    if (newContributor.name && newContributor.email) {
      setContributors([...contributors, newContributor]);
      setNewContributor({ name: "", email: "" });
      setShowContributorForm(false);
    }
  };

  const handleRemoveContributor = (index: number) => {
    setContributorToRemove(index);
    setShowRemoveContributorDialog(true);
  };

  const confirmRemoveContributor = () => {
    if (contributorToRemove !== null) {
      setContributors(contributors.filter((_, i) => i !== contributorToRemove));
      setShowRemoveContributorDialog(false);
      setContributorToRemove(null);
      toast.success("Contributor removed successfully");
    }
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication first
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    setShowBookingDialog(true);
  };

  const confirmBooking = () => {
    setShowBookingDialog(false);
    // Navigate to the new booking flow instead of old confirmation
    navigate(`/booking/${property.id}`);
  };

  const finalizeBooking = () => {
    // This is no longer used - keeping for backward compatibility
    const bookingId = Math.random().toString(36).substring(7).toUpperCase();
    navigate(`/confirmation/${bookingId}`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Image Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-96 md:h-[500px] overflow-hidden bg-gray-900">
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => {
                toggleSaveProperty(propertyId);
                if (isSaved) {
                  toast.success("Property removed from saved list");
                } else {
                  toast.success("Property saved to your list");
                }
              }}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${
                isSaved
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <Heart className={`w-6 h-6 ${
                isSaved
                  ? "text-white fill-white"
                  : "text-gray-600"
              }`} />
            </button>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white w-8" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.name}
                  </h1>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-5 h-5 mr-1" />
                    {property.location}
                  </p>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-50 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900">{property.rating}</span>
                  <span className="text-gray-600">({property.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{property.guests} guests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bed className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{property.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{property.bathrooms} bathrooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{property.size}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <amenity.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{amenity.label}</p>
                      <p className="text-sm text-gray-600">{amenity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hosted by {property.host.name}</h2>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                  {property.host.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 mb-4">{property.host.joinedDate}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Response rate</p>
                      <p className="font-semibold text-gray-900">{property.host.responseRate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Response time</p>
                      <p className="font-semibold text-gray-900">{property.host.responseTime}</p>
                    </div>
                  </div>
                  <button className="mt-4 w-full md:w-auto px-6 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors font-semibold">
                    Contact Host
                  </button>
                </div>
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">House Rules</h2>
              <ul className="space-y-3">
                {property.houseRules.map((rule, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                  <p className="text-gray-700">{property.cancellationPolicy}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">${property.price}</span>
                  <span className="text-gray-600">/ night</span>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{property.rating}</span>
                  <span className="text-gray-600">({property.reviews} reviews)</span>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>
                </div>

                {/* Contributors Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-900">
                      Contributors (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowContributorForm(!showContributorForm)}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {contributors.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {contributors.map((contributor, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                            <p className="text-xs text-gray-600">{contributor.email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveContributor(idx)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showContributorForm && (
                    <div className="space-y-2 mb-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        placeholder="Contributor name"
                        value={newContributor.name}
                        onChange={(e) => setNewContributor({ ...newContributor, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Contributor email"
                        value={newContributor.email}
                        onChange={(e) => setNewContributor({ ...newContributor, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleAddContributor}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowContributorForm(false)}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {totals.nights > 0 && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>${property.price} × {totals.nights} nights</span>
                      <span>${totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Service fee</span>
                      <span>${totals.serviceFee}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Cleaning fee</span>
                      <span>${totals.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t">
                      <span>Total</span>
                      <span>${totals.total}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Reserve
                </button>

                <p className="text-center text-sm text-gray-600">
                  You won't be charged yet
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Review Dialog */}
      {showBookingDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Booking</h2>
              <p className="text-gray-600">Please review your booking details before confirming</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Property</p>
                <p className="font-semibold text-gray-900">{property.name}</p>
                <p className="text-sm text-gray-600">{property.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-semibold text-gray-900">{bookingData.checkIn}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-semibold text-gray-900">{bookingData.checkOut}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-semibold text-gray-900">{bookingData.guests} {parseInt(bookingData.guests) === 1 ? 'Guest' : 'Guests'}</p>
              </div>

              {contributors.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Contributors ({contributors.length})</p>
                  <div className="space-y-2">
                    {contributors.map((contributor, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{contributor.name}</span>
                        <span className="text-gray-600">({contributor.email})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${totals.total}</p>
                <p className="text-xs text-gray-600 mt-1">Includes taxes and fees</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingDialog(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Go Back
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <FAQ
        items={propertyFAQs}
        title="Property Booking FAQs"
      />

      {/* Final Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Booking</h2>
              <p className="text-gray-600">Are you sure you want to complete this booking?</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> You will be charged ${totals.total} upon confirmation. Please review the cancellation policy before proceeding.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={finalizeBooking}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Contributor Confirmation Dialog */}
      {showRemoveContributorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Remove Contributor?</h2>
              <p className="text-gray-600">
                Are you sure you want to remove this contributor from the booking?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRemoveContributorDialog(false);
                  setContributorToRemove(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveContributor}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Dialog */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600">
                Please sign in to your account to book this property
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Why sign in?</strong> Creating an account helps us protect your booking and provide better customer service.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}