import { Routes, Route } from "react-router-dom";

import { RootLayout } from "./components/RootLayout";
import { RequireAuth } from "./components/auth/RequireAuth";
import { ScrollToTop } from "./components/ScrollToTop";

import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";

import { PropertyListings } from "./components/PropertyListings";
import { PropertyDetails } from "./components/PropertyDetails";
import { BookingFlow } from "./components/BookingFlow";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { SavedProperties } from "./components/SavedProperties";
import { UserProfile } from "./components/UserProfile";
import { ListProperty } from "./components/ListProperty";
import { HostDashboard } from "./components/HostDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { NotFound } from "./components/NotFound";

import Adventures from "./components/Adventures";
import AdventureDetails from "./components/AdventureDetails";
import TourGuides from "./components/TourGuides";
import TourGuideDetails from "./components/TourGuideDetails";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />

          <Route path="listings" element={<PropertyListings />} />
          <Route path="property/:id" element={<PropertyDetails />} />
          <Route path="saved" element={<SavedProperties />} />

          <Route path="adventures" element={<Adventures />} />
          <Route path="adventure/:id" element={<AdventureDetails />} />
          <Route path="tour-guides" element={<TourGuides />} />
          <Route path="tour-guide/:id" element={<TourGuideDetails />} />

          {/* These pages show their own "sign in to continue" prompt. */}
          <Route path="booking/:propertyId" element={<BookingFlow />} />
          <Route path="list-property" element={<ListProperty />} />

          <Route
            path="confirmation/:bookingId"
            element={
              <RequireAuth>
                <BookingConfirmation />
              </RequireAuth>
            }
          />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/host"
          element={
            <RequireAuth roles={["host", "admin"]}>
              <HostDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}
