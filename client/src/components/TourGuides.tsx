import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Languages, Award, Clock, Filter, Star } from "lucide-react";
import { allTourGuides } from "../data/tourGuidesFullData";
import { FAQ } from "../pages/FAQ";
import type { FAQItem } from "../pages/FAQ";

const tourGuidesFAQs: FAQItem[] = [
  {
    question: "How do I choose the right tour guide?",
    answer: "Browse guide profiles to see their specialities, languages, experience, and reviews. Use filters to narrow by price, rating, and language. Read past guest reviews to find a guide that matches your interests."
  },
  {
    question: "What does the hourly rate include?",
    answer: "The hourly rate covers the guide's expertise and time. Transportation, meals, entrance fees, and equipment are typically separate unless specified in the guide's profile."
  },
  {
    question: "Can I book a guide for multiple days?",
    answer: "Yes! Most guides offer multi-day tours. Contact the guide directly after viewing their profile to discuss extended bookings and potential discounts."
  },
  {
    question: "What if the guide speaks a language I need?",
    answer: "Use the Language filter to find guides who speak your preferred language. Most guides are fluent in multiple languages and can conduct tours accordingly."
  },
  {
    question: "How experienced are the tour guides?",
    answer: "All guides on our platform are verified professionals. Check their profile for certifications, years of experience, and number of tours completed."
  },
  {
    question: "Can I request a specific itinerary?",
    answer: "Absolutely! After booking, message your guide to discuss your interests and customize the tour itinerary to your preferences."
  },
  {
    question: "What's the minimum booking time?",
    answer: "Most guides require a minimum booking of 3 hours. Some offer half-day or full-day packages at discounted rates."
  },
  {
    question: "Do I tip the tour guide?",
    answer: "Tips are appreciated but not mandatory. A standard tip is 10-20% of the tour cost for exceptional service, but it's entirely at your discretion."
  }
];

export default function TourGuides() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    speciality: searchParams.get("speciality") || "all",
    priceRange: [0, 150],
    rating: "all",
    language: "all",
  });

  const specialities = [
    "all",
    "NYC History & Culture",
    "Food & Culinary Tours",
    "Adventure & Hiking",
    "Photography Tours",
    "Art & Architecture",
    "Beach & Water Sports",
    "Cultural Immersion",
    "Historical Walking Tours",
  ];

  const languages = ["all", "English", "Spanish", "French", "German", "Italian", "Mandarin", "Cantonese", "Japanese", "Portuguese"];

  const filteredGuides = useMemo(() => {
    return allTourGuides.filter((guide) => {
      if (filters.speciality !== "all" && guide.speciality !== filters.speciality) return false;
      if (guide.price < filters.priceRange[0] || guide.price > filters.priceRange[1]) return false;
      if (filters.rating !== "all") {
        const minRating = parseFloat(filters.rating);
        if (guide.rating < minRating) return false;
      }
      if (filters.language !== "all" && !guide.languages.includes(filters.language)) return false;
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
      speciality: "all",
      priceRange: [0, 150],
      rating: "all",
      language: "all",
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-4">Rent a Tour Guide</h1>
          <p className="text-xl opacity-90">Connect with expert local guides for personalized experiences</p>
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
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2">Speciality</label>
                  <select
                    value={filters.speciality}
                    onChange={(e) => handleFilterChange("speciality", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {specialities.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec === "all" ? "All Specialities" : spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Language</label>
                  <select
                    value={filters.language}
                    onChange={(e) => handleFilterChange("language", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang === "all" ? "All Languages" : lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Minimum Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange("rating", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.7">4.7+ Stars</option>
                    <option value="4.9">4.9+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">
                    Price per hour: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="150"
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
                {filteredGuides.length} {filteredGuides.length === 1 ? "guide" : "guides"} found
              </p>
            </div>

            {filteredGuides.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl mb-2">No guides found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGuides.map((guide) => (
                  <div
                    key={guide.id}
                    onClick={() => navigate(`/tour-guide/${guide.id}`)}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3">
                        <img
                          src={guide.image}
                          alt={guide.name}
                          className="w-full h-64 sm:h-full object-cover object-top"
                        />
                      </div>

                      <div className="p-6 sm:w-2/3">
                        <h3 className="text-xl mb-1">{guide.name}</h3>
                        <p className="text-green-600 text-sm mb-3">{guide.speciality}</p>

                        <div className="flex items-center gap-1 text-yellow-500 mb-3">
                          <span>★</span>
                          <span>{guide.rating.toFixed(1)}</span>
                          <span className="text-gray-500 text-sm ml-1">
                            ({guide.reviews} reviews)
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <MapPin className="w-4 h-4" />
                            {guide.location}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Languages className="w-4 h-4" />
                            {guide.languages.slice(0, 2).join(", ")}
                            {guide.languages.length > 2 && ` +${guide.languages.length - 2}`}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Award className="w-4 h-4" />
                            {guide.toursCompleted} tours completed
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Clock className="w-4 h-4" />
                            Responds {guide.responseTime}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div>
                            <span className="text-2xl">${guide.price}</span>
                            <span className="text-gray-500 text-sm">/hour</span>
                          </div>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            View Profile
                          </button>
                        </div>
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
      <FAQ items={tourGuidesFAQs} title="Tour Guide FAQs" />
    </div>
  );
}
