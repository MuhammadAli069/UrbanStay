import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  DollarSign,
  Calendar,
  Star,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  MapPin,
  Clock,
  Check,
  X,
  AlertCircle,
  Search,
  Filter,
  Download,
  ChevronRight,
  Mail,
  Phone,
  TrendingDown,
  Menu,
  CheckCircle,
  XCircle,
  Info,
  Inbox,
  Send,
  Archive,
  MoreVertical,
  Award,
  Shield,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { propertyImages } from "../data/propertyImages";
import { FAQ } from "../pages/FAQ";
import type { FAQItem } from "../pages/FAQ";
const hostDashboardFAQs: FAQItem[] = [
  {
    question: "How do I become a host on UrbanStay?",
    answer: "Simply create a host account and list your property through our easy step-by-step process. You'll provide property details, upload photos, set pricing, and submit for review. Once approved (usually within 24-48 hours), your listing goes live."
  },
  {
    question: "What fees does UrbanStay charge hosts?",
    answer: "UrbanStay charges a 15% service fee on each booking. This covers payment processing, 24/7 customer support, and platform maintenance. There are no listing fees or monthly subscription costs."
  },
  {
    question: "How and when do I receive payments?",
    answer: "Payments are transferred to your account 24 hours after guest check-in. You can view all earnings, pending payments, and transaction history in the Earnings tab."
  },
  {
    question: "Can I set my own cancellation policy?",
    answer: "Yes! You can choose from flexible, moderate, or strict cancellation policies for each property. Your policy is displayed to guests before they book."
  },
  {
    question: "How do I handle guest issues or complaints?",
    answer: "Contact guests directly through our messaging system. For serious issues, reach out to our 24/7 host support team. Document all issues with photos for insurance claims if needed."
  },
  {
    question: "What happens if a guest damages my property?",
    answer: "All bookings include damage protection. Document damage with photos and file a claim within 48 hours of guest checkout. Our team will review and process valid claims."
  },
  {
    question: "Can I block specific dates on my calendar?",
    answer: "Yes! Use the Calendar tab to block dates when your property is unavailable. You can also set custom pricing for specific dates or seasons."
  },
  {
    question: "How can I improve my listing's performance?",
    answer: "Keep your calendar updated, respond to inquiries within 24 hours, maintain high ratings (4.8+), upload high-quality photos, and competitive pricing. Superhosts receive priority placement in search results."
  }
];

type ActiveView = "overview" | "properties" | "bookings" | "calendar" | "messages" | "reviews" | "earnings" | "settings";

type ConfirmAction = {
  type: 'delete-property' | 'cancel-booking' | 'deactivate-property' | 'logout' | 'save-settings';
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  id?: number | string;
} | null;

export function HostDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ActiveView>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string; type: 'success' | 'error' | 'info'; message: string}>>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  // Host profile data
  const hostProfile = {
    name: "John Doe",
    email: "john.doe@urbanstay.com",
    phone: "+1 (555) 123-4567",
    avatar: "👤",
    joinDate: "January 2024",
    verified: true,
    rating: 4.9,
    totalReviews: 156,
    totalBookings: 234,
    responseRate: 98,
    responseTime: "within 1 hour",
    superhost: true,
    bio: "Experienced host with a passion for providing exceptional stays. I own multiple properties across NYC and love meeting people from around the world.",
    languages: ["English", "Spanish", "French"],
    timeline: [
      { date: "May 1, 2026", event: "Received 5-star review from Jane Doe", type: "review" },
      { date: "Apr 28, 2026", event: "Property 'Luxury Penthouse' booked for May 20-25", type: "booking" },
      { date: "Apr 25, 2026", event: "Added new property 'Cozy Urban Studio'", type: "property" },
      { date: "Apr 20, 2026", event: "Achieved Superhost status", type: "achievement" },
      { date: "Apr 15, 2026", event: "Completed 200 bookings milestone", type: "milestone" },
    ],
    reviewsAboutHost: [
      {
        id: 1,
        guest: "Sarah M.",
        rating: 5,
        comment: "John is an excellent host! Very responsive and accommodating. The property was exactly as described.",
        date: "May 1, 2026",
        property: "Modern Downtown Loft",
      },
      {
        id: 2,
        guest: "Michael R.",
        rating: 5,
        comment: "Great communication throughout our stay. John provided helpful local recommendations.",
        date: "Apr 27, 2026",
        property: "Luxury Penthouse",
      },
      {
        id: 3,
        guest: "Emily L.",
        rating: 4,
        comment: "Very professional host. Quick to respond to our questions.",
        date: "Apr 25, 2026",
        property: "Cozy Studio",
      },
    ],
  };

  // Notification panel data
  const systemNotifications = [
    {
      id: 1,
      type: "booking" as const,
      title: "New booking request",
      message: "John Smith requested to book Modern Downtown Loft",
      time: "5 minutes ago",
      unread: true,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      type: "message" as const,
      title: "New message",
      message: "Jane Doe sent you a message about Luxury Penthouse",
      time: "1 hour ago",
      unread: true,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 3,
      type: "review" as const,
      title: "New review",
      message: "Sarah M. left a 5-star review for Modern Downtown Loft",
      time: "3 hours ago",
      unread: false,
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      id: 4,
      type: "payout" as const,
      title: "Payout processed",
      message: "Your payout of $2,550 has been processed",
      time: "1 day ago",
      unread: false,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      id: 5,
      type: "system" as const,
      title: "System update",
      message: "UrbanStay has been updated with new features",
      time: "2 days ago",
      unread: false,
      icon: Info,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  // Sample data
  const stats = [
    {
      label: "Total Earnings",
      value: "$45,280",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
      bgColor: "bg-emerald-500",
    },
    {
      label: "Active Bookings",
      value: "23",
      change: "+5 this week",
      trend: "up",
      icon: Calendar,
      color: "bg-blue-50 text-blue-600",
      bgColor: "bg-blue-500",
    },
    {
      label: "Avg Rating",
      value: "4.8",
      change: "156 reviews",
      trend: "up",
      icon: Star,
      color: "bg-amber-50 text-amber-600",
      bgColor: "bg-amber-500",
    },
    {
      label: "Properties",
      value: "6",
      change: "+2 this month",
      trend: "up",
      icon: Home,
      color: "bg-purple-50 text-purple-600",
      bgColor: "bg-purple-500",
    },
  ];

  const myProperties = [
    {
      id: 1,
      name: "Modern Downtown Loft",
      location: "Manhattan, New York",
      price: 185,
      rating: 4.9,
      reviews: 127,
      bookings: 45,
      occupancy: 85,
      status: "active",
      image: propertyImages.modernLoft,
      nextBooking: "May 15",
    },
    {
      id: 2,
      name: "Luxury Penthouse Suite",
      location: "Upper East Side, NY",
      price: 425,
      rating: 5.0,
      reviews: 89,
      bookings: 62,
      occupancy: 92,
      status: "active",
      image: propertyImages.luxuryPenthouse,
      nextBooking: "May 20",
    },
    {
      id: 3,
      name: "Cozy Urban Studio",
      location: "Brooklyn, New York",
      price: 125,
      rating: 4.7,
      reviews: 203,
      bookings: 98,
      occupancy: 78,
      status: "active",
      image: propertyImages.cozyStudio,
      nextBooking: "May 18",
    },
  ];

  const upcomingBookings = [
    {
      id: "BK-1234",
      property: "Modern Downtown Loft",
      propertyId: 1,
      guest: "John Smith",
      guestAvatar: "👨",
      checkIn: "May 15, 2026",
      checkOut: "May 20, 2026",
      nights: 5,
      amount: 1086,
      status: "confirmed",
      phone: "+1 234 567 8900",
      email: "john@example.com",
    },
    {
      id: "BK-1235",
      property: "Luxury Penthouse",
      propertyId: 2,
      guest: "Jane Doe",
      guestAvatar: "👩",
      checkIn: "May 20, 2026",
      checkOut: "May 25, 2026",
      nights: 5,
      amount: 2550,
      status: "confirmed",
      phone: "+1 234 567 8901",
      email: "jane@example.com",
    },
    {
      id: "BK-1236",
      property: "Cozy Studio",
      propertyId: 3,
      guest: "Bob Wilson",
      guestAvatar: "👨‍🦰",
      checkIn: "May 18, 2026",
      checkOut: "May 22, 2026",
      nights: 4,
      amount: 625,
      status: "pending",
      phone: "+1 234 567 8902",
      email: "bob@example.com",
    },
  ];

  const messages = [
    {
      id: 1,
      guest: "John Smith",
      avatar: "👨",
      property: "Modern Downtown Loft",
      message: "Hi! What time is check-in? Also, is parking available?",
      time: "2 hours ago",
      unread: true,
      bookingId: "BK-1234",
    },
    {
      id: 2,
      guest: "Jane Doe",
      avatar: "👩",
      property: "Luxury Penthouse",
      message: "Thank you for the wonderful stay! Everything was perfect.",
      time: "5 hours ago",
      unread: false,
      bookingId: "BK-1235",
    },
    {
      id: 3,
      guest: "Bob Wilson",
      avatar: "👨‍🦰",
      property: "Cozy Studio",
      message: "Can I request an early check-in at 12 PM?",
      time: "1 day ago",
      unread: true,
      bookingId: "BK-1236",
    },
  ];

  const reviews = [
    {
      id: 1,
      property: "Modern Downtown Loft",
      propertyId: 1,
      guest: "Sarah M.",
      guestAvatar: "👩",
      rating: 5,
      comment: "Absolutely perfect! The location was fantastic and the apartment was spotless. Would definitely stay again!",
      date: "Apr 28, 2026",
      response: null,
      helpful: 12,
    },
    {
      id: 2,
      property: "Luxury Penthouse",
      propertyId: 2,
      guest: "Michael R.",
      guestAvatar: "👨",
      rating: 5,
      comment: "Stunning views and amazing amenities. The host was very responsive and helpful throughout our stay.",
      date: "Apr 27, 2026",
      response: "Thank you so much for your kind words! We're thrilled you enjoyed your stay.",
      helpful: 8,
    },
    {
      id: 3,
      property: "Cozy Studio",
      propertyId: 3,
      guest: "Emily L.",
      guestAvatar: "👩‍🦱",
      rating: 4,
      comment: "Great value for money. Very comfortable and clean. Only minor issue was street noise at night.",
      date: "Apr 25, 2026",
      response: null,
      helpful: 5,
    },
  ];

  const earningsData = [
    { month: "Jan", amount: 8500, change: 0 },
    { month: "Feb", amount: 9200, change: 8.2 },
    { month: "Mar", amount: 10800, change: 17.4 },
    { month: "Apr", amount: 12450, change: 15.3 },
    { month: "May", amount: 14200, change: 14.1 },
  ];

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleConfirmAction = (action: Omit<ConfirmAction, null>) => {
    setConfirmAction(action);
  };

  const executeConfirmAction = () => {
    if (confirmAction) {
      setLoading(true);
      setTimeout(() => {
        confirmAction.onConfirm();
        setLoading(false);
        setConfirmAction(null);
      }, 1000);
    }
  };

  const handleDeleteProperty = (id: number) => {
    handleConfirmAction({
      type: 'delete-property',
      title: 'Delete Property?',
      message: 'Are you sure you want to delete this property? All bookings and reviews will be removed. This action cannot be undone.',
      confirmText: 'Delete Property',
      cancelText: 'Cancel',
      id,
      onConfirm: () => {
        showNotification('success', 'Property deleted successfully');
      },
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    handleConfirmAction({
      type: 'cancel-booking',
      title: 'Cancel Booking?',
      message: 'Are you sure you want to cancel this booking? The guest will be notified and refunded according to your cancellation policy.',
      confirmText: 'Cancel Booking',
      cancelText: 'Keep Booking',
      id: bookingId,
      onConfirm: () => {
        showNotification('success', 'Booking cancelled successfully');
      },
    });
  };

  const handleSaveSettings = () => {
    handleConfirmAction({
      type: 'save-settings',
      title: 'Save Changes?',
      message: 'Do you want to save these changes to your account settings?',
      confirmText: 'Save Changes',
      cancelText: 'Cancel',
      onConfirm: () => {
        showNotification('success', 'Settings saved successfully');
      },
    });
  };

  const handleLogout = () => {
    handleConfirmAction({
      type: 'logout',
      title: 'Sign Out?',
      message: 'Are you sure you want to sign out from your host dashboard?',
      confirmText: 'Sign Out',
      cancelText: 'Stay',
      onConfirm: () => {
        showNotification('success', 'You have been signed out successfully');
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      },
    });
  };

  const sidebarItems = [
    { id: "overview" as ActiveView, label: "Overview", icon: BarChart3 },
    { id: "properties" as ActiveView, label: "Properties", icon: Home },
    { id: "bookings" as ActiveView, label: "Bookings", icon: Calendar },
    { id: "calendar" as ActiveView, label: "Calendar", icon: Clock },
    { id: "messages" as ActiveView, label: "Messages", icon: MessageSquare, badge: messages.filter(m => m.unread).length },
    { id: "reviews" as ActiveView, label: "Reviews", icon: Star, badge: reviews.filter(r => !r.response).length },
    { id: "earnings" as ActiveView, label: "Earnings", icon: DollarSign },
    { id: "settings" as ActiveView, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} fixed h-full z-40`}>
        {/* Logo */}
        <div className="p-6 border-b flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">UrbanStay</h1>
                <p className="text-xs text-gray-500">Host Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                activeView === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {sidebarCollapsed && item.badge && item.badge > 0 && (
                <span className="absolute right-1 top-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl">
                {sidebarItems.find(item => item.id === activeView)?.label}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {activeView === "overview" && "Monitor your performance and manage your listings"}
                {activeView === "properties" && "Manage and optimize your property listings"}
                {activeView === "bookings" && "View and manage all your bookings"}
                {activeView === "calendar" && "Track availability and reservations"}
                {activeView === "messages" && "Communicate with your guests"}
                {activeView === "reviews" && "Read and respond to guest reviews"}
                {activeView === "earnings" && "Track your revenue and payouts"}
                {activeView === "settings" && "Configure your account preferences"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {systemNotifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-lg hover:shadow-lg transition-shadow cursor-pointer"
              >
                {hostProfile.avatar}
              </button>
            </div>
          </div>
        </header>

        {/* Notification Panel */}
        {showNotificationPanel && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowNotificationPanel(false)}
            />
            <div className="fixed top-16 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-500">
                    {systemNotifications.filter(n => n.unread).length} unread
                  </p>
                </div>
                <button
                  onClick={() => setShowNotificationPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {systemNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                      notif.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${notif.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <notif.icon className={`w-5 h-5 ${notif.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={`text-sm ${notif.unread ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                            {notif.title}
                          </h4>
                          {notif.unread && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{notif.message}</p>
                        <p className="text-xs text-gray-500">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200">
                <button className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                  Mark all as read
                </button>
              </div>
            </div>
          </>
        )}

        {/* Host Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Profile Header */}
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-4xl shadow-xl">
                    {hostProfile.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl">{hostProfile.name}</h2>
                      {hostProfile.verified && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm">Verified</span>
                        </div>
                      )}
                      {hostProfile.superhost && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 rounded-full">
                          <Award className="w-4 h-4" />
                          <span className="text-sm font-semibold">Superhost</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 text-blue-100">
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {hostProfile.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {hostProfile.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Member since {hostProfile.joinDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <p className="text-2xl">{hostProfile.rating}</p>
                  </div>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">{hostProfile.totalReviews}</p>
                  <p className="text-sm text-gray-600">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">{hostProfile.totalBookings}</p>
                  <p className="text-sm text-gray-600">Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">{hostProfile.responseRate}%</p>
                  <p className="text-sm text-gray-600">Response Rate</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="p-6">
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex gap-8">
                    <button className="pb-3 px-1 border-b-2 border-blue-600 text-blue-600 font-semibold">
                      About
                    </button>
                    <button className="pb-3 px-1 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium">
                      Reviews ({hostProfile.reviewsAboutHost.length})
                    </button>
                    <button className="pb-3 px-1 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium">
                      Timeline
                    </button>
                  </nav>
                </div>

                {/* About Tab */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg mb-3">Bio</h3>
                    <p className="text-gray-700 leading-relaxed">{hostProfile.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-lg mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {hostProfile.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg mb-3">Response Time</h3>
                    <p className="text-gray-700">{hostProfile.responseTime}</p>
                  </div>

                  <div>
                    <h3 className="text-lg mb-4">Recent Reviews</h3>
                    <div className="space-y-4">
                      {hostProfile.reviewsAboutHost.map((review) => (
                        <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{review.guest}</p>
                              <p className="text-xs text-gray-500">{review.property}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg mb-4">Activity Timeline</h3>
                    <div className="space-y-3">
                      {hostProfile.timeline.map((event, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{event.event}</p>
                            <p className="text-xs text-gray-500">{event.date}</p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              event.type === 'review'
                                ? 'bg-amber-100 text-amber-700'
                                : event.type === 'booking'
                                ? 'bg-blue-100 text-blue-700'
                                : event.type === 'achievement'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {event.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  confirmAction.type.includes('delete') || confirmAction.type.includes('cancel')
                    ? 'bg-red-100'
                    : 'bg-blue-100'
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    confirmAction.type.includes('delete') || confirmAction.type.includes('cancel')
                      ? 'text-red-600'
                      : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900">{confirmAction.title}</h3>
                  <p className="text-sm text-gray-600">Please confirm your action</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">{confirmAction.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  {confirmAction.cancelText}
                </button>
                <button
                  onClick={executeConfirmAction}
                  disabled={loading}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 ${
                    confirmAction.type.includes('delete') || confirmAction.type.includes('cancel')
                      ? 'bg-red-600'
                      : 'bg-blue-600'
                  }`}
                >
                  {loading ? 'Processing...' : confirmAction.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed top-20 right-6 z-50 space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-in slide-in-from-right ${
                notif.type === 'success' ? 'bg-emerald-50 border border-emerald-200' :
                notif.type === 'error' ? 'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'
              }`}
            >
              {notif.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              {notif.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
              {notif.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
              <p className="text-sm font-medium text-gray-900">{notif.message}</p>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="p-1 hover:bg-white rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Overview */}
          {activeView === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl mb-2">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl mb-2">List a New Property</h3>
                    <p className="text-blue-100">Expand your portfolio and increase your earnings</p>
                  </div>
                  <button
                    onClick={() => showNotification('info', 'Property creation form opened')}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Property</span>
                  </button>
                </div>
              </div>

              {/* Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Bookings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg">Upcoming Bookings</h3>
                    <button
                      onClick={() => setActiveView("bookings")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {upcomingBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                              {booking.guestAvatar}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{booking.guest}</p>
                              <p className="text-sm text-gray-600">{booking.property}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">{booking.checkIn} → {booking.checkOut}</p>
                          <p className="font-bold text-gray-900">${booking.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg">Recent Reviews</h3>
                    <button
                      onClick={() => setActiveView("reviews")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white">
                              {review.guestAvatar}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{review.guest}</p>
                              <p className="text-xs text-gray-500">{review.property}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Earnings Chart Preview */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg">Earnings Overview</h3>
                  <button
                    onClick={() => setActiveView("earnings")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-end justify-between gap-2 h-48">
                  {earningsData.map((data, index) => {
                    const maxAmount = Math.max(...earningsData.map(d => d.amount));
                    const height = (data.amount / maxAmount) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                          <div
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer relative group"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              ${data.amount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{data.month}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Properties Tab - Same as before with confirmation */}
          {activeView === "properties" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => showNotification('info', 'Property creation form opened')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Property</span>
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : myProperties.length === 0 ? (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                  <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl mb-2 text-gray-900">No properties yet</h3>
                  <p className="text-gray-600 mb-6">Start earning by adding your first property</p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Add Your First Property
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myProperties.map((property) => (
                    <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                            property.status === "active"
                              ? "bg-emerald-500/90 text-white"
                              : "bg-amber-500/90 text-white"
                          }`}>
                            {property.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg mb-1 text-gray-900">{property.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {property.location}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="font-semibold text-gray-900">{property.rating}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Reviews</p>
                            <p className="font-semibold text-gray-900">{property.reviews}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Occupancy</p>
                            <p className="font-semibold text-gray-900">{property.occupancy}%</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Next booking</p>
                            <p className="text-sm font-semibold text-gray-900">{property.nextBooking}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl text-gray-900">${property.price}</p>
                            <p className="text-xs text-gray-500">per night</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showNotification('info', 'Opening property view...')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => showNotification('info', 'Opening property editor...')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab - With cancel confirmation */}
          {activeView === "bookings" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">All</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Confirmed</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Pending</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Completed</button>
                <button className="ml-auto flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>

              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                          {booking.guestAvatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-lg text-gray-900">{booking.guest}</p>
                              <p className="text-sm text-gray-600">{booking.property}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">Check-in</p>
                              <p className="text-sm font-medium text-gray-900">{booking.checkIn}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Check-out</p>
                              <p className="text-sm font-medium text-gray-900">{booking.checkOut}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {booking.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {booking.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 min-w-[200px]">
                        <div className="text-right">
                          <p className="text-2xl text-gray-900">${booking.amount}</p>
                          <p className="text-sm text-gray-500">{booking.nights} nights</p>
                        </div>
                        <div className="flex items-center gap-2 w-full">
                          <button
                            onClick={() => showNotification('info', 'Message window opened')}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            Message
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages - Same as before */}
          {activeView === "messages" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-3 divide-x divide-gray-200 h-[600px]">
                {/* Conversations List */}
                <div className="col-span-1 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {messages.map((message) => (
                      <button
                        key={message.id}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          message.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                            {message.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <p className={`text-sm truncate ${message.unread ? 'font-semibold' : 'font-medium'}`}>
                                {message.guest}
                              </p>
                              {message.unread && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1 truncate">{message.property}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{message.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Thread */}
                <div className="col-span-2 flex flex-col">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                        👨
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">John Smith</p>
                        <p className="text-xs text-gray-500">Modern Downtown Loft • BK-1234</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                        👨
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-md">
                          <p className="text-sm text-gray-900">Hi! What time is check-in? Also, is parking available?</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-2">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 flex-row-reverse">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                        You
                      </div>
                      <div className="flex-1 flex flex-col items-end">
                        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-4 max-w-md">
                          <p className="text-sm">Hello! Check-in is at 3 PM. Yes, we have free parking in the building garage. Just show your confirmation at the front desk!</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 mr-2">1 hour ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => showNotification('success', 'Message sent successfully')}
                        className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews - Same as before */}
          {activeView === "reviews" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-5xl mb-2">4.8</p>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < 5 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">156 reviews</p>
                  </div>
                  {["Cleanliness", "Communication", "Check-in"].map((category, index) => (
                    <div key={category}>
                      <p className="text-sm text-gray-600 mb-2">{category}</p>
                      <p className="text-2xl mb-2">{4.7 + index * 0.1}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 rounded-full h-2" style={{ width: `${(4.7 + index * 0.1) * 20}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xl">
                          {review.guestAvatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.guest}</p>
                          <p className="text-sm text-gray-600">{review.property}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>

                    <p className="text-gray-700 mb-4">{review.comment}</p>

                    {review.response ? (
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Your Response:</p>
                        <p className="text-sm text-gray-700">{review.response}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => showNotification('info', 'Opening response editor...')}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Respond to review</span>
                      </button>
                    )}

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                      <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>{review.helpful} found this helpful</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Earnings Tab with Enhanced Visualization */}
          {activeView === "earnings" && (
            <div className="space-y-6">
              {/* Earnings Cards with Symbolic Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">This Month</p>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">+22.5%</span>
                    </div>
                  </div>
                  <p className="text-4xl mb-2">$12,450</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-emerald-500 rounded-full h-2" style={{ width: '87%' }} />
                  </div>
                  <p className="text-xs text-gray-500">87% of monthly goal ($14,300)</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">Last Month</p>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">+15.3%</span>
                    </div>
                  </div>
                  <p className="text-4xl mb-2">$10,180</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-blue-500 rounded-full h-2" style={{ width: '71%' }} />
                  </div>
                  <p className="text-xs text-gray-500">71% of monthly goal</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">All Time</p>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm font-semibold">234 bookings</span>
                    </div>
                  </div>
                  <p className="text-4xl mb-2">$45,280</p>
                  <p className="text-sm text-gray-600">Average $193/booking</p>
                </div>
              </div>

              {/* Enhanced Bar Chart with Growth Indicators */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg">Monthly Revenue Trend</h3>
                    <p className="text-sm text-gray-500">Last 5 months performance</p>
                  </div>
                  <button
                    onClick={() => showNotification('success', 'Report downloaded successfully')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {earningsData.map((data, index) => {
                    const maxAmount = Math.max(...earningsData.map(d => d.amount));
                    const width = (data.amount / maxAmount) * 100;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700 w-12">{data.month}</span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden group">
                              <div
                                className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-500 flex items-center justify-end px-3"
                                style={{ width: `${width}%` }}
                              >
                                <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                  ${data.amount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 w-32">
                            <span className="font-semibold text-gray-900">${data.amount.toLocaleString()}</span>
                            {index > 0 && data.change > 0 && (
                              <div className="flex items-center gap-1 text-emerald-600">
                                <ArrowUp className="w-3 h-3" />
                                <span className="text-xs font-semibold">{data.change.toFixed(1)}%</span>
                              </div>
                            )}
                            {index > 0 && data.change < 0 && (
                              <div className="flex items-center gap-1 text-red-600">
                                <ArrowDown className="w-3 h-3" />
                                <span className="text-xs font-semibold">{Math.abs(data.change).toFixed(1)}%</span>
                              </div>
                            )}
                            {index > 0 && data.change === 0 && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <Minus className="w-3 h-3" />
                                <span className="text-xs font-semibold">0%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Earnings by Property */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg mb-6">Earnings by Property</h3>
                <div className="space-y-4">
                  {myProperties.map((property) => {
                    const revenue = property.price * property.bookings * 0.8;
                    const percentage = (revenue / 45280) * 100;
                    return (
                      <div key={property.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <img src={property.image} alt={property.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <p className="font-semibold text-gray-900">{property.name}</p>
                              <p className="text-sm text-gray-600">{property.bookings} bookings</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl text-gray-900">${revenue.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{percentage.toFixed(1)}% of total</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 rounded-full h-2 transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Calendar Placeholder */}
          {activeView === "calendar" && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl mb-2 text-gray-900">Calendar View</h3>
              <p className="text-gray-600">Interactive calendar coming soon</p>
            </div>
          )}

          {/* Settings - With confirmation */}
          {activeView === "settings" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+1 234 567 8900"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: "Email notifications for new bookings", checked: true },
                    { label: "SMS alerts for check-ins", checked: true },
                    { label: "Weekly earnings summary", checked: false },
                    { label: "Marketing communications", checked: false },
                  ].map((pref, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={pref.checked}
                        onChange={(e) => {
                          if (e.target.checked !== pref.checked) {
                            showNotification('info', `Notification preference updated`);
                          }
                        }}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{pref.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="p-6">
          <FAQ items={hostDashboardFAQs} title="Host FAQs" />
        </div>
      </main>
    </div>
  );
}
