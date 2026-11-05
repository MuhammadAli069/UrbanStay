import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Star, MapPin, Wifi, Coffee, Car, Users, Bed, Bath, Heart, SlidersHorizontal, X, Zap, Shield, CheckCircle, RotateCcw } from "lucide-react";
import { useProperties } from "../context/PropertiesContext";
import { useSavedProperties } from "../context/SavedPropertiesContext";
import { toast } from "sonner";
import { FAQ } from "../pages/FAQ";
import type { FAQItem } from "../pages/FAQ";

type FilterState = {
  priceRange: [number, number];
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  rating: string;
  instantBook: boolean;
  superhost: boolean;
  amenities: string[];
};

const defaultFilters: FilterState = {
  priceRange: [0, 500],
  propertyType: "all",
  bedrooms: "any",
  bathrooms: "any",
  rating: "any",
  instantBook: false,
  superhost: false,
  amenities: [],
};

const propertyListingsFAQs: FAQItem[] = [
  {
    question: "How do I search for properties in a specific location?",
    answer: "Enter your desired location in the search bar at the top of the page. You can search by city name, neighborhood, or use the autocomplete suggestions to find specific areas."
  },
  {
    question: "What do the filters mean?",
    answer: "Filters help narrow your search. Price Range sets your budget, Property Type filters by apartment/house/studio, Bedrooms and Bathrooms set minimum room counts, and Rating filters by guest review scores. Instant Book means immediate confirmation, and Superhost indicates experienced hosts with excellent reviews."
  },
  {
    question: "How do I save a property to view later?",
    answer: "Click the heart icon on any property card to save it. You can access all your saved properties from your profile under 'Saved Properties'."
  },
  {
    question: "What is 'Instant Book'?",
    answer: "Instant Book properties can be booked immediately without waiting for host approval. You'll receive instant confirmation once you complete your reservation."
  },
  {
    question: "What does the Superhost badge mean?",
    answer: "Superhosts are experienced hosts who consistently provide exceptional service, maintain high ratings (4.8+), have quick response times, and rarely cancel bookings."
  },
  {
    question: "Can I book multiple properties at once?",
    answer: "Each property requires a separate booking. However, you can save multiple properties to compare them before making your final decision."
  },
  {
    question: "How accurate are the property photos?",
    answer: "All property photos are verified and represent the actual accommodation. If you find discrepancies upon arrival, contact our support team immediately."
  },
  {
    question: "What's included in the nightly price?",
    answer: "The nightly price includes the accommodation and basic amenities listed. Additional fees like cleaning fees, service charges, and local taxes are shown during checkout before you confirm your booking."
  }
];

export function PropertyListings() {
  const { properties: allProperties } = useProperties();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleSaveProperty, isPropertySaved } = useSavedProperties();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [tempFilters, setTempFilters] = useState<FilterState>(defaultFilters);

  // Get search params
  const locationParam = searchParams.get("location") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "1";

  // Update filters based on URL params on mount
  useEffect(() => {
    const priceMax = searchParams.get("priceMax");
    if (priceMax) {
      setFilters(prev => ({ ...prev, priceRange: [0, parseInt(priceMax)] }));
    }
  }, []);

  const toggleAmenity = (amenity: string) => {
    setTempFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const openFilterModal = () => {
    setTempFilters(filters);
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
    toast.success("Filters applied successfully");
  };

  const cancelFilters = () => {
    setTempFilters(filters);
    setShowFilterModal(false);
  };

  const countActiveFilters = () => {
    let count = 0;
    if (filters.propertyType !== "all") count++;
    if (filters.bedrooms !== "any") count++;
    if (filters.bathrooms !== "any") count++;
    if (filters.rating !== "any") count++;
    if (filters.priceRange[1] !== 500) count++;
    if (filters.instantBook) count++;
    if (filters.superhost) count++;
    if (filters.amenities.length > 0) count++;
    return count;
  };

  // Filter properties
  const filteredProperties = allProperties.filter(property => {
    // Location filter
    if (locationParam) {
      const searchLocation = locationParam.toLowerCase();
      const propertyLocation = property.location.toLowerCase();
      const propertyCity = property.city.toLowerCase();
      const propertyState = property.state.toLowerCase();

      if (!propertyLocation.includes(searchLocation) &&
          !propertyCity.includes(searchLocation) &&
          !propertyState.includes(searchLocation)) {
        return false;
      }
    }

    // Property type filter
    if (filters.propertyType !== "all" && property.type !== filters.propertyType) return false;

    // Price filter
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) return false;

    // Bedrooms filter
    if (filters.bedrooms !== "any" && property.bedrooms < parseInt(filters.bedrooms)) return false;

    // Bathrooms filter
    if (filters.bathrooms !== "any" && property.bathrooms < parseInt(filters.bathrooms)) return false;

    // Rating filter
    if (filters.rating !== "any" && property.rating < parseFloat(filters.rating)) return false;

    // Instant Book filter
    if (filters.instantBook && !property.instantBook) return false;

    // Superhost filter
    if (filters.superhost && !property.superhost) return false;

    // Amenities filter
    if (filters.amenities.length > 0 && !filters.amenities.every(a => property.amenities.includes(a))) return false;

    return true;
  });

  // Get unique cities for quick filter
  const uniqueCities = Array.from(new Set(allProperties.map(p => p.city))).sort();

  const handleCityFilter = (city: string) => {
    setSearchParams({ location: city });
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setTempFilters(defaultFilters);
    setSearchParams({});
    toast.success("All filters cleared");
  };

  const resetTempFilters = () => {
    setTempFilters(defaultFilters);
  };

  const handleSaveProperty = (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation();
    const isSaved = isPropertySaved(propertyId);
    toggleSaveProperty(propertyId);
    if (isSaved) {
      toast.success("Property removed from saved list");
    } else {
      toast.success("Property saved to your list");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Summary Bar */}
      <div className="bg-white border-b shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {locationParam ? `Properties in ${locationParam}` : "All Properties"}
              </h1>
              <p className="text-gray-600 mt-1">
                {checkIn && checkOut && (
                  <span>{checkIn} → {checkOut} • </span>
                )}
                {guests} {parseInt(guests) === 1 ? "Guest" : "Guests"} • {filteredProperties.length} properties found
              </p>
            </div>
            <button
              onClick={openFilterModal}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors font-semibold"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
              {countActiveFilters() > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                  {countActiveFilters()}
                </span>
              )}
            </button>
          </div>

          {/* Quick City Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => handleResetFilters()}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                !locationParam
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Cities
            </button>
            {uniqueCities.slice(0, 6).map((city) => (
              <button
                key={city}
                onClick={() => handleCityFilter(city)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  locationParam.toLowerCase() === city.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Property Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    <div className="relative">
                      <div className="h-56 overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <button
                        onClick={(e) => handleSaveProperty(e, property.id)}
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
                      <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white px-3 py-1 rounded-full shadow-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900">{property.rating}</span>
                        <span className="text-gray-600 text-sm">({property.reviews})</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {property.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </p>

                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms} bath</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{property.guests} guests</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {property.amenities.slice(0, 3).map((amenity) => (
                          <div key={amenity} className="bg-blue-50 p-2 rounded-lg">
                            {amenity === "wifi" && <Wifi className="w-4 h-4 text-blue-600" />}
                            {amenity === "kitchen" && <Coffee className="w-4 h-4 text-blue-600" />}
                            {amenity === "parking" && <Car className="w-4 h-4 text-blue-600" />}
                          </div>
                        ))}
                        <span className="text-xs text-gray-500 capitalize">{property.type}</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">${property.price}</span>
                          <span className="text-gray-600"> / night</span>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Filter Properties</h2>
                  <p className="text-sm text-gray-600">Customize your search preferences</p>
                </div>
              </div>
              <button
                onClick={cancelFilters}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Price Range */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      Price Range (per night)
                    </label>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={tempFilters.priceRange[1]}
                        onChange={(e) => setTempFilters({ ...tempFilters, priceRange: [0, parseInt(e.target.value)] })}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between items-center">
                        <div className="bg-white px-4 py-2 rounded-lg border-2 border-gray-300">
                          <span className="text-sm text-gray-600">Min:</span>
                          <span className="font-bold text-gray-900 ml-2">${tempFilters.priceRange[0]}</span>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border-2 border-gray-300">
                          <span className="text-sm text-gray-600">Max:</span>
                          <span className="font-bold text-gray-900 ml-2">${tempFilters.priceRange[1]}+</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-lg">🏠</span>
                      Property Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "all", label: "All Types" },
                        { value: "apartment", label: "Apartment" },
                        { value: "house", label: "House" },
                        { value: "studio", label: "Studio" },
                        { value: "villa", label: "Villa" },
                        { value: "condo", label: "Condo" },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setTempFilters({ ...tempFilters, propertyType: type.value })}
                          className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                            tempFilters.propertyType === type.value
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Bed className="w-5 h-5 text-gray-700" />
                      Bedrooms
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {["any", "1", "2", "3", "4"].map((num) => (
                        <button
                          key={num}
                          onClick={() => setTempFilters({ ...tempFilters, bedrooms: num })}
                          className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                            tempFilters.bedrooms === num
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500"
                          }`}
                        >
                          {num === "any" ? "Any" : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Bath className="w-5 h-5 text-gray-700" />
                      Bathrooms
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["any", "1", "2", "3"].map((num) => (
                        <button
                          key={num}
                          onClick={() => setTempFilters({ ...tempFilters, bathrooms: num })}
                          className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                            tempFilters.bathrooms === num
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500"
                          }`}
                        >
                          {num === "any" ? "Any" : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Rating */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      Minimum Rating
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "any", label: "Any Rating" },
                        { value: "4.0", label: "4.0+ Stars" },
                        { value: "4.5", label: "4.5+ Stars" },
                        { value: "4.8", label: "4.8+ Stars" },
                      ].map((rating) => (
                        <button
                          key={rating.value}
                          onClick={() => setTempFilters({ ...tempFilters, rating: rating.value })}
                          className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                            tempFilters.rating === rating.value
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500"
                          }`}
                        >
                          {rating.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Booking Options */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      Booking Options
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer p-4 bg-white rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
                        <input
                          type="checkbox"
                          checked={tempFilters.instantBook}
                          onChange={(e) => setTempFilters({ ...tempFilters, instantBook: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">Instant Book</span>
                          <p className="text-xs text-gray-600">Book without waiting for host approval</p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer p-4 bg-white rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
                        <input
                          type="checkbox"
                          checked={tempFilters.superhost}
                          onChange={(e) => setTempFilters({ ...tempFilters, superhost: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <Shield className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">Superhost</span>
                          <p className="text-xs text-gray-600">Experienced hosts with great reviews</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className="block font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "wifi", label: "WiFi", icon: Wifi },
                        { id: "kitchen", label: "Kitchen", icon: Coffee },
                        { id: "parking", label: "Parking", icon: Car },
                        { id: "gym", label: "Gym", icon: Users },
                      ].map((amenity) => (
                        <label
                          key={amenity.id}
                          className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 transition-all ${
                            tempFilters.amenities.includes(amenity.id)
                              ? "bg-blue-50 border-blue-600"
                              : "bg-white border-gray-300 hover:border-blue-500"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={tempFilters.amenities.includes(amenity.id)}
                            onChange={() => toggleAmenity(amenity.id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <amenity.icon className={`w-5 h-5 ${
                            tempFilters.amenities.includes(amenity.id) ? "text-blue-600" : "text-gray-500"
                          }`} />
                          <span className="font-semibold text-gray-900">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t px-8 py-6">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={resetTempFilters}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset All
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={cancelFilters}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <FAQ items={propertyListingsFAQs} title="Property Search FAQs" />
    </div>
  );
}
