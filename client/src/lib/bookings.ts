// Shapes returned by the /api/bookings endpoints.
export interface ApiBooking {
  id: string;
  reference: string;
  property: { id: number; name: string; location: string; image: string | null } | null;
  guest?: { id: string; name: string; email: string };
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  guestInfo?: { firstName?: string; lastName?: string; email?: string; phone?: string; specialRequests?: string };
  status: "confirmed" | "cancelled";
  displayStatus: "upcoming" | "completed" | "cancelled";
  createdAt: string;
}

/** "2026-05-15T00:00:00Z" -> "May 15, 2026" (dates are stored as UTC days). */
export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";
