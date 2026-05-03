import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  MapPin,
  Bed,
  Image as ImageIcon,
  DollarSign,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  Upload,
  X,
  Wifi,
  Coffee,
  Car,
  Dumbbell,
  Tv,
  Wind,
  UtensilsCrossed,
  WashingMachine,
  Droplets,
  Shield,
  Flame,
  Mountain,
  Dog,
  Cigarette,
  Music,
  Users as UsersIcon,
  Calendar,
  Bath,
  Maximize2,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";
import { FAQ } from "../pages/FAQ";
import type { FAQItem } from "../pages/FAQ";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type PropertyType = "house" | "apartment" | "condo" | "villa" | "cabin" | "";

interface PropertyData {
  // Step 1: Property Type
  propertyType: PropertyType;
  
  // Step 2: Location
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Step 3: Details
  bedrooms: string;
  bathrooms: string;
  guests: string;
  size: string;
  
  // Step 4: Amenities
  amenities: string[];
  
  // Step 5: Photos
  photos: File[];
  
  // Step 6: Pricing
  pricePerNight: string;
  cleaningFee: string;
  weeklyDiscount: string;
  monthlyDiscount: string;
  
  // Step 7: Description
  title: string;
  description: string;
  houseRules: string[];
}

const TOTAL_STEPS = 8;

const AMENITIES_OPTIONS = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "kitchen", label: "Kitchen", icon: Coffee },
  { id: "parking", label: "Free Parking", icon: Car },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "tv", label: "TV", icon: Tv },
  { id: "ac", label: "Air Conditioning", icon: Wind },
  { id: "dining", label: "Dining Area", icon: UtensilsCrossed },
  { id: "washer", label: "Washer", icon: WashingMachine },
  { id: "pool", label: "Pool", icon: Droplets },
  { id: "security", label: "Security System", icon: Shield },
  { id: "heating", label: "Heating", icon: Flame },
  { id: "view", label: "Scenic View", icon: Mountain },
];

const HOUSE_RULES_OPTIONS = [
  { id: "no-smoking", label: "No smoking" },
  { id: "no-pets", label: "No pets" },
  { id: "no-parties", label: "No parties or events" },
  { id: "no-noise", label: "No excessive noise after 10 PM" },
];

const listPropertyFAQs: FAQItem[] = [
  {
    question: "How long does it take to list my property?",
    answer: "The listing process takes about 15-20 minutes. You'll provide details about your property, upload photos, set pricing, and write a description. You can save as a draft and finish later if needed."
  },
  {
    question: "What information do I need to list my property?",
    answer: "You'll need property details (type, location, size), high-quality photos, amenities list, pricing information, house rules, and a detailed description. Make sure you have all required documents and permissions to rent out your property."
  },
  {
    question: "How much does it cost to list a property?",
    answer: "Listing your property is free! UrbanStay charges a 15% service fee only when you receive a booking. There are no upfront costs or monthly fees."
  },
  {
    question: "When will my listing go live?",
    answer: "After you publish your listing, it goes through a quick review process (usually 24-48 hours) to ensure it meets our quality standards. You'll be notified once it's approved and visible to guests."
  },
  {
    question: "How do I set competitive pricing?",
    answer: "Research similar properties in your area to see their rates. Consider your location, amenities, property size, and seasonal demand. You can offer weekly and monthly discounts to attract longer stays."
  },
  {
    question: "Can I edit my listing after publishing?",
    answer: "Yes! You can edit your listing anytime from your host dashboard. Changes to pricing and availability are instant, while major changes may require re-approval."
  },
  {
    question: "What makes a good property description?",
    answer: "Write a detailed, honest description highlighting what makes your property special. Include nearby attractions, transportation options, and what guests can expect. Be clear about house rules and check-in procedures."
  },
  {
    question: "How many photos should I upload?",
    answer: "Upload at least 5 high-quality photos showing all areas of your property: living spaces, bedrooms, kitchen, bathroom, and exterior. Properties with 10+ photos get 40% more bookings."
  }
];

export function ListProperty() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSaveDraftDialog, setShowSaveDraftDialog] = useState(false);
  const [showRemovePhotoDialog, setShowRemovePhotoDialog] = useState(false);
  const [photoToRemove, setPhotoToRemove] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const [propertyData, setPropertyData] = useState<PropertyData>({
    propertyType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    bedrooms: "",
    bathrooms: "",
    guests: "",
    size: "",
    amenities: [],
    photos: [],
    pricePerNight: "",
    cleaningFee: "",
    weeklyDiscount: "",
    monthlyDiscount: "",
    title: "",
    description: "",
    houseRules: [],
  });

  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    }
  }, [isAuthenticated]);

  const updatePropertyData = (field: keyof PropertyData, value: any) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!propertyData.propertyType) {
          newErrors.propertyType = "Please select a property type";
        }
        break;
      case 2:
        if (!propertyData.address.trim()) newErrors.address = "Address is required";
        if (!propertyData.city.trim()) newErrors.city = "City is required";
        if (!propertyData.state.trim()) newErrors.state = "State is required";
        if (!propertyData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
        if (!propertyData.country.trim()) newErrors.country = "Country is required";
        break;
      case 3:
        if (!propertyData.bedrooms || parseInt(propertyData.bedrooms) < 0) {
          newErrors.bedrooms = "Number of bedrooms is required";
        }
        if (!propertyData.bathrooms || parseFloat(propertyData.bathrooms) < 0) {
          newErrors.bathrooms = "Number of bathrooms is required";
        }
        if (!propertyData.guests || parseInt(propertyData.guests) < 1) {
          newErrors.guests = "Number of guests must be at least 1";
        }
        if (!propertyData.size.trim()) {
          newErrors.size = "Property size is required";
        }
        break;
      case 4:
        if (propertyData.amenities.length === 0) {
          newErrors.amenities = "Please select at least one amenity";
        }
        break;
      case 5:
        if (propertyData.photos.length === 0) {
          newErrors.photos = "Please upload at least one photo";
        }
        break;
      case 6:
        if (!propertyData.pricePerNight || parseFloat(propertyData.pricePerNight) < 1) {
          newErrors.pricePerNight = "Price per night must be at least $1";
        }
        break;
      case 7:
        if (!propertyData.title.trim()) {
          newErrors.title = "Property title is required";
        }
        if (!propertyData.description.trim()) {
          newErrors.description = "Property description is required";
        }
        if (propertyData.description.trim().length < 50) {
          newErrors.description = "Description must be at least 50 characters";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    navigate("/");
  };

  const handleSaveDraft = () => {
    setShowSaveDraftDialog(true);
  };

  const confirmSaveDraft = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveDraftDialog(false);
      toast.success("Draft saved successfully! You can continue editing later.");
      navigate("/profile");
    }, 1500);
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    
    if (newFiles.length === 0) {
      toast.error("Please upload only image files");
      return;
    }

    const newPhotos = [...propertyData.photos, ...newFiles];
    updatePropertyData("photos", newPhotos);

    // Create preview URLs
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPhotoPreviewUrls([...photoPreviewUrls, ...newUrls]);
    
    toast.success(`${newFiles.length} photo(s) uploaded successfully`);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoToRemove(index);
    setShowRemovePhotoDialog(true);
  };

  const confirmRemovePhoto = () => {
    if (photoToRemove !== null) {
      const newPhotos = propertyData.photos.filter((_, i) => i !== photoToRemove);
      const newUrls = photoPreviewUrls.filter((_, i) => i !== photoToRemove);

      // Revoke URL to prevent memory leaks
      URL.revokeObjectURL(photoPreviewUrls[photoToRemove]);

      updatePropertyData("photos", newPhotos);
      setPhotoPreviewUrls(newUrls);
      setShowRemovePhotoDialog(false);
      setPhotoToRemove(null);
      toast.success("Photo removed successfully");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handlePhotoUpload(e.dataTransfer.files);
    }
  };

  const handlePublish = () => {
    if (!validateStep(7)) {
      toast.error("Please complete all required fields");
      return;
    }
    setCurrentStep(8);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalPublish = () => {
    setIsSaving(true);
    // Simulate publishing
    setTimeout(() => {
      setIsSaving(false);
      toast.success("🎉 Property published successfully!");
      navigate("/profile");
    }, 2000);
  };

  const progressPercentage = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  const toggleAmenity = (amenityId: string) => {
    const newAmenities = propertyData.amenities.includes(amenityId)
      ? propertyData.amenities.filter((id) => id !== amenityId)
      : [...propertyData.amenities, amenityId];
    updatePropertyData("amenities", newAmenities);
  };

  const toggleHouseRule = (ruleId: string) => {
    const newRules = propertyData.houseRules.includes(ruleId)
      ? propertyData.houseRules.filter((id) => id !== ruleId)
      : [...propertyData.houseRules, ruleId];
    updatePropertyData("houseRules", newRules);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl text-gray-900 mb-2">List Your Property</h1>
              <p className="text-gray-600">Step {currentStep} of {TOTAL_STEPS}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={handleExit}>
                <X className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Property Type</span>
              <span>Location</span>
              <span>Details</span>
              <span>Amenities</span>
              <span>Photos</span>
              <span>Pricing</span>
              <span>Description</span>
              <span>Review</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {/* Step 1: Property Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">What type of property are you listing?</CardTitle>
                  <CardDescription>
                    Choose the option that best describes your property
                  </CardDescription>
                </div>

                <RadioGroup
                  value={propertyData.propertyType}
                  onValueChange={(value) => updatePropertyData("propertyType", value as PropertyType)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {[
                    { value: "house", label: "House", description: "A standalone residential building" },
                    { value: "apartment", label: "Apartment", description: "A unit within a larger building" },
                    { value: "condo", label: "Condo", description: "A privately owned unit in a complex" },
                    { value: "villa", label: "Villa", description: "A luxury vacation home" },
                    { value: "cabin", label: "Cabin", description: "A rustic dwelling, often in nature" },
                  ].map((type) => (
                    <div key={type.value} className="flex items-start space-x-3">
                      <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                      <Label
                        htmlFor={type.value}
                        className="flex-1 cursor-pointer p-4 border-2 rounded-lg transition-colors hover:border-blue-200"
                      >
                        <div>
                          <div className="font-medium mb-1">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {errors.propertyType && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.propertyType}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Where is your property located?</CardTitle>
                  <CardDescription>
                    Provide the complete address of your property
                  </CardDescription>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={propertyData.address}
                      onChange={(e) => updatePropertyData("address", e.target.value)}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={propertyData.city}
                        onChange={(e) => updatePropertyData("city", e.target.value)}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state">State / Province *</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        value={propertyData.state}
                        onChange={(e) => updatePropertyData("state", e.target.value)}
                        className={errors.state ? "border-red-500" : ""}
                      />
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP / Postal Code *</Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        value={propertyData.zipCode}
                        onChange={(e) => updatePropertyData("zipCode", e.target.value)}
                        className={errors.zipCode ? "border-red-500" : ""}
                      />
                      {errors.zipCode && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.zipCode}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        placeholder="United States"
                        value={propertyData.country}
                        onChange={(e) => updatePropertyData("country", e.target.value)}
                        className={errors.country ? "border-red-500" : ""}
                      />
                      {errors.country && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.country}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="mt-6">
                    <Label>Location on Map</Label>
                    <div className="mt-2 h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>Map preview will appear here</p>
                        <p className="text-sm">Pin will be placed at the address you provided</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Property Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Tell us about your property</CardTitle>
                  <CardDescription>
                    Provide basic details about your property
                  </CardDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="bedrooms">Number of Bedrooms *</Label>
                    <div className="relative mt-1">
                      <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="bedrooms"
                        type="number"
                        min="0"
                        placeholder="2"
                        value={propertyData.bedrooms}
                        onChange={(e) => updatePropertyData("bedrooms", e.target.value)}
                        className={`pl-10 ${errors.bedrooms ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.bedrooms && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.bedrooms}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Number of Bathrooms *</Label>
                    <div className="relative mt-1">
                      <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="2"
                        value={propertyData.bathrooms}
                        onChange={(e) => updatePropertyData("bathrooms", e.target.value)}
                        className={`pl-10 ${errors.bathrooms ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.bathrooms && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.bathrooms}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="guests">Maximum Guests *</Label>
                    <div className="relative mt-1">
                      <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        placeholder="4"
                        value={propertyData.guests}
                        onChange={(e) => updatePropertyData("guests", e.target.value)}
                        className={`pl-10 ${errors.guests ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.guests && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.guests}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="size">Property Size *</Label>
                    <div className="relative mt-1">
                      <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="size"
                        placeholder="e.g., 1200 sq ft"
                        value={propertyData.size}
                        onChange={(e) => updatePropertyData("size", e.target.value)}
                        className={`pl-10 ${errors.size ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.size && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.size}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Amenities */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">What amenities do you offer?</CardTitle>
                  <CardDescription>
                    Select all amenities available at your property
                  </CardDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AMENITIES_OPTIONS.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = propertyData.amenities.includes(amenity.id);
                    
                    return (
                      <div
                        key={amenity.id}
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`
                          flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                        `}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleAmenity(amenity.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                        <span className={isSelected ? "text-blue-900" : "text-gray-900"}>
                          {amenity.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {errors.amenities && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.amenities}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Photos */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Add photos of your property</CardTitle>
                  <CardDescription>
                    Upload high-quality photos to attract more guests. The first photo will be the cover image.
                  </CardDescription>
                </div>

                {/* Upload Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center transition-colors
                    ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
                  `}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e.target.files)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg mb-2">
                      Drag and drop photos here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, WebP (Max 10MB per file)
                    </p>
                  </label>
                </div>

                {/* Photo Previews */}
                {photoPreviewUrls.length > 0 && (
                  <div>
                    <Label className="mb-3 block">
                      Uploaded Photos ({propertyData.photos.length})
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photoPreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Property ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Cover Photo
                            </div>
                          )}
                          <button
                            onClick={() => handleRemovePhoto(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove photo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.photos && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.photos}
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Pricing */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Set your pricing</CardTitle>
                  <CardDescription>
                    Set competitive prices to attract guests
                  </CardDescription>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pricePerNight">Price per Night (USD) *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="pricePerNight"
                        type="number"
                        min="1"
                        placeholder="100"
                        value={propertyData.pricePerNight}
                        onChange={(e) => updatePropertyData("pricePerNight", e.target.value)}
                        className={`pl-10 ${errors.pricePerNight ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.pricePerNight && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.pricePerNight}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cleaningFee">Cleaning Fee (USD)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="cleaningFee"
                        type="number"
                        min="0"
                        placeholder="50"
                        value={propertyData.cleaningFee}
                        onChange={(e) => updatePropertyData("cleaningFee", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">One-time fee charged per booking</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weeklyDiscount">Weekly Discount (%)</Label>
                      <Input
                        id="weeklyDiscount"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="10"
                        value={propertyData.weeklyDiscount}
                        onChange={(e) => updatePropertyData("weeklyDiscount", e.target.value)}
                      />
                      <p className="text-sm text-gray-500 mt-1">For 7+ night stays</p>
                    </div>

                    <div>
                      <Label htmlFor="monthlyDiscount">Monthly Discount (%)</Label>
                      <Input
                        id="monthlyDiscount"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="20"
                        value={propertyData.monthlyDiscount}
                        onChange={(e) => updatePropertyData("monthlyDiscount", e.target.value)}
                      />
                      <p className="text-sm text-gray-500 mt-1">For 28+ night stays</p>
                    </div>
                  </div>

                  {/* Price Preview */}
                  {propertyData.pricePerNight && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="mb-2">Pricing Preview</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Base price per night:</span>
                            <span className="font-medium">${propertyData.pricePerNight}</span>
                          </div>
                          {propertyData.cleaningFee && (
                            <div className="flex justify-between">
                              <span>Cleaning fee:</span>
                              <span className="font-medium">${propertyData.cleaningFee}</span>
                            </div>
                          )}
                          <div className="border-t border-blue-300 my-2"></div>
                          <div className="flex justify-between">
                            <span>You'll earn (per night):</span>
                            <span className="font-medium text-blue-700">
                              ${(parseFloat(propertyData.pricePerNight) * 0.85).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            *After UrbanStay's 15% service fee
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Step 7: Description & Rules */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Describe your property</CardTitle>
                  <CardDescription>
                    Write a compelling description and set house rules
                  </CardDescription>
                </div>

                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Modern Downtown Loft with City Views"
                    value={propertyData.title}
                    onChange={(e) => updatePropertyData("title", e.target.value)}
                    className={errors.title ? "border-red-500" : ""}
                    maxLength={60}
                  />
                  <div className="flex justify-between text-sm mt-1">
                    {errors.title ? (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.title}
                      </p>
                    ) : (
                      <p className="text-gray-500">Make it catchy and descriptive</p>
                    )}
                    <span className="text-gray-400">{propertyData.title.length}/60</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Property Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property in detail. Include what makes it special, nearby attractions, and what guests can expect during their stay..."
                    value={propertyData.description}
                    onChange={(e) => updatePropertyData("description", e.target.value)}
                    className={`min-h-[150px] ${errors.description ? "border-red-500" : ""}`}
                    maxLength={1000}
                  />
                  <div className="flex justify-between text-sm mt-1">
                    {errors.description ? (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.description}
                      </p>
                    ) : (
                      <p className="text-gray-500">Minimum 50 characters</p>
                    )}
                    <span className="text-gray-400">{propertyData.description.length}/1000</span>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">House Rules</Label>
                  <div className="space-y-3">
                    {HOUSE_RULES_OPTIONS.map((rule) => {
                      const isSelected = propertyData.houseRules.includes(rule.id);
                      
                      return (
                        <div
                          key={rule.id}
                          onClick={() => toggleHouseRule(rule.id)}
                          className={`
                            flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                            ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                          `}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleHouseRule(rule.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className={isSelected ? "text-blue-900" : "text-gray-900"}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Review & Publish */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Review your listing</CardTitle>
                  <CardDescription>
                    Review all details before publishing your property
                  </CardDescription>
                </div>

                <div className="space-y-6">
                  {/* Property Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Property Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium capitalize">{propertyData.propertyType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium">{propertyData.city}, {propertyData.state}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bedrooms</p>
                          <p className="font-medium">{propertyData.bedrooms}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bathrooms</p>
                          <p className="font-medium">{propertyData.bathrooms}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Guests</p>
                          <p className="font-medium">{propertyData.guests}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Size</p>
                          <p className="font-medium">{propertyData.size}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pricing */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pricing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Price per night</span>
                          <span className="font-medium">${propertyData.pricePerNight}</span>
                        </div>
                        {propertyData.cleaningFee && (
                          <div className="flex justify-between">
                            <span>Cleaning fee</span>
                            <span className="font-medium">${propertyData.cleaningFee}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Photos */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Photos ({propertyData.photos.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {photoPreviewUrls.slice(0, 6).map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Property ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Amenities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Amenities ({propertyData.amenities.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {propertyData.amenities.map((amenityId) => {
                          const amenity = AMENITIES_OPTIONS.find((a) => a.id === amenityId);
                          return amenity ? (
                            <span
                              key={amenityId}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                              {amenity.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{propertyData.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {propertyData.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Success Message */}
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="text-green-900 mb-1">Ready to publish!</h4>
                          <p className="text-sm text-green-700">
                            Your property listing looks great. Once published, it will be visible to guests on UrbanStay.
                            You can edit it anytime from your dashboard.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pb-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="min-w-[120px]"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 7 ? (
            <Button onClick={handleNext} className="min-w-[120px]">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : currentStep === 7 ? (
            <Button onClick={handlePublish} className="min-w-[120px]">
              Review & Publish
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleFinalPublish}
              disabled={isSaving}
              className="min-w-[120px] bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Publish Property
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ items={listPropertyFAQs} title="Property Listing FAQs" />

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit without saving?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to exit? All your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-red-600 hover:bg-red-700">
              Exit Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save Draft Confirmation Dialog */}
      <AlertDialog open={showSaveDraftDialog} onOpenChange={setShowSaveDraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save as draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Your listing will be saved as a draft. You can continue editing it later from your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveDraft} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Draft"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Photo Confirmation Dialog */}
      <AlertDialog open={showRemovePhotoDialog} onOpenChange={setShowRemovePhotoDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this photo from your listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPhotoToRemove(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemovePhoto} className="bg-red-600 hover:bg-red-700">
              Remove Photo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                Please sign in to your account to list your property
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Why sign in?</strong> You need an account to manage your property listings and communicate with potential guests.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Go Home
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
