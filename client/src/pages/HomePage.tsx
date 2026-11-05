import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users, Wifi, Coffee, Car, Dumbbell, Star, TrendingUp, Compass, UserCircle2, Clock, MapPinned, Heart } from "lucide-react";
import { useProperties } from "../context/PropertiesContext";
import { useSavedProperties } from "../context/SavedPropertiesContext";
import { allAdventures } from "../data/adventuresData";
import { allTourGuides } from "../data/tourGuidesFullData";
import { toast } from "sonner";
import { FAQ } from "./FAQ";
import type { FAQItem } from "./FAQ";

const homePageFAQs: FAQItem[] = [
  {
    question: "How does UrbanStay work?",
    answer: "UrbanStay connects travelers with unique accommodations, adventures, and tour guides in cities worldwide. Simply search for your destination, browse available options, and book directly through our platform."
  },
  {
    question: "Is it safe to book through UrbanStay?",
    answer: "Yes! We verify all hosts and service providers, offer secure payment processing, and provide 24/7 customer support. All bookings are protected by our guest guarantee policy."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and PayPal. Payment is processed securely through our encrypted payment system."
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Yes! Cancellation policies vary by property and service. Most offer free cancellation up to 24-48 hours before check-in. You can view the specific policy before booking."
  },
  {
    question: "Do I need to create an account to book?",
    answer: "Yes, you need to create a free account to make bookings. This helps us protect your reservations and provides access to your booking history and saved properties."
  },
  {
    question: "How do I contact my host or guide?",
    answer: "After booking, you'll receive contact information through our messaging system. You can communicate directly with hosts and guides to coordinate details."
  },
  {
    question: "What if I have issues during my stay?",
    answer: "Contact our 24/7 support team immediately through the app or website. We'll work with you and the host to resolve any issues quickly."
  },
  {
    question: "Can I leave a review?",
    answer: "Absolutely! After your stay or experience, you'll receive an email invitation to leave a review. Your feedback helps other travelers and improves our community."
  }
];

export function HomePage() {
  const { properties: allProperties } = useProperties();
  const navigate = useNavigate();
  const { toggleSaveProperty, isPropertySaved } = useSavedProperties();
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
  });
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);

  const popularDestinations = [
    { name: "New York", properties: 1250, image: "🗽" },
    { name: "Los Angeles", properties: 890, image: "🌴" },
    { name: "Chicago", properties: 650, image: "🏙️" },
    { name: "Miami", properties: 720, image: "🏖️" },
    { name: "San Francisco", properties: 580, image: "🌉" },
    { name: "Boston", properties: 490, image: "⚓" },
    { name: "Seattle", properties: 520, image: "🌲" },
    { name: "Austin", properties: 410, image: "🎸" },
  ];

  const allLocations = [
    "New York, NY",
    "Manhattan, New York",
    "Brooklyn, New York",
    "Los Angeles, CA",
    "Santa Monica, Los Angeles",
    "Hollywood, Los Angeles",
    "Chicago, IL",
    "Miami, FL",
    "Miami Beach, Florida",
    "San Francisco, CA",
    "Boston, MA",
    "Seattle, WA",
    "Austin, TX",
    "Denver, CO",
    "Portland, OR",
    "Las Vegas, NV",
    "San Diego, CA",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "Atlanta, GA",
  ];

  const handleLocationChange = (value: string) => {
    setSearchData({ ...searchData, location: value });
    if (value.length > 0) {
      const filtered = allLocations.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSearchData({ ...searchData, location });
    setShowLocationSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      location: searchData.location,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests,
    });
    navigate(`/listings?${params.toString()}`);
  };

  // Get top rated properties for featured section
  const featuredProperties = allProperties
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Urban Stay
            </h1>
            <p className="text-xl text-blue-100">
              Discover amazing accommodations in cities worldwide
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="text"
                    placeholder="Where to?"
                    value={searchData.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onFocus={() => {
                      if (searchData.location) {
                        setShowLocationSuggestions(true);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                  {showLocationSuggestions && filteredLocations.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                      {filteredLocations.map((location, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleLocationSelect(location)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center space-x-3 border-b last:border-b-0"
                        >
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-900">{location}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={searchData.guests}
                    onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 appearance-none"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
              >
                <Search className="w-5 h-5" />
                <span>Search Properties</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
            <p className="text-gray-600 mt-2">Explore trending cities for your next stay</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.slice(0, 4).map((destination, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(`/listings?location=${encodeURIComponent(destination.name)}`);
              }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-left border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-5xl mb-4">{destination.image}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {destination.name}
              </h3>
              <p className="text-gray-600">{destination.properties} properties</p>
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/listings")}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            <span>See All Destinations</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <p className="text-gray-600 mt-2">Handpicked stays for your perfect getaway</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden text-left group cursor-pointer"
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isSaved = isPropertySaved(property.id);
                      toggleSaveProperty(property.id);
                      if (isSaved) {
                        toast.success("Property removed from saved list");
                      } else {
                        toast.success("Property saved to your list");
                      }
                    }}
                    className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all ${
                      isPropertySaved(property.id)
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${
                      isPropertySaved(property.id)
                        ? "text-white fill-white"
                        : "text-gray-600"
                    }`} />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {property.name}
                    </h3>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900">{property.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${property.price}</span>
                      <span className="text-gray-600"> / night</span>
                    </div>
                    <span className="text-sm text-gray-500">{property.reviews} reviews</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/listings")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              View All Properties
            </button>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Premium Amenities</h2>
          <p className="text-gray-600 mt-2">Every stay includes modern comforts</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Wifi, label: "High-Speed WiFi" },
            { icon: Coffee, label: "Kitchen Access" },
            { icon: Car, label: "Free Parking" },
            { icon: Dumbbell, label: "Fitness Center" },
          ].map((amenity, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <amenity.icon className="w-8 h-8 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900">{amenity.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rent an Adventure */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Compass className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">Rent an Adventure</h2>
              </div>
              <p className="text-gray-600">Join curated tours and create unforgettable memories</p>
            </div>
            <button
              onClick={() => navigate("/adventures")}
              className="hidden md:inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <span>Explore All Adventures</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allAdventures.slice(0, 3).map((adventure) => (
              <button
                key={adventure.id}
                onClick={() => navigate(`/adventure/${adventure.id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden text-left group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={adventure.image}
                    alt={adventure.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{adventure.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      adventure.type === "Shared"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {adventure.type}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{adventure.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{adventure.type === "Private" ? "Flexible" : adventure.startDate}</span>
                    </div>
                    {adventure.type === "Shared" && adventure.maxParticipants && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{adventure.maxParticipants} max • {adventure.spotsLeft} spots left</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${adventure.price}</span>
                      <span className="text-gray-600 text-sm"> / person</span>
                    </div>
                    {adventure.spotsLeft !== null && adventure.spotsLeft > 0 && adventure.spotsLeft <= 5 && (
                      <span className="text-xs font-semibold text-orange-600">Almost Full!</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <button
              onClick={() => navigate("/adventures")}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <span>Explore All Adventures</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Rent a Tour Guide */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <UserCircle2 className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Rent a Tour Guide</h2>
            </div>
            <p className="text-gray-600">Expert local guides to enhance your travel experience</p>
          </div>
          <button
            onClick={() => navigate("/tour-guides")}
            className="hidden md:inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            <span>View All Guides</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {allTourGuides.slice(0, 4).map((guide) => (
            <button
              key={guide.id}
              onClick={() => navigate(`/tour-guide/${guide.id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden text-left group"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{guide.name}</h3>
                  <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">{guide.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 flex items-center">
                  <MapPinned className="w-4 h-4 mr-1" />
                  {guide.speciality}
                </p>

                <div className="text-xs text-gray-500 mb-4">
                  {guide.languages.join(" • ")} • {guide.reviews} reviews
                </div>

                <div className="pt-4 border-t">
                  <span className="text-2xl font-bold text-gray-900">${guide.price}</span>
                  <span className="text-gray-600 text-sm"> / hour</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/tour-guides")}
            className="md:hidden inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            <span>View All Guides</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ items={homePageFAQs} title="Frequently Asked Questions" />
    </div>
  );
}
