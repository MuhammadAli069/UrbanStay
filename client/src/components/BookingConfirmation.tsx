import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Download,
  Mail,
  Phone,
  Home,
  Clock,
  CreditCard,
} from "lucide-react";
import { propertyImages } from "../data/propertyImages";

export function BookingConfirmation() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const booking = {
    id: bookingId,
    property: {
      name: "Modern Downtown Loft",
      location: "Manhattan, New York",
      address: "123 West 57th Street, New York, NY 10019",
      image: propertyImages.modernLoft,
    },
    checkIn: "May 15, 2026",
    checkOut: "May 20, 2026",
    guests: 2,
    nights: 5,
    price: 185,
    subtotal: 925,
    serviceFee: 111,
    cleaningFee: 50,
    total: 1086,
    bookingDate: "April 30, 2026",
    confirmationNumber: bookingId?.toUpperCase(),
  };

  const handleDownloadConfirmation = () => {
    alert("Downloading confirmation PDF...");
  };

  const handleEmailConfirmation = () => {
    alert("Confirmation email sent!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Your reservation has been successfully confirmed
          </p>
          <div className="inline-block bg-blue-50 px-6 py-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Confirmation Number</p>
            <p className="text-2xl font-bold text-blue-600">{booking.confirmationNumber}</p>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-48 overflow-hidden">
            <img
              src={booking.property.image}
              alt={booking.property.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {booking.property.name}
            </h2>
            <p className="text-gray-600 flex items-center mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              {booking.property.location}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Full Address</p>
              <p className="text-gray-900 font-medium">{booking.property.address}</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-semibold text-gray-900">{booking.checkIn}</p>
                <p className="text-sm text-gray-500">After 3:00 PM</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="font-semibold text-gray-900">{booking.checkOut}</p>
                <p className="text-sm text-gray-500">Before 11:00 AM</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-semibold text-gray-900">{booking.guests} guests</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">{booking.nights} nights</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>${booking.price} × {booking.nights} nights</span>
                <span>${booking.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Service fee</span>
                <span>${booking.serviceFee}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Cleaning fee</span>
                <span>${booking.cleaningFee}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t">
                <span>Total Paid</span>
                <span>${booking.total}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <CreditCard className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Payment Confirmed</p>
              <p className="text-sm text-gray-600">
                Charged on {booking.bookingDate} • Visa ending in 4242
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">Check your email</p>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email with all the details to your inbox
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">Prepare for check-in</p>
                <p className="text-sm text-gray-600">
                  You'll receive check-in instructions 24 hours before arrival
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">Contact your host</p>
                <p className="text-sm text-gray-600">
                  Feel free to message your host if you have any questions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadConfirmation}
              className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors font-semibold"
            >
              <Download className="w-5 h-5" />
              <span>Download Confirmation</span>
            </button>
            <button
              onClick={handleEmailConfirmation}
              className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors font-semibold"
            >
              <Mail className="w-5 h-5" />
              <span>Email Confirmation</span>
            </button>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="space-y-3">
            <a
              href="tel:1-800-URBANSTAY"
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>1-800-URBANSTAY</span>
            </a>
            <a
              href="mailto:support@urbanstay.com"
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>support@urbanstay.com</span>
            </a>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors font-semibold"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
