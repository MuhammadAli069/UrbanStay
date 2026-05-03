import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Users, MapPin, Filter, Clock, TrendingUp } from "lucide-react";
import { allAdventures } from "../data/adventuresData";
import { FAQ } from "../pages/FAQ";
import type { FAQItem } from "../pages/FAQ";

const adventuresFAQs: FAQItem[] = [
  {
    question: "What's the difference between Shared and Private adventures?",
    answer: "Shared adventures have fixed dates and you join a group of other travelers, making them more affordable. Private adventures are customizable to your schedule and exclusively for you and your group."
  },
  {
    question: "What do the difficulty levels mean?",
    answer: "Easy adventures require minimal physical effort and are suitable for all ages. Moderate adventures involve some walking or light activity. Challenging adventures require good fitness and may include hiking, climbing, or strenuous activities."
  },
  {
    question: "How do I join a Shared adventure?",
    answer: "Select a Shared adventure with available spots, choose your booking date, and complete the reservation. You'll be paired with other travelers who have similar interests."
  },
  {
    question: "Can I customize a Private adventure?",
    answer: "Yes! Private adventures can be customized to your preferences. After booking, you can discuss your interests, schedule, and special requests with your guide."
  },
  {
    question: "What's included in the adventure price?",
    answer: "Most adventures include guide services, equipment, and transportation during the activity. Specific inclusions vary by adventure - check the details page for a complete list."
  },
  {
    question: "What should I bring on an adventure?",
    answer: "Each adventure page lists recommended items to bring. Typically you'll need comfortable clothing, water, sunscreen, and any personal items. Specialized equipment is usually provided."
  },
  {
    question: "What happens if weather conditions are bad?",
    answer: "If weather makes an adventure unsafe, we'll contact you to reschedule or offer a full refund. Your safety is our top priority."
  },
  {
    question: "Are adventures suitable for children?",
    answer: "Many Easy and some Moderate adventures are family-friendly. Check the adventure details for age restrictions and recommendations."
  }
];

export default function Adventures() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "all",
    difficulty: searchParams.get("difficulty") || "all",
    priceRange: [0, 2000],
    duration: "all",
  });

  const filteredAdventures = useMemo(() => {
    return allAdventures.filter((adventure) => {
      if (filters.type !== "all" && adventure.type !== filters.type) return false;
      if (filters.difficulty !== "all" && adventure.difficulty !== filters.difficulty) return false;
      if (adventure.price < filters.priceRange[0] || adventure.price > filters.priceRange[1]) return false;
      if (filters.duration !== "all") {
        const days = parseInt(adventure.duration);
        if (filters.duration === "1-2" && (days < 1 || days > 2)) return false;
        if (filters.duration === "3-5" && (days < 3 || days > 5)) return false;
        if (filters.duration === "6+" && days < 6) return false;
      }
      return true;
    });
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
    setSearchParams(params);
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      difficulty: "all",
      priceRange: [0, 2000],
      duration: "all",
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-4">Rent an Adventure</h1>
          <p className="text-xl opacity-90">Unforgettable experiences with expert guides</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Types</option>
                    <option value="Shared">Shared</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Duration</label>
                  <select
                    value={filters.duration}
                    onChange={(e) => handleFilterChange("duration", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Any Duration</option>
                    <option value="1-2">1-2 Days</option>
                    <option value="3-5">3-5 Days</option>
                    <option value="6+">6+ Days</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      handleFilterChange("priceRange", [0, parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredAdventures.length} {filteredAdventures.length === 1 ? "adventure" : "adventures"} found
              </p>
            </div>

            {filteredAdventures.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl mb-2">No adventures found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAdventures.map((adventure) => (
                  <div
                    key={adventure.id}
                    onClick={() => navigate(`/adventure/${adventure.id}`)}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={adventure.image}
                        alt={adventure.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4">
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
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            adventure.difficulty === "Easy"
                              ? "bg-blue-500 text-white"
                              : adventure.difficulty === "Moderate"
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {adventure.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl mb-2">{adventure.name}</h3>

                      <div className="flex items-center gap-1 text-yellow-500 mb-3">
                        <span>★</span>
                        <span>{adventure.rating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm ml-1">
                          ({adventure.reviews} reviews)
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          {adventure.location}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Clock className="w-4 h-4" />
                          {adventure.duration}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar className="w-4 h-4" />
                          {adventure.startDate}
                        </div>
                      </div>

                      {adventure.type === "Shared" && adventure.participants.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              {adventure.currentParticipants}/{adventure.maxParticipants} joined
                            </span>
                            <span className="text-sm text-green-600">
                              {adventure.spotsLeft} spots left
                            </span>
                          </div>
                          <div className="flex -space-x-2">
                            {adventure.participants.slice(0, 5).map((participant) => (
                              <div
                                key={participant.id}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white border-2 border-white text-sm"
                                title={`${participant.name} from ${participant.location}`}
                              >
                                {participant.avatar}
                              </div>
                            ))}
                            {adventure.participants.length > 5 && (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white text-xs text-gray-600">
                                +{adventure.participants.length - 5}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <span className="text-2xl">${adventure.price}</span>
                          <span className="text-gray-500 text-sm"> per person</span>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ items={adventuresFAQs} title="Adventure Booking FAQs" />
    </div>
  );
}
