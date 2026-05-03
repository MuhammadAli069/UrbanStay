import { Routes, Route } from "react-router-dom";

import { RootLayout } from "./components/RootLayout";
import { HostDashboard } from "./components/HostDashboard";
import { AdminDashboard } from "./components/AdminDashboard";

import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";

import { PropertyListings } from "./components/PropertyListings";
import { PropertyDetails } from "./components/PropertyDetails";
import { SavedProperties } from "./components/SavedProperties";
import { UserProfile } from "./components/UserProfile";

import Adventures from "./components/Adventures";
import AdventureDetails from "./components/AdventureDetails";

import TourGuides from "./components/TourGuides";
import TourGuideDetails from "./components/TourGuideDetails";

import { ListProperty } from "./components/ListProperty";

function App() {
  return (
    <Routes>

      {/* ================= GUEST ================= */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />

        <Route path="login" element={<Login role="guest" />} />
        <Route path="host-login" element={<Login role="host" />} />
        <Route path="admin-login" element={<Login role="admin" />} />

        <Route path="listings" element={<PropertyListings />} />
        <Route path="saved" element={<SavedProperties />} />
        <Route path="profile" element={<UserProfile />} />

        <Route path="property/:id" element={<PropertyDetails />} />

        <Route path="adventures" element={<Adventures />} />
        <Route path="adventure/:id" element={<AdventureDetails />} />

        <Route path="tour-guides" element={<TourGuides />} />
        <Route path="tour-guide/:id" element={<TourGuideDetails />} />
      </Route>

      {/* ================= HOST ================= */}
      <Route path="/host" element={<HostDashboard />}>
        <Route index element={<ListProperty />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  );
}

export default App;