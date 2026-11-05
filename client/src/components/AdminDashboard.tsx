import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Building,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  MoreVertical,
  LogOut,
  Settings,
  BarChart3,
  Mail,
  Shield,
  Bell,
  X,
  Check,
  XCircle,
  Eye,
  Calendar,
  MessageSquare,
  Star,
  FileText,
  UserCheck,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Activity,
  Loader2,
  Trash2,
  Ban,
  Flag,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Lock,
  Palette,
  Database,
  Key,
  Zap,
} from "lucide-react";

type NavigationSection =
  | "dashboard"
  | "users"
  | "host-verification"
  | "properties"
  | "bookings"
  | "reports"
  | "disputes"
  | "reviews";

type ConfirmAction = {
  type: string;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
} | null;

type NotificationType = "success" | "error" | "info" | "warning";

type ContactInfo = {
  name: string;
  email: string;
  phone: string;
} | null;

type DocumentView = {
  hostName: string;
  documents: Array<{ name: string; type: string; url: string; verified: boolean }>;
} | null;

type DisputeDetails = {
  id: string;
  booking: string;
  property: string;
  guest: string;
  host: string;
  issue: string;
  amount: number;
  filed: string;
  status: string;
  priority: string;
  guestStatement: string;
  hostStatement: string;
  evidence: string[];
} | null;

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<NavigationSection>("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(null);
  const [documentView, setDocumentView] = useState<DocumentView>(null);
  const [disputeDetails, setDisputeDetails] = useState<DisputeDetails>(null);
  const [contactParties, setContactParties] = useState<{
    guest: ContactInfo;
    host: ContactInfo;
  } | null>(null);

  // Pagination states
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const usersPerPage = 5;

  // Search and Filter states
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [propertySearch, setPropertySearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [reportFilter, setReportFilter] = useState("all");
  const [disputeFilter, setDisputeFilter] = useState("all");
  const [reviewFilter, setReviewFilter] = useState("all");

  const notificationRef = useRef<HTMLDivElement>(null);

  // Admin Profile Data
  const adminProfile = {
    name: "Alex Thompson",
    email: "alex.thompson@urbanstay.com",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
    avatar: "https://images.unsplash.com/photo-1644268756918-16348d1bc619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMGFkbWluJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3Nzc2Mzk1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    joinDate: "January 2024",
    department: "Platform Operations",
    location: "San Francisco, CA",
    permissions: ["Full Access", "User Management", "Financial Operations", "System Configuration"],
  };

  // Platform Statistics
  const platformStats = [
    {
      label: "Total Revenue",
      value: "$2,450,000",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Active Users",
      value: "45,234",
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Properties",
      value: "10,567",
      change: "+15.3%",
      trend: "up" as const,
      icon: Building,
      color: "bg-purple-100 text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Bookings This Month",
      value: "3,842",
      change: "-2.1%",
      trend: "down" as const,
      icon: Calendar,
      color: "bg-orange-100 text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Pending Verifications",
      value: "24",
      change: "+5",
      trend: "up" as const,
      icon: UserCheck,
      color: "bg-yellow-100 text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Active Disputes",
      value: "8",
      change: "-3",
      trend: "down" as const,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  // Users Data
  const allUsers = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@email.com", type: "Guest", status: "active", joined: "2026-04-28", bookings: 12, spent: 4250 },
    { id: 2, name: "Michael Chen", email: "m.chen@email.com", type: "Host", status: "active", joined: "2026-04-27", properties: 3, earnings: 18500 },
    { id: 3, name: "Emma Williams", email: "emma.w@email.com", type: "Guest", status: "suspended", joined: "2026-04-26", bookings: 2, spent: 680 },
    { id: 4, name: "David Brown", email: "d.brown@email.com", type: "Host", status: "active", joined: "2026-04-25", properties: 1, earnings: 5200 },
    { id: 5, name: "Lisa Anderson", email: "lisa.a@email.com", type: "Guest", status: "active", joined: "2026-04-24", bookings: 8, spent: 2950 },
    { id: 6, name: "James Wilson", email: "j.wilson@email.com", type: "Both", status: "active", joined: "2026-04-20", bookings: 5, properties: 2 },
    { id: 7, name: "Maria Garcia", email: "maria.g@email.com", type: "Host", status: "pending", joined: "2026-04-19", properties: 1, earnings: 0 },
    { id: 8, name: "Robert Martinez", email: "r.martinez@email.com", type: "Guest", status: "active", joined: "2026-04-15", bookings: 15, spent: 6800 },
  ];

  // Host Verification Requests
  const verificationRequests = [
    {
      id: 1,
      host: "Maria Garcia",
      email: "maria.g@email.com",
      submitted: "2026-04-30",
      property: "Coastal Villa with Ocean View",
      location: "Santa Monica, CA",
      documents: ["ID", "Proof of Ownership", "Insurance"],
      status: "pending",
    },
    {
      id: 2,
      host: "Thomas Anderson",
      email: "t.anderson@email.com",
      submitted: "2026-04-29",
      property: "Downtown Loft Studio",
      location: "Seattle, WA",
      documents: ["ID", "Proof of Ownership"],
      status: "pending",
    },
    {
      id: 3,
      host: "Jennifer Lee",
      email: "jen.lee@email.com",
      submitted: "2026-04-28",
      property: "Mountain Cabin Retreat",
      location: "Aspen, CO",
      documents: ["ID", "Proof of Ownership", "Insurance", "Tax Documents"],
      status: "under-review",
    },
  ];

  // Properties Data
  const allProperties = [
    {
      id: 1,
      name: "Modern Downtown Loft",
      host: "Sarah Johnson",
      location: "Manhattan, NY",
      price: 185,
      status: "active",
      bookings: 45,
      rating: 4.9,
      revenue: 8325,
    },
    {
      id: 2,
      name: "Luxury Penthouse Suite",
      host: "Michael Chen",
      location: "Los Angeles, CA",
      price: 425,
      status: "active",
      bookings: 38,
      rating: 4.8,
      revenue: 16150,
    },
    {
      id: 3,
      name: "Cozy Beach House",
      host: "Emma Williams",
      location: "Miami, FL",
      price: 220,
      status: "pending",
      bookings: 0,
      rating: 0,
      revenue: 0,
    },
    {
      id: 4,
      name: "Urban Studio",
      host: "David Brown",
      location: "Chicago, IL",
      price: 125,
      status: "active",
      bookings: 52,
      rating: 4.7,
      revenue: 6500,
    },
    {
      id: 5,
      name: "Historic Townhouse",
      host: "James Wilson",
      location: "Boston, MA",
      price: 295,
      status: "flagged",
      bookings: 28,
      rating: 4.5,
      revenue: 8260,
    },
  ];

  // Bookings Data
  const allBookings = [
    {
      id: "BK-1234",
      property: "Modern Downtown Loft",
      guest: "John Smith",
      host: "Sarah Johnson",
      checkIn: "May 15, 2026",
      checkOut: "May 18, 2026",
      amount: 1086,
      status: "confirmed",
      nights: 3,
    },
    {
      id: "BK-1235",
      property: "Luxury Penthouse",
      guest: "Jane Doe",
      host: "Michael Chen",
      checkIn: "May 20, 2026",
      checkOut: "May 26, 2026",
      amount: 2550,
      status: "confirmed",
      nights: 6,
    },
    {
      id: "BK-1236",
      property: "Beach House",
      guest: "Bob Wilson",
      host: "Emma Williams",
      checkIn: "May 18, 2026",
      checkOut: "May 24, 2026",
      amount: 1320,
      status: "pending",
      nights: 6,
    },
    {
      id: "BK-1237",
      property: "Urban Studio",
      guest: "Alice Brown",
      host: "David Brown",
      checkIn: "May 22, 2026",
      checkOut: "May 28, 2026",
      amount: 750,
      status: "confirmed",
      nights: 6,
    },
    {
      id: "BK-1238",
      property: "Historic Townhouse",
      guest: "Charlie Davis",
      host: "James Wilson",
      checkIn: "May 10, 2026",
      checkOut: "May 12, 2026",
      amount: 590,
      status: "cancelled",
      nights: 2,
    },
  ];

  // Reported Listings
  const reportedListings = [
    {
      id: 1,
      property: "Modern Downtown Loft",
      host: "Sarah Johnson",
      reporter: "Anonymous",
      reason: "Misleading photos",
      date: "2026-04-30",
      status: "investigating",
      severity: "medium",
    },
    {
      id: 2,
      property: "Historic Townhouse",
      host: "James Wilson",
      reporter: "Guest User",
      reason: "Safety concerns",
      date: "2026-04-29",
      status: "resolved",
      severity: "high",
    },
    {
      id: 3,
      property: "Beach House",
      host: "Emma Williams",
      reporter: "Multiple Users",
      reason: "Pricing inconsistency",
      date: "2026-04-28",
      status: "pending",
      severity: "low",
    },
  ];

  // Disputes
  const disputes = [
    {
      id: "DIS-001",
      booking: "BK-1234",
      property: "Modern Downtown Loft",
      guest: "John Smith",
      host: "Sarah Johnson",
      issue: "Property not as described",
      amount: 1086,
      filed: "2026-04-28",
      status: "open",
      priority: "high",
    },
    {
      id: "DIS-002",
      booking: "BK-1235",
      property: "Luxury Penthouse",
      guest: "Jane Doe",
      host: "Michael Chen",
      issue: "Cleanliness issues",
      amount: 2550,
      filed: "2026-04-27",
      status: "in-review",
      priority: "medium",
    },
    {
      id: "DIS-003",
      booking: "BK-1238",
      property: "Historic Townhouse",
      guest: "Charlie Davis",
      host: "James Wilson",
      issue: "Cancellation policy dispute",
      amount: 590,
      filed: "2026-04-26",
      status: "resolved",
      priority: "low",
    },
  ];

  // Reviews Data
  const allReviews = [
    {
      id: 1,
      property: "Modern Downtown Loft",
      guest: "John Smith",
      host: "Sarah Johnson",
      rating: 5,
      comment: "Amazing stay! Everything was perfect.",
      date: "2026-04-25",
      status: "published",
      flagged: false,
    },
    {
      id: 2,
      property: "Luxury Penthouse",
      guest: "Jane Doe",
      host: "Michael Chen",
      rating: 4,
      comment: "Great location but a bit pricey.",
      date: "2026-04-24",
      status: "published",
      flagged: false,
    },
    {
      id: 3,
      property: "Beach House",
      guest: "Bob Wilson",
      host: "Emma Williams",
      rating: 2,
      comment: "Not what was advertised. Very disappointed.",
      date: "2026-04-23",
      status: "flagged",
      flagged: true,
    },
    {
      id: 4,
      property: "Urban Studio",
      guest: "Alice Brown",
      host: "David Brown",
      rating: 5,
      comment: "Perfect for a short stay in the city!",
      date: "2026-04-22",
      status: "published",
      flagged: false,
    },
  ];

  // Admin Notifications
  const adminNotifications = [
    { id: 1, type: "verification", message: "New host verification request from Maria Garcia", time: "5 min ago", read: false },
    { id: 2, type: "dispute", message: "New dispute filed for booking BK-1234", time: "15 min ago", read: false },
    { id: 3, type: "report", message: "Property reported: Modern Downtown Loft", time: "1 hour ago", read: false },
    { id: 4, type: "review", message: "Flagged review needs moderation", time: "2 hours ago", read: true },
    { id: 5, type: "system", message: "System maintenance scheduled for tonight", time: "3 hours ago", read: true },
  ];

  const unreadNotifications = adminNotifications.filter(n => !n.read).length;

  // Notification Handler
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Confirmation Dialog Handler
  const handleConfirmAction = (action: ConfirmAction) => {
    setConfirmAction(action);
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) return;

    setLoadingAction(confirmAction.type);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    confirmAction.onConfirm();
    setLoadingAction(null);
    setConfirmAction(null);
  };

  // User Actions
  const handleSuspendUser = (userId: number, userName: string) => {
    handleConfirmAction({
      type: 'suspend-user',
      title: 'Suspend User?',
      message: `Are you sure you want to suspend ${userName}? They will no longer be able to access the platform.`,
      confirmText: 'Suspend User',
      cancelText: 'Cancel',
      onConfirm: () => {
        showNotification('success', `User ${userName} has been suspended`);
      },
    });
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    handleConfirmAction({
      type: 'delete-user',
      title: 'Delete User?',
      message: `Are you sure you want to permanently delete ${userName}? This action cannot be undone.`,
      confirmText: 'Delete User',
      cancelText: 'Cancel',
      onConfirm: () => {
        showNotification('success', `User ${userName} has been deleted`);
      },
    });
  };

  // Host Verification Actions
  const handleApproveHost = (hostName: string) => {
    handleConfirmAction({
      type: 'approve-host',
      title: 'Approve Host?',
      message: `Are you sure you want to approve ${hostName} as a verified host? They will be able to start accepting bookings.`,
      confirmText: 'Approve',
      cancelText: 'Cancel',
      onConfirm: () => {
        showNotification('success', `${hostName} has been approved as a verified host`);
      },
    });
  };

  const handleRejectHost = (hostName: string) => {
    handleConfirmAction({
      type: 'reject-host',
      title: 'Reject Host?',
      message: `Are you sure you want to reject ${hostName}'s verification request? They will be notified of this decision.`,
      confirmText: 'Reject',
      cancelText: 'Cancel',
      onConfirm: () => {
        showNotification('info', `${hostName}'s verification request has been rejected`);
      },
    });
  };

  // Property Actions
  const handleFlagProperty = (propertyId: number, propertyName: string) => {
    handleConfirmAction({
      type: 'flag-property',
      title: 'Flag Property?',
      message: `Are you sure you want to flag "${propertyName}"? It will be hidden from search until reviewed.`,
      confirmText: 'Flag Property',
      cancelText: 'Cancel',
      onConfirm: () => {
        showNotification('warning', `Property "${propertyName}" has been flagged`);
      },
    });
  };

  const handleDelistProperty = (propertyId: number, propertyName: string) => {
    handleConfirmAction({
      type: 'delist-property',
      title: 'Delist Property?',
      message: `Are you sure you want to permanently delist "${propertyName}"? This will cancel all future bookings.`,
      confirmText: 'Delist Property',
      cancelText: 'Cancel',
      onConfirm: () => {
        showNotification('success', `Property "${propertyName}" has been delisted`);
      },
    });
  };

  // Dispute Actions
  const handleResolveDispute = (disputeId: string) => {
    handleConfirmAction({
      type: 'resolve-dispute',
      title: 'Resolve Dispute?',
      message: `Are you sure you want to mark dispute ${disputeId} as resolved? Both parties will be notified.`,
      confirmText: 'Resolve',
      cancelText: 'Cancel',
      onConfirm: () => {
        showNotification('success', `Dispute ${disputeId} has been resolved`);
      },
    });
  };

  // Review Actions
  const handleRemoveReview = (reviewId: number) => {
    handleConfirmAction({
      type: 'remove-review',
      title: 'Remove Review?',
      message: 'Are you sure you want to remove this review? This action cannot be undone.',
      confirmText: 'Remove Review',
      cancelText: 'Cancel',
      onConfirm: () => {
        showNotification('success', 'Review has been removed');
      },
    });
  };

  // Click outside handler for notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Contact Host Handler
  const handleContactHost = (hostName: string, email: string, phone: string) => {
    setContactInfo({ name: hostName, email, phone });
  };

  // View Documents Handler
  const handleViewDocuments = (hostName: string) => {
    setDocumentView({
      hostName,
      documents: [
        { name: "Government ID", type: "ID Verification", url: "#", verified: true },
        { name: "Proof of Ownership", type: "Property Documents", url: "#", verified: true },
        { name: "Insurance Certificate", type: "Insurance", url: "#", verified: true },
        { name: "Tax Documents", type: "Financial", url: "#", verified: false },
      ],
    });
  };

  // View Dispute Details Handler
  const handleViewDisputeDetails = (disputeId: string) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (dispute) {
      setDisputeDetails({
        ...dispute,
        guestStatement: "The property was not as described in the listing. There were cleanliness issues and several amenities mentioned were not available.",
        hostStatement: "The property was cleaned before check-in. All amenities listed were available. The guest may have unrealistic expectations.",
        evidence: ["Photo evidence uploaded by guest", "Cleaning service receipt", "Communication logs"],
      });
    }
  };

  // Contact Parties Handler
  const handleContactParties = (guestName: string, hostName: string) => {
    setContactParties({
      guest: { name: guestName, email: `${guestName.toLowerCase().replace(' ', '.')}@email.com`, phone: "+1 (555) 123-4567" },
      host: { name: hostName, email: `${hostName.toLowerCase().replace(' ', '.')}@email.com`, phone: "+1 (555) 987-6543" },
    });
  };

  // Filter users
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesFilter = userFilter === "all" || user.type.toLowerCase() === userFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination for users
  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentUserPage - 1) * usersPerPage,
    currentUserPage * usersPerPage
  );

  // Filter properties
  const filteredProperties = allProperties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(propertySearch.toLowerCase()) ||
                          property.location.toLowerCase().includes(propertySearch.toLowerCase());
    const matchesFilter = propertyFilter === "all" || property.status === propertyFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter bookings
  const filteredBookings = allBookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          booking.guest.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesFilter = bookingFilter === "all" || booking.status === bookingFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter reports
  const filteredReports = reportedListings.filter(report => {
    return reportFilter === "all" || report.status === reportFilter;
  });

  // Filter disputes
  const filteredDisputes = disputes.filter(dispute => {
    return disputeFilter === "all" || dispute.status === disputeFilter;
  });

  // Filter reviews
  const filteredReviews = allReviews.filter(review => {
    return reviewFilter === "all" || review.status === reviewFilter;
  });

  // Logout handler
  const handleLogout = () => {
    handleConfirmAction({
      type: 'logout',
      title: 'Sign Out?',
      message: 'Are you sure you want to sign out from the admin dashboard?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      onConfirm: () => {
        logout();
        showNotification('success', 'You have been signed out successfully');
        setTimeout(() => {
          navigate("/");
        }, 800);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r flex flex-col fixed left-0 top-0 bottom-0 z-30">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">UrbanStay</h1>
              <p className="text-xs text-gray-600">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "dashboard"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSection("users")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "users"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Users</span>
            </button>

            <button
              onClick={() => setActiveSection("host-verification")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "host-verification"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span className="font-medium">Host Verification</span>
              {verificationRequests.length > 0 && (
                <span className="ml-auto bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                  {verificationRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection("properties")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "properties"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Building className="w-5 h-5" />
              <span className="font-medium">Properties</span>
            </button>

            <button
              onClick={() => setActiveSection("bookings")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "bookings"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Bookings</span>
            </button>

            <button
              onClick={() => setActiveSection("reports")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "reports"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Flag className="w-5 h-5" />
              <span className="font-medium">Reported Listings</span>
              {reportedListings.filter(r => r.status !== "resolved").length > 0 && (
                <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  {reportedListings.filter(r => r.status !== "resolved").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection("disputes")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "disputes"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Disputes</span>
              {disputes.filter(d => d.status !== "resolved").length > 0 && (
                <span className="ml-auto bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
                  {disputes.filter(d => d.status !== "resolved").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection("reviews")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === "reviews"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Star className="w-5 h-5" />
              <span className="font-medium">Reviews</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeSection === "dashboard" && "Dashboard Overview"}
                  {activeSection === "users" && "User Management"}
                  {activeSection === "host-verification" && "Host Verification"}
                  {activeSection === "properties" && "Property Management"}
                  {activeSection === "bookings" && "Booking Analytics"}
                  {activeSection === "reports" && "Reported Listings"}
                  {activeSection === "disputes" && "Dispute Management"}
                  {activeSection === "reviews" && "Review Monitoring"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {activeSection === "dashboard" && "Monitor platform performance and key metrics"}
                  {activeSection === "users" && "Manage users, hosts, and guests"}
                  {activeSection === "host-verification" && "Review and approve host verification requests"}
                  {activeSection === "properties" && "Moderate and manage property listings"}
                  {activeSection === "bookings" && "Track and analyze booking data"}
                  {activeSection === "reports" && "Review reported listings and take action"}
                  {activeSection === "disputes" && "Manage and resolve booking disputes"}
                  {activeSection === "reviews" && "Monitor and moderate user reviews"}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-6 h-6 text-gray-600" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border">
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          <span className="text-sm text-gray-600">{unreadNotifications} new</span>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {adminNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                              !notif.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <p className="text-sm text-gray-900">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-6 h-6 text-gray-600" />
                </button>

                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center space-x-3 pl-4 border-l hover:bg-gray-50 rounded-lg transition-colors p-2 cursor-pointer"
                >
                  <img
                    src={adminProfile.avatar}
                    alt={adminProfile.name}
                    className="w-10 h-10 rounded-full object-cover object-top"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{adminProfile.name}</p>
                    <p className="text-xs text-gray-600">{adminProfile.role}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platformStats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
                        <div className="flex items-center space-x-2">
                          {stat.trend === "up" ? (
                            <ArrowUp className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm font-semibold ${
                            stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                          }`}>
                            {stat.change}
                          </span>
                          <span className="text-sm text-gray-500">vs last month</span>
                        </div>
                      </div>
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900">Monthly Revenue</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { month: "Jan", amount: 185000, percentage: 75 },
                      { month: "Feb", amount: 210000, percentage: 85 },
                      { month: "Mar", amount: 198000, percentage: 80 },
                      { month: "Apr", amount: 245000, percentage: 100 },
                    ].map((data) => (
                      <div key={data.month}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{data.month}</span>
                          <span className="text-sm font-semibold text-gray-900">${(data.amount / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${data.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                    <Activity className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    {[
                      { action: "New booking confirmed", time: "2 min ago", type: "success" },
                      { action: "Host verification pending", time: "15 min ago", type: "warning" },
                      { action: "Dispute resolved", time: "1 hour ago", type: "success" },
                      { action: "Property flagged", time: "2 hours ago", type: "error" },
                      { action: "New review submitted", time: "3 hours ago", type: "info" },
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === "success" ? "bg-emerald-500" :
                          activity.type === "warning" ? "bg-orange-500" :
                          activity.type === "error" ? "bg-red-500" : "bg-blue-500"
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-sm text-gray-600 mb-2">Avg. Booking Value</h3>
                  <p className="text-2xl font-bold text-gray-900">$1,285</p>
                  <p className="text-sm text-emerald-600 mt-2">+8.5% from last month</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-sm text-gray-600 mb-2">Platform Growth</h3>
                  <p className="text-2xl font-bold text-gray-900">12.3%</p>
                  <p className="text-sm text-emerald-600 mt-2">+2.1% from last month</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-sm text-gray-600 mb-2">Customer Satisfaction</h3>
                  <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                  <p className="text-sm text-emerald-600 mt-2">+0.2 from last month</p>
                </div>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeSection === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="guest">Guest</option>
                    <option value="host">Host</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="w-5 h-5" />
                  <span>Export Users</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Activity</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.type === "Host" ? "bg-purple-100 text-purple-700" :
                              user.type === "Guest" ? "bg-blue-100 text-blue-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {user.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === "active" ? "bg-emerald-100 text-emerald-700" :
                              user.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              {user.type === "Guest" || user.type === "Both" ? (
                                <p className="text-gray-900">{user.bookings} bookings</p>
                              ) : null}
                              {user.type === "Host" || user.type === "Both" ? (
                                <p className="text-gray-900">{user.properties} properties</p>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleSuspendUser(user.id, user.name)}
                                className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Suspend user"
                              >
                                <Ban className="w-4 h-4 text-yellow-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>
                  Showing {((currentUserPage - 1) * usersPerPage) + 1} to {Math.min(currentUserPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentUserPage(prev => Math.max(1, prev - 1))}
                    disabled={currentUserPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalUserPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentUserPage(idx + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        currentUserPage === idx + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentUserPage(prev => Math.min(totalUserPages, prev + 1))}
                    disabled={currentUserPage === totalUserPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Host Verification Section */}
          {activeSection === "host-verification" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <UserCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Host Verification Process</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Review submitted documents and approve or reject host verification requests. All decisions will be logged and hosts will be notified.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {verificationRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{request.host}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            request.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            request.status === "under-review" ? "bg-blue-100 text-blue-700" :
                            "bg-emerald-100 text-emerald-700"
                          }`}>
                            {request.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        <p className="text-sm text-gray-500 mt-1">Submitted: {request.submitted}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Property</p>
                        <p className="text-sm text-gray-900">{request.property}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-900">{request.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Documents Submitted</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {request.documents.map((doc, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center space-x-1">
                              <FileText className="w-3 h-3" />
                              <span>{doc}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-4 border-t">
                      <button
                        onClick={() => handleApproveHost(request.host)}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectHost(request.host)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleViewDocuments(request.host)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Documents</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Properties Section */}
          {activeSection === "properties" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={propertySearch}
                      onChange={(e) => setPropertySearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                  <select
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Host</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProperties.map((property) => (
                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{property.name}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{property.host}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{property.location}</td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">${property.price}</p>
                            <p className="text-xs text-gray-500">per night</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <p className="text-gray-900">{property.bookings} bookings</p>
                              {property.rating > 0 && (
                                <div className="flex items-center space-x-1 text-yellow-500">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="text-gray-900">{property.rating}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              property.status === "active" ? "bg-emerald-100 text-emerald-700" :
                              property.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {property.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleFlagProperty(property.id, property.name)}
                                className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Flag property"
                              >
                                <Flag className="w-4 h-4 text-yellow-600" />
                              </button>
                              <button
                                onClick={() => handleDelistProperty(property.id, property.name)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delist property"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Section */}
          {activeSection === "bookings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                  <select
                    value={bookingFilter}
                    onChange={(e) => setBookingFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="w-5 h-5" />
                  <span>Export Report</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Booking ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Host</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">{booking.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{booking.property}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{booking.guest}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.host}</td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <p className="text-gray-900">{booking.checkIn}</p>
                              <p className="text-gray-500">{booking.nights} nights</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900">${booking.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                              booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reported Listings Section */}
          {activeSection === "reports" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <select
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Reports</option>
                  <option value="pending">Pending</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{report.property}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.severity === "high" ? "bg-red-100 text-red-700" :
                            report.severity === "medium" ? "bg-orange-100 text-orange-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {report.severity} severity
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.status === "resolved" ? "bg-emerald-100 text-emerald-700" :
                            report.status === "investigating" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Hosted by: {report.host}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Reason</p>
                        <p className="text-sm text-gray-900">{report.reason}</p>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>Reported by: {report.reporter}</span>
                        <span>Date: {report.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-4 border-t">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Eye className="w-4 h-4" />
                        <span>Investigate</span>
                      </button>
                      <button
                        onClick={() => handleContactHost(report.host, `${report.host.toLowerCase().replace(' ', '.')}@email.com`, "+1 (555) 234-5678")}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Contact Host</span>
                      </button>
                      {report.status !== "resolved" && (
                        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                          <Check className="w-4 h-4" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disputes Section */}
          {activeSection === "disputes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <select
                  value={disputeFilter}
                  onChange={(e) => setDisputeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Disputes</option>
                  <option value="open">Open</option>
                  <option value="in-review">In Review</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="space-y-4">
                {filteredDisputes.map((dispute) => (
                  <div key={dispute.id} className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-mono font-semibold text-gray-900">{dispute.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            dispute.priority === "high" ? "bg-red-100 text-red-700" :
                            dispute.priority === "medium" ? "bg-orange-100 text-orange-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {dispute.priority} priority
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            dispute.status === "resolved" ? "bg-emerald-100 text-emerald-700" :
                            dispute.status === "in-review" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {dispute.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{dispute.property}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Guest</p>
                        <p className="text-sm text-gray-900">{dispute.guest}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Host</p>
                        <p className="text-sm text-gray-900">{dispute.host}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Issue</p>
                        <p className="text-sm text-gray-900">{dispute.issue}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Amount in Dispute</p>
                        <p className="text-sm font-semibold text-gray-900">${dispute.amount}</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      Filed: {dispute.filed} • Booking: {dispute.booking}
                    </div>

                    <div className="flex items-center space-x-3 pt-4 border-t">
                      {dispute.status !== "resolved" && (
                        <>
                          <button
                            onClick={() => handleResolveDispute(dispute.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                          >
                            <Check className="w-4 h-4" />
                            <span>Resolve Dispute</span>
                          </button>
                          <button
                            onClick={() => handleContactParties(dispute.guest, dispute.host)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Contact Parties</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewDisputeDetails(dispute.id)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {activeSection === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Reviews</option>
                  <option value="published">Published</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>

              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className={`bg-white rounded-xl shadow-sm border p-6 ${
                    review.flagged ? "border-red-200 bg-red-50" : ""
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-gray-900">{review.rating}/5</span>
                          {review.flagged && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              Flagged
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{review.property}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-900 mb-3">{review.comment}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>By: {review.guest}</span>
                        <span>Host: {review.host}</span>
                        <span>{review.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-4 border-t">
                      {review.flagged && (
                        <button
                          onClick={() => handleRemoveReview(review.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove Review</span>
                        </button>
                      )}
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Eye className="w-4 h-4" />
                        <span>View Full Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmAction.title}</h3>
            <p className="text-gray-600 mb-6">{confirmAction.message}</p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={loadingAction !== null}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {confirmAction.cancelText}
              </button>
              <button
                onClick={executeConfirmAction}
                disabled={loadingAction !== null}
                className={`flex-1 px-4 py-2 rounded-lg text-white flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  confirmAction.type.includes('delete') || confirmAction.type.includes('reject') || confirmAction.type.includes('suspend') || confirmAction.type.includes('remove')
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loadingAction ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{confirmAction.confirmText}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`rounded-lg shadow-2xl p-4 flex items-center space-x-3 min-w-[300px] ${
            notification.type === 'success' ? 'bg-emerald-600' :
            notification.type === 'error' ? 'bg-red-600' :
            notification.type === 'warning' ? 'bg-orange-600' :
            'bg-blue-600'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-white" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5 text-white" />}
            {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-white" />}
            {notification.type === 'info' && <AlertTriangle className="w-5 h-5 text-white" />}
            <p className="text-white font-medium flex-1">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Admin Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32 rounded-t-xl"></div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="px-8 pb-8">
                <div className="flex items-end space-x-6 -mt-16">
                  <img
                    src={adminProfile.avatar}
                    alt={adminProfile.name}
                    className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover object-top"
                  />
                  <div className="pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{adminProfile.name}</h2>
                    <p className="text-gray-600">{adminProfile.role}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="text-sm font-medium text-gray-900">{adminProfile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Phone</p>
                          <p className="text-sm font-medium text-gray-900">{adminProfile.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Location</p>
                          <p className="text-sm font-medium text-gray-900">{adminProfile.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Department</p>
                          <p className="text-sm font-medium text-gray-900">{adminProfile.department}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
                    <div className="flex flex-wrap gap-2">
                      {adminProfile.permissions.map((permission, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Member Since</span>
                        <span className="font-medium text-gray-900">{adminProfile.joinDate}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Account Status</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Two-Factor Authentication</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          Enabled
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Platform Settings */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Platform Settings</h3>
                </div>
                <div className="space-y-4 pl-8">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Maintenance Mode</p>
                      <p className="text-sm text-gray-600">Temporarily disable platform access for maintenance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">New User Registration</p>
                      <p className="text-sm text-gray-600">Allow new users to create accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Send email notifications to users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                </div>
                <div className="space-y-4 pl-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block mb-2 font-medium text-gray-900">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Require Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Mandatory 2FA for all admin accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block mb-2 font-medium text-gray-900">Password Policy</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Standard (8+ characters)</option>
                      <option>Strong (12+ characters, mixed case, numbers, symbols)</option>
                      <option>Maximum (16+ characters, all requirements)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Settings */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
                </div>
                <div className="space-y-4 pl-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block mb-2 font-medium text-gray-900">Platform Fee (%)</label>
                    <input
                      type="number"
                      defaultValue="12"
                      step="0.5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block mb-2 font-medium text-gray-900">Currency</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>CAD - Canadian Dollar</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Instant Payouts</p>
                      <p className="text-sm text-gray-600">Allow hosts to receive instant payouts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Appearance Settings */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Palette className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
                </div>
                <div className="space-y-4 pl-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block mb-2 font-medium text-gray-900">Theme</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>Auto (System)</option>
                    </select>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block mb-2 font-medium text-gray-900">Primary Color</label>
                    <div className="flex space-x-3">
                      <button className="w-12 h-12 bg-blue-600 rounded-lg border-2 border-blue-800"></button>
                      <button className="w-12 h-12 bg-purple-600 rounded-lg hover:border-2 hover:border-gray-400"></button>
                      <button className="w-12 h-12 bg-emerald-600 rounded-lg hover:border-2 hover:border-gray-400"></button>
                      <button className="w-12 h-12 bg-orange-600 rounded-lg hover:border-2 hover:border-gray-400"></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data & Storage */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Data & Storage</h3>
                </div>
                <div className="space-y-4 pl-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">Database Storage</p>
                      <span className="text-sm text-gray-600">245 GB / 500 GB</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "49%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Automatic Backups</p>
                      <p className="text-sm text-gray-600">Daily automated database backups</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* API Settings */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Key className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">API Settings</h3>
                </div>
                <div className="space-y-4 pl-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block mb-2 font-medium text-gray-900">API Rate Limit (requests/minute)</label>
                    <input
                      type="number"
                      defaultValue="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Public API Access</p>
                      <p className="text-sm text-gray-600">Allow external API integrations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSettingsModal(false);
                    showNotification("success", "Settings saved successfully");
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info Modal */}
      {contactInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Contact Host</h3>
              <button
                onClick={() => setContactInfo(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Host Name</p>
                <p className="font-semibold text-gray-900">{contactInfo.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                    <p className="font-medium text-gray-900">{contactInfo.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(contactInfo.email);
                      showNotification("success", "Email copied to clipboard");
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                    <p className="font-medium text-gray-900">{contactInfo.phone}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(contactInfo.phone);
                      showNotification("success", "Phone number copied to clipboard");
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => window.open(`mailto:${contactInfo.email}`, '_blank')}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </button>
              <button
                onClick={() => setContactInfo(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Documents Modal */}
      {documentView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Verification Documents - {documentView.hostName}</h3>
              <button
                onClick={() => setDocumentView(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {documentView.documents.map((doc, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {doc.verified ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setDocumentView(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Verify All Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Parties Modal */}
      {contactParties && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Contact Dispute Parties</h3>
              <button
                onClick={() => setContactParties(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guest Contact */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Guest</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{contactParties.guest.name}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="text-sm font-medium text-gray-900">{contactParties.guest.email}</p>
                      </div>
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{contactParties.guest.phone}</p>
                      </div>
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(`mailto:${contactParties.guest.email}`, '_blank')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Email Guest
                  </button>
                </div>
              </div>

              {/* Host Contact */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Host</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{contactParties.host.name}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="text-sm font-medium text-gray-900">{contactParties.host.email}</p>
                      </div>
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{contactParties.host.phone}</p>
                      </div>
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(`mailto:${contactParties.host.email}`, '_blank')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Email Host
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setContactParties(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Email Both Parties
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Details Modal */}
      {disputeDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Dispute Details - {disputeDetails.id}</h3>
                <p className="text-sm text-gray-600 mt-1">Filed on {disputeDetails.filed}</p>
              </div>
              <button
                onClick={() => setDisputeDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Dispute Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Property</p>
                  <p className="font-semibold text-gray-900">{disputeDetails.property}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                  <p className="font-semibold text-gray-900">{disputeDetails.booking}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Amount in Dispute</p>
                  <p className="font-semibold text-gray-900">${disputeDetails.amount}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Priority</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    disputeDetails.priority === "high" ? "bg-red-100 text-red-700" :
                    disputeDetails.priority === "medium" ? "bg-orange-100 text-orange-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {disputeDetails.priority}
                  </span>
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Issue</h4>
                <p className="p-4 bg-gray-50 rounded-lg text-gray-900">{disputeDetails.issue}</p>
              </div>

              {/* Guest Statement */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Guest Statement</h4>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {disputeDetails.guest.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">{disputeDetails.guest}</p>
                      <p className="text-gray-700">{disputeDetails.guestStatement}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Statement */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Host Statement</h4>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {disputeDetails.host.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">{disputeDetails.host}</p>
                      <p className="text-gray-700">{disputeDetails.hostStatement}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Evidence Submitted</h4>
                <div className="space-y-2">
                  {disputeDetails.evidence.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">{item}</span>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setDisputeDetails(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDisputeDetails(null);
                  handleResolveDispute(disputeDetails.id);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Resolve Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
