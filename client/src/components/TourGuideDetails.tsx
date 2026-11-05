import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Languages, Award, Clock, ChevronLeft, Star, Check, Calendar, Shield, LogIn, AlertCircle } from "lucide-react";
import { allTourGuides } from "../data/tourGuidesFullData";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FAQ } from "../pages/FAQ";
import type { FAQItem } from "../pages/FAQ";

const tourGuideFAQs: FAQItem[] = [
  {
    question: "How do I book a tour guide?",
    answer: "Simply select your preferred date and time, specify the number of people, and choose any additional services. You'll receive instant confirmation once the guide accepts your booking."
  },
  {
    question: "What is the minimum booking duration?",
    answer: "Most tour guides have a minimum booking of 3 hours. Some guides offer half-day (4 hours) or full-day (8 hours) packages at discounted rates."
  },
  {
    question: "Can I customize my tour itinerary?",
    answer: "Yes! Most guides are happy to customize tours based on your interests. Discuss your preferences with the guide after booking to create a personalized experience."
  },
  {
    question: "What languages do the guides speak?",
    answer: "Each guide's profile lists the languages they speak fluently. Most guides speak English, and many offer tours in multiple languages including Spanish, French, and Mandarin."
  },
  {
    question: "Are transportation costs included?",
    answer: "Transportation is typically not included in the hourly rate. Discuss transportation arrangements with your guide - they can either help arrange transport or use your vehicle."
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer: "Cancel or reschedule up to 48 hours before your tour for a full refund. Cancellations within 48 hours may receive a partial refund at the guide's discretion."
  },
  {
    question: "How do I communicate with my guide?",
    answer: "After booking, you'll receive the guide's contact information. You can message them directly through our platform or via phone/email to coordinate details."
  },
  {
    question: "Are gratuities expected?",
    answer: "Gratuities are not mandatory but are appreciated for exceptional service. A typical tip is 10-20% of the tour cost, but it's entirely at your discretion."
  }
];

export default function TourGuideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const guide = allTourGuides.find((g) => g.id === parseInt(id || "0"));

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Tour guide not found</h2>
          <button
            onClick={() => navigate("/tour-guides")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Tour Guides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/tour-guides")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Tour Guides
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <img
                src={guide.gallery[selectedImage]}
                alt={guide.name}
                className="w-full h-96 object-cover object-top"
              />
              <div className="flex gap-2 p-4 overflow-x-auto">
                {guide.gallery.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${guide.name} ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    className={`w-24 h-24 object-cover rounded cursor-pointer ${
                      selectedImage === index ? "ring-2 ring-green-600" : "opacity-60 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl mb-2">{guide.name}</h1>
                  <p className="text-green-600 text-lg">{guide.speciality}</p>
                </div>
                {guide.rating === 5.0 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Top Rated</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-yellow-500 text-lg mb-6">
                <Star className="w-6 h-6 fill-current" />
                <span>{guide.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm ml-1">
                  ({guide.reviews} reviews)
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>{guide.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Tours</p>
                    <p>{guide.toursCompleted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Response</p>
                    <p>{guide.responseTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Languages className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Languages</p>
                    <p>{guide.languages.length}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl mb-3">About Me</h2>
                <p className="text-gray-600 leading-relaxed">{guide.bio}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2">Experience</h3>
                  <p className="text-gray-600">{guide.experience}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3">Certifications</h3>
                <div className="space-y-2">
                  {guide.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg">Availability</h3>
                </div>
                <p className="text-gray-600">{guide.availability}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl mb-6">Reviews ({guide.reviews})</h2>

              <div className="grid grid-cols-1 gap-1 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-20">5 stars</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (guide.reviewsList.filter((r) => r.rating === 5).length /
                            guide.reviewsList.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {guide.reviewsList.filter((r) => r.rating === 5).length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-20">4 stars</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (guide.reviewsList.filter((r) => r.rating === 4).length /
                            guide.reviewsList.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {guide.reviewsList.filter((r) => r.rating === 4).length}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {guide.reviewsList.slice(0, showAllReviews ? guide.reviewsList.length : 3).map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xl">
                        {review.userAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4>{review.userName}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {guide.reviewsList.length > 3 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="px-6 py-2 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    {showAllReviews ? "Show Less" : `Show More Reviews (${guide.reviewsList.length - 3} more)`}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl">${guide.price}</span>
                  <span className="text-gray-500">/hour</span>
                </div>
                <p className="text-sm text-gray-600">Minimum booking: 3 hours</p>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowLoginPrompt(true);
                  } else {
                    setShowBookingModal(true);
                  }
                }}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-3">
                Book Now
              </button>

              <button className="w-full px-6 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 mb-6">
                Contact Guide
              </button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free cancellation 24h before</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Verified professional</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Customizable itinerary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ items={tourGuideFAQs} title="Tour Guide Booking FAQs" />

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Book {guide.name}</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-16 h-16 rounded-full object-cover object-top"
                />
                <div>
                  <h3>{guide.name}</h3>
                  <p className="text-sm text-gray-600">{guide.speciality}</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{guide.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Tour Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Start Time</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>12:00 PM</option>
                  <option>1:00 PM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Duration (hours)</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="3">3 hours - ${guide.price * 3}</option>
                  <option value="4">4 hours - ${guide.price * 4}</option>
                  <option value="5">5 hours - ${guide.price * 5}</option>
                  <option value="6">6 hours - ${guide.price * 6}</option>
                  <option value="8">Full day (8 hours) - ${guide.price * 8}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Number of People</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>1 person</option>
                  <option>2 people</option>
                  <option>3 people</option>
                  <option>4 people</option>
                  <option>5 people</option>
                  <option>6+ people</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Preferred Language</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  {guide.languages.map((lang, idx) => (
                    <option key={idx}>{lang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Special Requests (Optional)</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Any specific interests, accessibility needs, or requests..."
                ></textarea>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Base price (3 hours minimum)</span>
                  <span>${guide.price * 3}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Service fee</span>
                  <span>${(guide.price * 3 * 0.15).toFixed(0)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="text-xl">${(guide.price * 3 * 1.15).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Prompt Dialog */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600">
                Please sign in to your account to book this tour guide
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
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
                onClick={() => navigate("/login", { state: { from: { pathname: window.location.pathname } } })}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
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
