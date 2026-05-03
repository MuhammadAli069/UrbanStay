import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  Lock,
  CheckCircle2,
  XCircle,
  Download,
  Mail,
  Calendar,
  Users,
  MapPin,
  Home,
  ChevronLeft,
  AlertCircle,
  Loader2,
  Star,
  Shield,
  LogIn,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
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
import { Progress } from "./ui/progress";
import { FAQ, FAQItem } from "./FAQ";

const bookingFlowFAQs: FAQItem[] = [
  {
    question: "Is my payment information secure?",
    answer: "Absolutely! All payment information is encrypted using industry-standard SSL/TLS encryption. We never store your full card details on our servers. Your payment is processed securely through trusted payment processors."
  },
  {
    question: "Can I change my booking dates after confirming?",
    answer: "Yes! After booking, you can modify your dates from your profile under 'My Bookings', subject to property availability. Changes are subject to the host's approval and cancellation policy."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as digital wallets including Apple Pay, Google Pay, and PayPal."
  },
  {
    question: "When will I be charged?",
    answer: "Your card will be charged immediately upon completing the booking. The host receives payment 24 hours after you check in."
  },
  {
    question: "What if I need to cancel my booking?",
    answer: "You can cancel your booking from your profile. Refund eligibility depends on the property's cancellation policy and how far in advance you cancel. Check the cancellation policy shown during booking for specific details."
  },
  {
    question: "Will I receive a confirmation?",
    answer: "Yes! You'll receive an email confirmation immediately after completing your booking. It includes your booking reference, property details, check-in instructions, and host contact information."
  },
  {
    question: "How do I contact my host?",
    answer: "After booking, you'll receive the host's contact information in your confirmation email. You can also message them directly through our platform from your bookings page."
  },
  {
    question: "What should I do if my payment fails?",
    answer: "If your payment fails, check that your card details are correct and that you have sufficient funds. You can try a different payment method or contact your bank for assistance."
  }
];

type BookingStep = "summary" | "guest-info" | "payment-method" | "payment-details" | "processing" | "success" | "failed";
type PaymentMethod = "card" | "wallet" | "";

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  city: string;
  zipCode: string;
  country: string;
  saveCard: boolean;
}

export function BookingFlow() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState<BookingStep>("summary");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
    saveCard: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processingProgress, setProcessingProgress] = useState(0);

  // Mock booking data (in real app, this would come from route state or context)
  const bookingData = {
    propertyId: propertyId || "1",
    propertyName: "Modern Downtown Loft",
    propertyLocation: "Manhattan, New York",
    propertyImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    checkIn: "2026-05-15",
    checkOut: "2026-05-20",
    guests: 2,
    nights: 5,
    pricePerNight: 185,
    cleaningFee: 50,
    serviceFee: 111,
    total: 1086,
    host: {
      name: "Sarah Johnson",
      rating: 4.9,
      reviews: 127,
    },
  };

  const bookingReference = `URB${Date.now().toString().slice(-8)}`;

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    }
  }, [isAuthenticated]);

  const updateGuestInfo = (field: keyof GuestInfo, value: string) => {
    setGuestInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const updatePaymentDetails = (field: keyof PaymentDetails, value: string | boolean) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\//g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateGuestInfo = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!guestInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!guestInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!guestInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!guestInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(guestInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentDetails = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === "card") {
      const cardNumberCleaned = paymentDetails.cardNumber.replace(/\s/g, "");
      
      if (!cardNumberCleaned) {
        newErrors.cardNumber = "Card number is required";
      } else if (cardNumberCleaned.length !== 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }
      
      if (!paymentDetails.cardName.trim()) {
        newErrors.cardName = "Cardholder name is required";
      }
      
      if (!paymentDetails.expiryDate) {
        newErrors.expiryDate = "Expiry date is required";
      } else {
        const [month, year] = paymentDetails.expiryDate.split("/");
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
          newErrors.expiryDate = "Invalid expiry date";
        } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
          newErrors.expiryDate = "Card has expired";
        }
      }
      
      if (!paymentDetails.cvv) {
        newErrors.cvv = "CVV is required";
      } else if (paymentDetails.cvv.length !== 3) {
        newErrors.cvv = "CVV must be 3 digits";
      }
      
      if (!paymentDetails.billingAddress.trim()) {
        newErrors.billingAddress = "Billing address is required";
      }
      if (!paymentDetails.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!paymentDetails.zipCode.trim()) {
        newErrors.zipCode = "ZIP code is required";
      }
      if (!paymentDetails.country.trim()) {
        newErrors.country = "Country is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueFromSummary = () => {
    setCurrentStep("guest-info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinueFromGuestInfo = () => {
    if (validateGuestInfo()) {
      setCurrentStep("payment-method");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handleContinueFromPaymentMethod = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    setCurrentStep("payment-details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProcessPayment = () => {
    if (!validatePaymentDetails()) {
      toast.error("Please fill in all required payment details correctly");
      return;
    }

    setCurrentStep("processing");
    setProcessingProgress(0);

    // Simulate payment processing
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      // Randomly succeed or fail for demo (90% success rate)
      const success = Math.random() > 0.1;
      setCurrentStep(success ? "success" : "failed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 3500);
  };

  const handleBack = () => {
    const steps: BookingStep[] = ["summary", "guest-info", "payment-method", "payment-details"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCancelBooking = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    toast.info("Booking cancelled");
    navigate(`/property/${propertyId}`);
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt downloaded successfully");
    // In real app, this would generate and download a PDF
  };

  const handleSendEmail = () => {
    setShowEmailDialog(true);
  };

  const confirmSendEmail = () => {
    setShowEmailDialog(false);
    toast.success(`Confirmation email sent to ${guestInfo.email}`);
  };

  const stepProgress = {
    summary: 25,
    "guest-info": 40,
    "payment-method": 60,
    "payment-details": 80,
    processing: 90,
    success: 100,
    failed: 100,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Progress - Hide on success/failed pages */}
        {currentStep !== "success" && currentStep !== "failed" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl text-gray-900 mb-1">Complete Your Booking</h1>
                <p className="text-gray-600">Secure checkout powered by UrbanStay</p>
              </div>
              {currentStep !== "processing" && (
                <Button variant="outline" onClick={handleCancelBooking}>
                  Cancel Booking
                </Button>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={stepProgress[currentStep]} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span className={currentStep === "summary" ? "text-blue-600 font-medium" : ""}>
                  Summary
                </span>
                <span className={currentStep === "guest-info" ? "text-blue-600 font-medium" : ""}>
                  Guest Info
                </span>
                <span className={currentStep === "payment-method" || currentStep === "payment-details" ? "text-blue-600 font-medium" : ""}>
                  Payment
                </span>
                <span className={currentStep === "processing" ? "text-blue-600 font-medium" : ""}>
                  Processing
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Booking Summary */}
            {currentStep === "summary" && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                  <CardDescription>Review your booking details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Info */}
                  <div className="flex gap-4">
                    <img
                      src={bookingData.propertyImage}
                      alt={bookingData.propertyName}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium mb-1">{bookingData.propertyName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        {bookingData.propertyLocation}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{bookingData.host.rating}</span>
                        </div>
                        <span className="text-gray-500">({bookingData.host.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Check-in - Check-out</p>
                        <p className="font-medium">
                          {new Date(bookingData.checkIn).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {" - "}
                          {new Date(bookingData.checkOut).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium">{bookingData.guests} guest{bookingData.guests > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Price Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          ${bookingData.pricePerNight} × {bookingData.nights} nights
                        </span>
                        <span className="font-medium">
                          ${bookingData.pricePerNight * bookingData.nights}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cleaning fee</span>
                        <span className="font-medium">${bookingData.cleaningFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service fee</span>
                        <span className="font-medium">${bookingData.serviceFee}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg pt-2">
                        <span className="font-medium">Total (USD)</span>
                        <span className="font-medium">${bookingData.total}</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleContinueFromSummary} className="w-full" size="lg">
                    Continue to Guest Information
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Guest Information */}
            {currentStep === "guest-info" && (
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                  <CardDescription>Please provide your contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={guestInfo.firstName}
                        onChange={(e) => updateGuestInfo("firstName", e.target.value)}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={guestInfo.lastName}
                        onChange={(e) => updateGuestInfo("lastName", e.target.value)}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={guestInfo.email}
                      onChange={(e) => updateGuestInfo("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Confirmation will be sent to this email
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={guestInfo.phone}
                      onChange={(e) => updateGuestInfo("phone", e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <textarea
                      id="specialRequests"
                      placeholder="Any special requests or requirements..."
                      value={guestInfo.specialRequests}
                      onChange={(e) => updateGuestInfo("specialRequests", e.target.value)}
                      className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleContinueFromGuestInfo} className="flex-1" size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment Method Selection */}
            {currentStep === "payment-method" && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Payment Method</CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                    <div
                      className={`
                        flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                      `}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <RadioGroupItem value="card" id="card" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-blue-600" : "text-gray-600"}`} />
                          <Label htmlFor="card" className="cursor-pointer font-medium">
                            Credit or Debit Card
                          </Label>
                        </div>
                        <p className="text-sm text-gray-600">
                          Pay securely with your credit or debit card
                        </p>
                        <div className="flex gap-2 mt-3">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-6" />
                        </div>
                      </div>
                    </div>

                    <div
                      className={`
                        flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${paymentMethod === "wallet" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                      `}
                      onClick={() => setPaymentMethod("wallet")}
                    >
                      <RadioGroupItem value="wallet" id="wallet" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Smartphone className={`w-5 h-5 ${paymentMethod === "wallet" ? "text-blue-600" : "text-gray-600"}`} />
                          <Label htmlFor="wallet" className="cursor-pointer font-medium">
                            Digital Wallet
                          </Label>
                        </div>
                        <p className="text-sm text-gray-600">
                          Pay with Apple Pay, Google Pay, or PayPal
                        </p>
                        <div className="flex gap-3 mt-3">
                          <div className="px-3 py-1.5 bg-black text-white rounded text-xs font-medium">
                            Apple Pay
                          </div>
                          <div className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium">
                            G Pay
                          </div>
                          <div className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium">
                            PayPal
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 flex gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 mb-1">Secure Payment</p>
                        <p className="text-blue-700">
                          Your payment information is encrypted and secure. We never store your full card details.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleContinueFromPaymentMethod} className="flex-1" size="lg">
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Payment Details */}
            {currentStep === "payment-details" && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {paymentMethod === "card" ? "Card Payment" : "Digital Wallet Payment"}
                  </CardTitle>
                  <CardDescription>
                    {paymentMethod === "card"
                      ? "Enter your card details securely"
                      : "Complete payment with your digital wallet"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {paymentMethod === "card" ? (
                    <>
                      {/* Card Payment Form */}
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentDetails.cardNumber}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16));
                              updatePaymentDetails("cardNumber", formatted);
                            }}
                            className={`pl-10 ${errors.cardNumber ? "border-red-500" : ""}`}
                            maxLength={19}
                          />
                        </div>
                        {errors.cardNumber && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="cardName">Cardholder Name *</Label>
                        <Input
                          id="cardName"
                          placeholder="JOHN DOE"
                          value={paymentDetails.cardName}
                          onChange={(e) => updatePaymentDetails("cardName", e.target.value.toUpperCase())}
                          className={errors.cardName ? "border-red-500" : ""}
                        />
                        {errors.cardName && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.cardName}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentDetails.expiryDate}
                            onChange={(e) => {
                              const formatted = formatExpiryDate(e.target.value.replace(/\D/g, "").slice(0, 4));
                              updatePaymentDetails("expiryDate", formatted);
                            }}
                            className={errors.expiryDate ? "border-red-500" : ""}
                            maxLength={5}
                          />
                          {errors.expiryDate && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="cvv"
                              type="password"
                              placeholder="123"
                              value={paymentDetails.cvv}
                              onChange={(e) => updatePaymentDetails("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))}
                              className={`pl-10 ${errors.cvv ? "border-red-500" : ""}`}
                              maxLength={3}
                            />
                          </div>
                          {errors.cvv && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="mb-4">Billing Address</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="billingAddress">Street Address *</Label>
                            <Input
                              id="billingAddress"
                              placeholder="123 Main Street"
                              value={paymentDetails.billingAddress}
                              onChange={(e) => updatePaymentDetails("billingAddress", e.target.value)}
                              className={errors.billingAddress ? "border-red-500" : ""}
                            />
                            {errors.billingAddress && (
                              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.billingAddress}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                placeholder="New York"
                                value={paymentDetails.city}
                                onChange={(e) => updatePaymentDetails("city", e.target.value)}
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
                              <Label htmlFor="zipCode">ZIP Code *</Label>
                              <Input
                                id="zipCode"
                                placeholder="10001"
                                value={paymentDetails.zipCode}
                                onChange={(e) => updatePaymentDetails("zipCode", e.target.value)}
                                className={errors.zipCode ? "border-red-500" : ""}
                              />
                              {errors.zipCode && (
                                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.zipCode}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="country">Country *</Label>
                            <Input
                              id="country"
                              placeholder="United States"
                              value={paymentDetails.country}
                              onChange={(e) => updatePaymentDetails("country", e.target.value)}
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
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="saveCard"
                          checked={paymentDetails.saveCard}
                          onCheckedChange={(checked) => updatePaymentDetails("saveCard", checked as boolean)}
                        />
                        <Label htmlFor="saveCard" className="cursor-pointer text-sm">
                          Save this card for future bookings
                        </Label>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Digital Wallet Payment */}
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Click the button below to complete your payment securely through your selected digital wallet.
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                          <Button
                            size="lg"
                            className="bg-black hover:bg-gray-800 text-white h-14"
                            onClick={handleProcessPayment}
                          >
                            <Smartphone className="w-5 h-5 mr-2" />
                            Pay with Apple Pay
                          </Button>
                          
                          <Button
                            size="lg"
                            variant="outline"
                            className="h-14"
                            onClick={handleProcessPayment}
                          >
                            <Smartphone className="w-5 h-5 mr-2" />
                            Pay with Google Pay
                          </Button>
                          
                          <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white h-14"
                            onClick={handleProcessPayment}
                          >
                            <Smartphone className="w-5 h-5 mr-2" />
                            Pay with PayPal
                          </Button>
                        </div>

                        <Card className="bg-gray-50">
                          <CardContent className="p-4 text-sm text-gray-600">
                            <p className="mb-2">
                              <strong>Note:</strong> You will be redirected to your wallet provider to authorize the payment.
                            </p>
                            <p>
                              The amount of <strong>${bookingData.total}</strong> will be charged to your selected payment method.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    {paymentMethod === "card" && (
                      <Button onClick={handleProcessPayment} className="flex-1" size="lg">
                        <Lock className="w-4 h-4 mr-2" />
                        Pay ${bookingData.total}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Processing */}
            {currentStep === "processing" && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="max-w-md mx-auto space-y-6">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
                    <div>
                      <h2 className="text-2xl mb-2">Processing Your Payment</h2>
                      <p className="text-gray-600">
                        Please wait while we securely process your payment. Do not close this window.
                      </p>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                    <p className="text-sm text-gray-500">
                      {processingProgress < 30 && "Verifying payment details..."}
                      {processingProgress >= 30 && processingProgress < 60 && "Processing payment..."}
                      {processingProgress >= 60 && processingProgress < 90 && "Confirming booking..."}
                      {processingProgress >= 90 && "Finalizing..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Success */}
            {currentStep === "success" && (
              <div className="space-y-6">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-8 text-center">
                    <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-4" />
                    <h1 className="text-3xl mb-2">Booking Confirmed!</h1>
                    <p className="text-lg text-gray-700 mb-4">
                      Your payment was successful and your booking is confirmed.
                    </p>
                    <div className="inline-block bg-white px-6 py-3 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                      <p className="text-2xl font-mono text-green-700">{bookingReference}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={bookingData.propertyImage}
                        alt={bookingData.propertyName}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium mb-1">{bookingData.propertyName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{bookingData.propertyLocation}</p>
                        <p className="text-sm">
                          <span className="text-gray-600">Host:</span> {bookingData.host.name}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Check-in</p>
                        <p className="font-medium">
                          {new Date(bookingData.checkIn).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-gray-500">After 3:00 PM</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Check-out</p>
                        <p className="font-medium">
                          {new Date(bookingData.checkOut).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-gray-500">Before 11:00 AM</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-gray-600 mb-1 text-sm">Guest Information</p>
                      <p className="font-medium">
                        {guestInfo.firstName} {guestInfo.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{guestInfo.email}</p>
                      <p className="text-sm text-gray-600">{guestInfo.phone}</p>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          ${bookingData.pricePerNight} × {bookingData.nights} nights
                        </span>
                        <span>${bookingData.pricePerNight * bookingData.nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cleaning fee</span>
                        <span>${bookingData.cleaningFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service fee</span>
                        <span>${bookingData.serviceFee}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg pt-2">
                        <span className="font-medium">Total Paid</span>
                        <span className="font-medium text-green-700">${bookingData.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleDownloadReceipt} variant="outline" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button onClick={handleSendEmail} variant="outline" size="lg">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Confirmation
                  </Button>
                </div>

                <Button onClick={() => navigate("/")} className="w-full" size="lg">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            )}

            {/* Step 7: Failed */}
            {currentStep === "failed" && (
              <div className="space-y-6">
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-8 text-center">
                    <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
                    <h1 className="text-3xl mb-2">Payment Failed</h1>
                    <p className="text-lg text-gray-700 mb-4">
                      We were unable to process your payment. Please try again.
                    </p>
                    <div className="inline-block bg-white px-6 py-3 rounded-lg border border-red-200">
                      <p className="text-sm text-gray-600 mb-1">Error Code</p>
                      <p className="text-xl font-mono text-red-700">PAYMENT_DECLINED</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What went wrong?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">
                      Your payment could not be processed. This could be due to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Insufficient funds in your account</li>
                      <li>Incorrect card details</li>
                      <li>Card expired or blocked</li>
                      <li>Transaction declined by your bank</li>
                    </ul>
                    <Separator />
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-900">
                        <strong>Need help?</strong> Contact your bank or try a different payment method.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      setCurrentStep("payment-method");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    variant="outline"
                    size="lg"
                  >
                    Try Different Payment
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStep("payment-details");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    size="lg"
                  >
                    Try Again
                  </Button>
                </div>

                <Button onClick={() => navigate("/")} variant="ghost" className="w-full">
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar - Only show on non-success/failed pages */}
          {currentStep !== "success" && currentStep !== "failed" && currentStep !== "processing" && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <img
                      src={bookingData.propertyImage}
                      alt={bookingData.propertyName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-sm mb-1">{bookingData.propertyName}</h4>
                      <p className="text-xs text-gray-600">{bookingData.propertyLocation}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in</span>
                      <span className="font-medium">
                        {new Date(bookingData.checkIn).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out</span>
                      <span className="font-medium">
                        {new Date(bookingData.checkOut).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-medium">{bookingData.guests}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        ${bookingData.pricePerNight} × {bookingData.nights} nights
                      </span>
                      <span>${bookingData.pricePerNight * bookingData.nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cleaning fee</span>
                      <span>${bookingData.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service fee</span>
                      <span>${bookingData.serviceFee}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium pt-2">
                      <span>Total (USD)</span>
                      <span>${bookingData.total}</span>
                    </div>
                  </div>

                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-3 text-xs text-yellow-900">
                      <p className="font-medium mb-1">Cancellation Policy</p>
                      <p>
                        Free cancellation for 48 hours. After that, cancel before check-in for a 50% refund.
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Booking Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? All entered information will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Booking</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-red-600 hover:bg-red-700">
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Email Confirmation Dialog */}
      <AlertDialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Confirmation Email</AlertDialogTitle>
            <AlertDialogDescription>
              A confirmation email with booking details and receipt will be sent to:
              <div className="mt-2 p-3 bg-gray-100 rounded text-gray-900 font-medium">
                {guestInfo.email}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSendEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* FAQ Section */}
      <FAQ items={bookingFlowFAQs} title="Booking Process FAQs" />

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
                Please sign in to your account to complete your booking
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Why sign in?</strong> Creating an account helps us protect your booking and provide better customer service.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/property/${propertyId}`)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Go Back
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
