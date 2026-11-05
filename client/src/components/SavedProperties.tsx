import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, MapPin, Bed, Bath, Users, Wifi, Coffee, Car, Trash2, AlertCircle } from "lucide-react";
import { useSavedProperties } from "../context/SavedPropertiesContext";
import { useProperties } from "../context/PropertiesContext";
import { toast } from "sonner";
import { FAQ } from "../pages/FAQ";
import type { FAQItem } from "../pages/FAQ";

const savedPropertiesFAQs: FAQItem[] = [
  {
    question: "How do I save a property?",
    answer: "Click the heart icon on any property card while browsing. The property will be instantly added to your saved list for easy access later."
  },
  {
    question: "Is there a limit to how many properties I can save?",
    answer: "No! You can save as many properties as you like. Your saved list helps you compare options before making your final booking decision."
  },
  {
    question: "Will saving a property reserve it?",
    answer: "No, saving a property does not reserve or hold it. Properties remain available to other guests. To secure your stay, you need to complete a booking."
  },
  {
    question: "Can I access my saved properties from different devices?",
    answer: "Yes! Your saved properties are linked to your account and accessible from any device where you're logged in."
  },
  {
    question: "What happens if a saved property becomes unavailable?",
    answer: "The property will still appear in your saved list, but it may show as unavailable for your selected dates. You can check availability by visiting the property page."
  },
  {
    question: "Can I share my saved properties with others?",
    answer: "Currently, saved properties are private to your account. However, you can share individual property links with friends or family to help plan together."
  },
  {
    question: "Do saved properties expire?",
    answer: "No, your saved properties remain in your list indefinitely until you remove them. You can revisit them anytime."
  },
  {
    question: "Will I get notified about price changes?",
    answer: "Property prices may change based on demand and dates. Check the property page for current pricing before booking."
  }
];

export function SavedProperties() {
  const { properties: allProperties } = useProperties();
  const navigate = useNavigate();
  const { savedProperties, toggleSaveProperty } = useSavedProperties();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [propertyToRemove, setPropertyToRemove] = useState<number | null>(null);

  // Get the saved property objects
  const savedPropertyObjects = allProperties.filter(property =>
    savedProperties.includes(property.id)
  );

  const handleRemoveProperty = (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation();
    setPropertyToRemove(propertyId);
    setShowRemoveDialog(true);
  };

  const confirmRemoveProperty = () => {
    if (propertyToRemove !== null) {
      toggleSaveProperty(propertyToRemove);
      setShowRemoveDialog(false);
      setPropertyToRemove(null);
      toast.success("Property removed from saved list");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
          </div>
          <p className="text-gray-600">
            {savedPropertyObjects.length === 0
              ? "You haven't saved any properties yet"
              : `${savedPropertyObjects.length} ${savedPropertyObjects.length === 1 ? "property" : "properties"} saved`}
          </p>
        </div>

        {savedPropertyObjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved properties yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring and save your favorite properties for later
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
            {savedPropertyObjects.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <button
                    onClick={(e) => handleRemoveProperty(e, property.id)}
                    className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-colors"
                  >
                    <Heart className="w-5 h-5 text-white fill-white" />
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

        {savedPropertyObjects.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Want to explore more properties?
            </p>
            <button
              onClick={() => navigate("/listings")}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              <span>Browse More Properties</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>

      {/* Remove Property Confirmation Dialog */}
      {showRemoveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Remove from Saved?</h2>
              <p className="text-gray-600">
                Are you sure you want to remove this property from your saved list?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRemoveDialog(false);
                  setPropertyToRemove(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveProperty}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <FAQ items={savedPropertiesFAQs} title="Saved Properties FAQs" />
    </div>
  );
}
