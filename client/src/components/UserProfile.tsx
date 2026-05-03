import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  Star,
  Home,
  Heart,
  Settings,
  AlertCircle,
  Check,
  MessageCircle,
  Download,
  Clock,
  FileText,
  X,
} from "lucide-react";
import { allProperties } from "../data/propertiesData";
import { useAuth } from "../context/AuthContext";
import { useSavedProperties } from "../context/SavedPropertiesContext";
import { toast } from "sonner";
import { FAQ } from "../pages/FAQ";
import type { FAQItem } from "../pages/FAQ";

const userProfileFAQs: FAQItem[] = [
  {
    question: "How do I update my profile information?",
    answer: "Click the 'Edit Profile' button in your profile section. You can update your name, email, phone, location, and other details. Changes are saved automatically."
  },
  {
    question: "How can I view my booking history?",
    answer: "Navigate to 'My Bookings' tab in your profile. You'll see all upcoming, completed, and cancelled bookings with full details and receipts."
  },
  {
    question: "Can I modify my booking dates?",
    answer: "Yes! Open your booking from 'My Bookings' and click 'Manage Booking', then select 'Modify Dates'. Subject to availability and host approval."
  },
  {
    question: "How do I contact my host?",
    answer: "Click 'Manage Booking' on any active booking and select 'Contact Host'. You can send messages directly through our platform."
  },
  {
    question: "What is the cancellation policy?",
    answer: "Cancellation policies vary by property. You can view the specific policy in your booking details. Most properties offer free cancellation 24-48 hours before check-in."
  },
  {
    question: "How do I download my booking receipt?",
    answer: "For completed bookings, click the 'Download Receipt' button in the booking details. The receipt will be downloaded as a PDF."
  },
  {
    question: "Can I make special requests for my stay?",
    answer: "Yes! Click 'Manage Booking' and select 'Special Requests'. You can request early check-in, late checkout, extra amenities, and more."
  },
  {
    question: "How do I delete my account?",
    answer: "Contact our support team through 'Help & Support' to request account deletion. Make sure you have no active bookings before requesting deletion."
  }
];

export function UserProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { savedProperties: savedPropertyIds } = useSavedProperties();
  const [activeTab, setActiveTab] = useState<"bookings" | "reviews" | "saved" | "settings">("bookings");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showModifyDatesDialog, setShowModifyDatesDialog] = useState(false);
  const [showContactHostDialog, setShowContactHostDialog] = useState(false);
  const [showSpecialRequestDialog, setShowSpecialRequestDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Smith",
    email: user?.email || "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2024",
    avatar: user?.avatar || "👤",
    bio: "Travel enthusiast who loves exploring new cities and experiencing different cultures. Always respectful of properties and excited to meet new people!",
  });

  // Get saved properties from IDs
  const savedProperties = allProperties.filter(p => savedPropertyIds.includes(p.id)).slice(0, 2);

  const bookings = [
    {
      id: "ABC123",
      property: "Modern Downtown Loft",
      location: "Manhattan, New York",
      checkIn: "May 15, 2026",
      checkOut: "May 20, 2026",
      status: "upcoming",
      image: allProperties[0].image,
      total: 1086,
    },
    {
      id: "XYZ789",
      property: "Beachfront Villa",
      location: "Santa Monica, LA",
      checkIn: "March 10, 2026",
      checkOut: "March 15, 2026",
      status: "completed",
      image: allProperties[3].image,
      total: 1850,
    },
  ];

  const reviews = [
    {
      id: 1,
      property: "Modern Downtown Loft",
      host: "Sarah Johnson",
      rating: 5,
      date: "March 2026",
      comment: "John was an excellent guest! Very respectful of the property, great communication, and left everything clean. Would definitely host again!",
      categories: {
        cleanliness: 5,
        communication: 5,
        respect: 5,
      },
    },
    {
      id: 2,
      property: "Beachfront Villa",
      host: "Michael Chen",
      rating: 5,
      date: "February 2026",
      comment: "Wonderful guest! Very friendly and took great care of the property. Highly recommended!",
      categories: {
        cleanliness: 5,
        communication: 5,
        respect: 4.9,
      },
    },
    {
      id: 3,
      property: "Urban Studio",
      host: "Emma Williams",
      rating: 4.8,
      date: "January 2026",
      comment: "Great guest, very clean and respectful. Communication was excellent throughout the stay.",
      categories: {
        cleanliness: 5,
        communication: 4.8,
        respect: 4.7,
      },
    },
  ];

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowCancelDialog(true);
  };

  const confirmCancelBooking = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowCancelDialog(false);
      setBookingToCancel(null);
      toast.success("Booking cancelled successfully", {
        description: "Your refund will be processed within 5-7 business days"
      });
    }, 1500);
  };

  const handleManageBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowManageDialog(true);
  };

  const handleModifyDates = () => {
    setShowManageDialog(false);
    setShowModifyDatesDialog(true);
  };

  const confirmModifyDates = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowModifyDatesDialog(false);
      toast.success("Date modification request sent", {
        description: "The host will review your request and respond within 24 hours"
      });
    }, 1500);
  };

  const handleContactHost = () => {
    setShowManageDialog(false);
    setShowContactHostDialog(true);
  };

  const sendMessageToHost = (message: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowContactHostDialog(false);
      toast.success("Message sent to host", {
        description: "You'll receive a response via email"
      });
    }, 1000);
  };

  const handleSpecialRequest = () => {
    setShowManageDialog(false);
    setShowSpecialRequestDialog(true);
  };

  const submitSpecialRequest = (request: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSpecialRequestDialog(false);
      toast.success("Special request submitted", {
        description: "The host will review and respond soon"
      });
    }, 1000);
  };

  const handleDownloadReceipt = (booking: any) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Generating receipt...',
        success: 'Receipt downloaded successfully',
        error: 'Failed to download receipt',
      }
    );
  };

  const handleSaveProfile = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowEditDialog(false);
      toast.success("Profile updated successfully", {
        description: "Your changes have been saved"
      });
    }, 1000);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
    toast.success("You have been signed out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl flex-shrink-0">
              {profileData.avatar}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                <button
                  onClick={() => setShowEditDialog(true)}
                  className="mt-2 md:mt-0 inline-flex items-center space-x-1 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
              <div className="space-y-1 text-blue-100">
                <p className="flex items-center justify-center md:justify-start space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{profileData.email}</span>
                </p>
                <p className="flex items-center justify-center md:justify-start space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{profileData.phone}</span>
                </p>
                <p className="flex items-center justify-center md:justify-start space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profileData.location}</span>
                </p>
                <p className="flex items-center justify-center md:justify-start space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {profileData.joinDate}</span>
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 min-w-[280px]">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  <span className="text-4xl font-bold text-gray-900">4.9</span>
                </div>
                <p className="text-sm font-semibold text-gray-600">Overall Guest Rating</p>
                <p className="text-xs text-gray-500 mt-1">Based on 127 reviews</p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cleanliness</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Communication</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Respect</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">4.8</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-center space-x-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-600">Verified Guest</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === "bookings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>My Bookings</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === "reviews"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Reviews</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === "saved"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Saved</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === "settings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={booking.image}
                        alt={booking.property}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {booking.property}
                          </h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {booking.location}
                          </p>
                        </div>
                        <div
                          className={`mt-2 md:mt-0 inline-block px-4 py-2 rounded-lg font-semibold ${
                            booking.status === "upcoming"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.status === "upcoming" ? "Upcoming" : "Completed"}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Confirmation</p>
                          <p className="font-semibold text-gray-900">{booking.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Check-in</p>
                          <p className="font-semibold text-gray-900">{booking.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Check-out</p>
                          <p className="font-semibold text-gray-900">{booking.checkOut}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t gap-4">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">${booking.total}</span>
                          <span className="text-gray-600"> total</span>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/property/${booking.id}`)}
                            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors font-semibold"
                          >
                            View Property
                          </button>
                          {booking.status === "upcoming" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleManageBooking(booking);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                              >
                                Manage Booking
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelBooking(booking.id);
                                }}
                                className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === "completed" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadReceipt(booking);
                              }}
                              className="px-4 py-2 border-2 border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download Receipt
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews About You</h2>
              <p className="text-gray-600">See what hosts are saying about you as a guest</p>
            </div>

            {/* Overall Rating Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                    <span className="text-4xl font-bold text-gray-900">4.9</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Overall Guest Rating</p>
                    <p className="text-sm text-gray-600">{reviews.length} reviews</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">5.0</p>
                    <p className="text-sm text-gray-600">Cleanliness</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">4.9</p>
                    <p className="text-sm text-gray-600">Communication</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                    <p className="text-sm text-gray-600">Respect</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {review.host.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.host}</p>
                        <p className="text-sm text-gray-600">{review.property}</p>
                        <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">{review.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  <div className="flex items-center space-x-6 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Cleanliness</p>
                        <p className="font-semibold text-gray-900">{review.categories.cleanliness}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Communication</p>
                        <p className="font-semibold text-gray-900">{review.categories.communication}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Respect</p>
                        <p className="font-semibold text-gray-900">{review.categories.respect}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === "saved" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
              <button
                onClick={() => navigate("/saved")}
                className="text-blue-600 hover:underline font-semibold"
              >
                View All →
              </button>
            </div>
            {savedProperties.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No saved properties yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start exploring and save your favorite properties
                </p>
                <button
                  onClick={() => navigate("/listings")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {property.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-gray-900">${property.price}</span>
                        <span className="text-gray-600"> / night</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900">{property.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <button className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-6 h-6 text-gray-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Notifications</p>
                      <p className="text-sm text-gray-600">Manage your notification preferences</p>
                    </div>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <button className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Payment Methods</p>
                      <p className="text-sm text-gray-600">Manage your payment options</p>
                    </div>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <button className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-gray-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Privacy & Security</p>
                      <p className="text-sm text-gray-600">Control your privacy settings</p>
                    </div>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <button className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-6 h-6 text-gray-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Help & Support</p>
                      <p className="text-sm text-gray-600">Get help with your account</p>
                    </div>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between hover:bg-red-50 transition-colors p-3 rounded-lg text-red-600"
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-6 h-6" />
                    <div className="text-left">
                      <p className="font-semibold">Log Out</p>
                      <p className="text-sm text-red-500">Sign out of your account</p>
                    </div>
                  </div>
                  <span className="text-red-400">›</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Booking Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cancel Booking?</h2>
              <p className="text-gray-600">Are you sure you want to cancel this booking?</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Please Note:</strong> Cancellation fees may apply depending on the cancellation policy. Please review the policy before proceeding.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancelBooking}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditDialog(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Booking Dialog */}
      {showManageDialog && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Manage Booking</h2>
                <p className="text-sm text-gray-600 mt-1">Confirmation: {selectedBooking.id}</p>
              </div>
              <button
                onClick={() => setShowManageDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Booking Details */}
            <div className="p-8">
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex gap-4 mb-4">
                  <img
                    src={selectedBooking.image}
                    alt={selectedBooking.property}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedBooking.property}
                    </h3>
                    <p className="text-gray-600 flex items-center mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedBooking.location}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Check-in: </span>
                        <span className="font-semibold">{selectedBooking.checkIn}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Check-out: </span>
                        <span className="font-semibold">{selectedBooking.checkOut}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">${selectedBooking.total}</span>
                  </div>
                </div>
              </div>

              {/* Action Options */}
              <div className="space-y-3">
                <button
                  onClick={handleModifyDates}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Modify Dates</p>
                    <p className="text-sm text-gray-600">Request to change check-in or check-out dates</p>
                  </div>
                </button>

                <button
                  onClick={handleContactHost}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Contact Host</p>
                    <p className="text-sm text-gray-600">Send a message to your host</p>
                  </div>
                </button>

                <button
                  onClick={handleSpecialRequest}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Special Requests</p>
                    <p className="text-sm text-gray-600">Request special accommodations or services</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowManageDialog(false);
                    handleDownloadReceipt(selectedBooking);
                  }}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Download Receipt</p>
                    <p className="text-sm text-gray-600">Get a copy of your booking receipt</p>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowManageDialog(false)}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modify Dates Dialog */}
      {showModifyDatesDialog && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Modify Booking Dates</h2>
              <p className="text-gray-600">Request to change your check-in or check-out dates</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Check-in Date
                </label>
                <input
                  type="date"
                  defaultValue="2026-05-15"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Check-out Date
                </label>
                <input
                  type="date"
                  defaultValue="2026-05-20"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Reason for Change (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Let the host know why you need to modify dates..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a request to modify your dates. The host will review and respond within 24 hours. Price may change based on new dates.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModifyDatesDialog(false)}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmModifyDates}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Host Dialog */}
      {showContactHostDialog && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Host</h2>
              <p className="text-gray-600">Send a message about your booking</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const message = formData.get('message') as string;
                if (message.trim()) {
                  sendMessageToHost(message);
                }
              }}
              className="space-y-4 mb-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="e.g., Question about check-in"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Write your message to the host..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactHostDialog(false)}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Special Request Dialog */}
      {showSpecialRequestDialog && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Special Requests</h2>
              <p className="text-gray-600">Request special accommodations or services</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const request = formData.get('request') as string;
                if (request.trim()) {
                  submitSpecialRequest(request);
                }
              }}
              className="space-y-4 mb-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Request Type
                </label>
                <select
                  name="requestType"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Early Check-in</option>
                  <option>Late Check-out</option>
                  <option>Extra Amenities</option>
                  <option>Accessibility</option>
                  <option>Pet Accommodation</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Details
                </label>
                <textarea
                  name="request"
                  rows={4}
                  placeholder="Please describe your special request..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>Note:</strong> Special requests are subject to availability and host approval. Additional charges may apply.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSpecialRequestDialog(false)}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign Out?</h2>
              <p className="text-gray-600">
                Are you sure you want to sign out of your account?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <FAQ items={userProfileFAQs} title="Profile & Bookings FAQs" />
    </div>
  );
}
