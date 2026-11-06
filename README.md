# UrbanStay

**Live demo:** https://urbanstay-nine.vercel.app · demo host login: `host@urbanstay.demo` / `DemoHost123`

A full-stack stays platform: guests browse and book urban properties, adventures and local tour guides; hosts list their places; admins manage the platform.

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS (client) · Express 5 + MongoDB/Mongoose + JWT (server)

## Features

- Property listings stored in MongoDB, with search and filters
- Real bookings: the server calculates the price and rejects dates that are already taken
- Hosts publish listings (with photos) from a multi-step wizard; guests become hosts on their first listing
- Adventures and tour guide directories
- Saved properties (kept across visits)
- Email/password accounts with hashed passwords (bcrypt) and JWT sessions that survive page reloads
- Role-based areas: guest profile, host dashboard (`/host`), admin dashboard (`/admin`)
- Host dashboard with the host's own listings, bookings and earnings; hosts can pause or delete listings and cancel bookings

## Getting started

You need Node 18+ and a MongoDB database (local or a free MongoDB Atlas cluster).

### 1. Server

```bash
cd server
npm install
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm run seed              # loads 30 sample listings (run once)
npm run dev               # http://localhost:5000
```

`npm run seed` also creates a demo host account you can sign in with: **host@urbanstay.demo / DemoHost123**.

Create an admin account (admins can't sign up through the website):

```bash
npm run create-admin -- admin@example.com "StrongPassword" "Admin Name"
```

### 2. Client

```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

In development, Vite forwards every `/api` request to the server on port 5000, so no URLs are hardcoded in the client.
If the server isn't running, the site falls back to the bundled sample listings so the frontend still works as a demo.

## API

| Method | Route                | Auth   | Description                     |
| ------ | -------------------- | ------ | ------------------------------- |
| GET    | `/api/health`        | –      | Health check                    |
| POST   | `/api/auth/register` | –      | Sign up as `guest` or `host`    |
| POST   | `/api/auth/login`    | –      | Returns `{ token, user }`       |
| GET    | `/api/auth/me`       | Bearer | Current user from the token     |
| GET    | `/api/properties`    | –      | Active listings (`?city=&type=&minPrice=&maxPrice=&guests=&q=`) |
| GET    | `/api/properties/:id` | –     | One listing                     |
| GET    | `/api/properties/mine` | Host | My listings with booking stats  |
| POST   | `/api/properties`    | Bearer | Create a listing                |
| PUT    | `/api/properties/:id` | Owner | Update a listing (incl. pause)  |
| DELETE | `/api/properties/:id` | Owner | Delete (blocked if it has upcoming stays) |
| POST   | `/api/bookings`      | Bearer | Book a stay                     |
| GET    | `/api/bookings/mine` | Bearer | My trips                        |
| GET    | `/api/bookings/host` | Host   | Bookings on my listings         |
| GET    | `/api/bookings/:reference` | Bearer | One booking (guest, host or admin) |
| PATCH  | `/api/bookings/:id/cancel` | Bearer | Cancel (guest, host or admin) |

## Project structure

```
client/
  src/
    components/        pages and feature components
      auth/            AuthForm (shared sign-in/sign-up), RequireAuth (route guard)
      ui/              shared UI primitives
    context/           AuthContext (session), SavedPropertiesContext
    data/              sample listings, adventures and guides
    context/PropertiesContext.tsx  listings loaded from the API
    lib/               api.ts (fetch + JWT), bookings.ts, images.ts (photo compression)
server/
  config/db.js         MongoDB connection
  controllers/         route handlers
  middleware/          JWT auth + role checks, error handling
  models/              User (password hashing), Property, Booking
  data/                sample listings used by the seed script
  routes/              API routes
  scripts/             seed.js, createAdmin.js
```

## Notes

- Payment is simulated: card details never leave the browser. The booking itself is real and stored in MongoDB.
- Listing photos are compressed in the browser and stored with the listing. For production, move them to a file store such as Cloudinary or S3.

## Roadmap

- Reviews and ratings written by guests after a stay
- Admin dashboard backed by the API (it still shows sample data)
- Real payments (e.g. Stripe) and email confirmations
