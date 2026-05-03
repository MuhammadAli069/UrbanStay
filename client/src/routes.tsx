import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./components/HomePage";
import { PropertyListings } from "./components/PropertyListings";
import { PropertyDetails } from "./components/PropertyDetails";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { UserProfile } from "./components/UserProfile";
import { SavedProperties } from "./components/SavedProperties";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./components/AdminDashboard";
import { HostDashboard } from "./components/HostDashboard";
import { NotFound } from "./components/NotFound";
import Adventures from "./components/Adventures";
import TourGuides from "./components/TourGuides";
import AdventureDetails from "./components/AdventureDetails";
import TourGuideDetails from "./components/TourGuideDetails";
import { ListProperty } from "./components/ListProperty";
import { BookingFlow } from "./components/BookingFlow";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/host",
    Component: HostDashboard,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "listings", Component: PropertyListings },
      { path: "property/:id", Component: PropertyDetails },
      { path: "booking/:propertyId", Component: BookingFlow },
      { path: "confirmation/:bookingId", Component: BookingConfirmation },
      { path: "profile", Component: UserProfile },
      { path: "saved", Component: SavedProperties },
      { path: "list-property", Component: ListProperty },
      { path: "adventures", Component: Adventures },
      { path: "adventure/:id", Component: AdventureDetails },
      { path: "tour-guides", Component: TourGuides },
      { path: "tour-guide/:id", Component: TourGuideDetails },
      { path: "*", Component: NotFound },
    ],
  },
]);