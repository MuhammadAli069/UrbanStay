import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, MapPin, Clock, Award, ChevronLeft, Check, Star, LogIn, AlertCircle } from "lucide-react";
import { allAdventures } from "../data/adventuresData";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FAQ } from "../pages/FAQ";
import type { FAQItem } from "../pages/FAQ";

const adventureFAQs: FAQItem[] = [
  {
    question: "What should I bring on the adventure?",
    answer: "We recommend bringing comfortable outdoor clothing, sturdy shoes, water bottle, sunscreen, and any personal medications. Specific gear requirements will be provided in your booking confirmation."
  },
  {
    question: "What's the cancellation policy for adventures?",
    answer: "Cancel up to 7 days before the adventure date for a full refund. Cancellations within 7 days receive a 50% refund. No refund for cancellations within 24 hours of the adventure."
  },
  {
    question: "Are adventures suitable for beginners?",
    answer: "Most of our adventures cater to various skill levels. Check the difficulty level and requirements in the adventure details. If you're unsure, contact the guide before booking."
  },
  {
    question: "What happens if weather conditions are bad?",
    answer: "Safety is our priority. If weather conditions are unsafe, adventures may be rescheduled or cancelled with a full refund. You'll be notified at least 12 hours in advance."
  },
  {
    question: "Is food and water included?",
    answer: "It varies by adventure. Check the 'What's Included' section for details. Most half-day trips include water and snacks, while full-day adventures often include meals."
  },
  {
    question: "What is the group size?",
    answer: "Group adventures typically have 6-15 participants. Private adventures are for your group only. Maximum group size is specified in the adventure details."
  },
  {
    question: "Do I need travel insurance?",
    answer: "While not mandatory, we highly recommend travel insurance that covers adventure activities. This provides protection for cancellations, medical emergencies, and equipment damage."
  },
  {
    question: "What is the minimum age requirement?",
    answer: "Age requirements vary by adventure type and difficulty. Check the adventure details for specific age restrictions. Minors must be accompanied by an adult guardian."
  }
];

export default function AdventureDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const adventure = allAdventures.find((a) => a.id === parseInt(id || "0"));

  if (!adventure) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Adventure not found</h2>
          <button
            onClick={() => navigate("/adventures")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Adventures
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/adventures")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Adventures
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <img
                src={adventure.gallery[selectedImage]}
                alt={adventure.name}
                className="w-full h-96 object-cover"
              />
              <div className="flex gap-2 p-4 overflow-x-auto">
                {adventure.gallery.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${adventure.name} ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    className={`w-24 h-24 object-cover rounded cursor-pointer ${
                      selectedImage === index ? "ring-2 ring-blue-600" : "opacity-60 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl">{adventure.name}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    adventure.type === "Shared"
                      ? "bg-green-500 text-white"
                      : "bg-purple-500 text-white"
                  }`}
                >
                  {adventure.type}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{adventure.rating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm ml-1">
                    ({adventure.reviews} reviews)
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    adventure.difficulty === "Easy"
                      ? "bg-blue-100 text-blue-800"
                      : adventure.difficulty === "Moderate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {adventure.difficulty}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p>{adventure.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>{adventure.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Min Age</p>
                    <p>{adventure.minAge}+ years</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Guide</p>
                    <p>{adventure.guide}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl mb-3">About This Adventure</h2>
                <p className="text-gray-600 leading-relaxed">{adventure.description}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {adventure.included.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl mb-4">Itinerary</h2>
              <div className="space-y-4">
                {adventure.itinerary.map((day) => (
                  <div key={day.day} className="border-l-4 border-blue-600 pl-4">
                    <h3 className="mb-1">
                      Day {day.day}: {day.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {adventure.type === "Shared" && adventure.participants.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl mb-4">
                  Who's Coming ({adventure.currentParticipants}/{adventure.maxParticipants})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {adventure.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                        {participant.avatar}
                      </div>
                      <div>
                        <p className="text-sm">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {adventure.spotsLeft && adventure.spotsLeft > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-green-600">
                      {adventure.spotsLeft} {adventure.spotsLeft === 1 ? "spot" : "spots"} left!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl">${adventure.price}</span>
                  <span className="text-gray-500">per person</span>
                </div>
                {adventure.type === "Shared" && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">
                      {adventure.startDate} - {adventure.endDate}
                    </span>
                  </div>
                )}
                {adventure.type === "Private" && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Flexible dates</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowLoginPrompt(true);
                  } else {
                    setShowBookingModal(true);
                  }
                }}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-3">
                Book Now
              </button>

              {adventure.type === "Private" && (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowLoginPrompt(true);
                    } else {
                      setShowBookingModal(true);
                    }
                  }}
                  className="w-full px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50">
                  Request Custom Dates
                </button>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free cancellation up to 7 days before</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Expert local guide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Book {adventure.name}</h2>
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
                  src={adventure.image}
                  alt={adventure.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3>{adventure.name}</h3>
                  <p className="text-sm text-gray-600">{adventure.duration} • {adventure.location}</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{adventure.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              {adventure.type === "Shared" && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm mb-1">
                      <strong>Dates:</strong> {adventure.startDate} - {adventure.endDate}
                    </p>
                    <p className="text-sm">
                      <strong>Spots available:</strong> {adventure.spotsLeft} out of {adventure.maxParticipants}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Number of People</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {Array.from({ length: Math.min(adventure.spotsLeft || 1, 5) }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'person' : 'people'} - ${adventure.price * num}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {adventure.type === "Private" && (
                <>
                  <div>
                    <label className="block text-sm mb-2">Preferred Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Number of People</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'person' : 'people'} - ${adventure.price * num}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm mb-2">Dietary Restrictions (Optional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., vegetarian, gluten-free"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Emergency Contact Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Special Requests (Optional)</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Physical limitations, special interests, etc."
                ></textarea>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">{adventure.price} x 1 person</span>
                  <span>${adventure.price}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Service fee</span>
                  <span>${(adventure.price * 0.12).toFixed(0)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="text-xl">${(adventure.price * 1.12).toFixed(0)}</span>
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
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <FAQ
        items={adventureFAQs}
        title="Adventure Booking FAQs"
      />

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
                Please sign in to your account to book this adventure
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
