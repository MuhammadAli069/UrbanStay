import { Search, Calendar, Star, User, Home, Settings, MessageSquare } from 'lucide-react';
import classdiagram from "figma:asset/a0df0a9cd9715913853a65b71bfa4c5cd64edc12.png";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WireframeProps {
  figureNumber: string;
  caption: string;
  children: React.ReactNode;
}

function Wireframe({ figureNumber, caption, children }: WireframeProps) {
  return (
    <div className="mb-12" data-figure={figureNumber}>
      <div className="border-2 border-gray-300 bg-white p-6 rounded-lg shadow-sm" data-wireframe-content>
        {children}
      </div>
      <p className="mt-3 text-center italic text-gray-700" data-caption>
        <strong>Figure {figureNumber}:</strong> {caption}
      </p>
    </div>
  );
}

export function GuestHomepageWireframe() {
  return (
    <Wireframe figureNumber="3.1.1" caption="Guest Homepage with Search Interface">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Home className="size-8 text-blue-600" />
            <span className="text-2xl font-bold">UrbanStay</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 border border-gray-300 rounded-lg">Sign In</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Sign Up</button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl mb-4">Find your perfect stay</h2>
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="block text-sm mb-1">Location</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
                <Search className="size-4 text-gray-400 mr-2" />
                <input type="text" placeholder="Where are you going?" className="outline-none w-full" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Check-in</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
                <Calendar className="size-4 text-gray-400 mr-2" />
                <input type="text" placeholder="Add dates" className="outline-none w-full" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Check-out</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
                <Calendar className="size-4 text-gray-400 mr-2" />
                <input type="text" placeholder="Add dates" className="outline-none w-full" />
              </div>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
            Search Properties
          </button>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { img: 'https://images.unsplash.com/photo-1666282167632-c613fbeb163c?w=400', title: 'Modern Apartment', location: 'Downtown Location', price: '$120' },
            { img: 'https://images.unsplash.com/photo-1603072845032-7b5bd641a82a?w=400', title: 'Luxury Loft', location: 'City Center', price: '$150' },
            { img: 'https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=400', title: 'Cozy Studio', location: 'Uptown District', price: '$95' }
          ].map((property, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={property.img}
                alt={property.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{property.title}</span>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{property.location}</p>
                <p className="text-sm font-medium mt-2">{property.price}/night</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Wireframe>
  );
}

export function PropertyDetailWireframe() {
  return (
    <Wireframe figureNumber="3.1.2" caption="Property Details and Booking Interface">
      <div className="space-y-4">
        {/* Property Header */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Luxury Downtown Apartment</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span>4.9 (45 reviews)</span>
            </div>
            <span>• San Francisco, CA</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-2 row-span-2 bg-gray-200 rounded-lg h-64 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1666282167632-c613fbeb163c?w=800"
              alt="Luxury Downtown Apartment - Main View"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-gray-200 rounded-lg h-32 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1628592102751-ba83b0314276?w=400"
              alt="Living Room"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-gray-200 rounded-lg h-32 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?w=400"
              alt="Bedroom"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-gray-200 rounded-lg h-32 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?w=400"
              alt="Modern Bedroom"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-gray-200 rounded-lg h-32 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=400"
              alt="Apartment Interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details and Booking */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Amenities</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>✓ WiFi</div>
                <div>✓ Kitchen</div>
                <div>✓ Air Conditioning</div>
                <div>✓ Parking</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-600">
                Beautiful apartment in the heart of downtown. Perfect for business travelers...
              </p>
            </div>
          </div>
          
          <div className="border border-gray-300 rounded-lg p-4 h-fit">
            <div className="mb-4">
              <span className="text-2xl font-bold">$120</span>
              <span className="text-gray-600">/night</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Check-in</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Check-out</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
                Reserve
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </Wireframe>
  );
}

export function HostDashboardWireframe() {
  return (
    <Wireframe figureNumber="3.1.3" caption="Host Dashboard for Property Management">
      <div className="space-y-4">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold">Host Dashboard</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            + Add New Property
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-600">Total Listings</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="text-2xl font-bold">45</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="text-2xl font-bold">$5,400</div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="text-2xl font-bold">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Property List */}
        <div>
          <h3 className="font-medium mb-3">Your Properties</h3>
          <div className="space-y-2">
            {[
              { img: 'https://images.unsplash.com/photo-1666282167632-c613fbeb163c?w=200', name: 'Downtown Apartment 1' },
              { img: 'https://images.unsplash.com/photo-1603072845032-7b5bd641a82a?w=200', name: 'Downtown Apartment 2' },
              { img: 'https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=200', name: 'Downtown Apartment 3' }
            ].map((property, i) => (
              <div key={i} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 rounded overflow-hidden">
                    <ImageWithFallback
                      src={property.img}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{property.name}</div>
                    <div className="text-sm text-gray-600">San Francisco, CA</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="text-green-600 font-medium">Active</div>
                  </div>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm">Edit</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Wireframe>
  );
}

export function BookingCalendarWireframe() {
  return (
    <Wireframe figureNumber="3.1.4" caption="Calendar-Based Booking Interface">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Select Your Dates</h2>
        
        {/* Calendar */}
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <button className="px-3 py-1 border border-gray-300 rounded">←</button>
            <span className="font-medium">March 2026</span>
            <button className="px-3 py-1 border border-gray-300 rounded">→</button>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-sm font-medium text-gray-600 pb-2">
                {day}
              </div>
            ))}
            
            {/* Days */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer
                  ${day === 10 ? 'bg-blue-600 text-white' : ''}
                  ${day === 15 ? 'bg-blue-600 text-white' : ''}
                  ${day > 10 && day < 15 ? 'bg-blue-100' : ''}
                  ${day === 20 || day === 25 ? 'bg-gray-200 text-gray-400 line-through' : ''}
                  ${day !== 10 && day !== 15 && (day < 10 || day > 15) && day !== 20 && day !== 25 ? 'hover:bg-gray-100' : ''}
                `}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium mb-2">Booking Summary</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Check-in:</span>
              <span>March 10, 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out:</span>
              <span>March 15, 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Nights:</span>
              <span>5</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total:</span>
              <span>$600</span>
            </div>
          </div>
        </div>
      </div>
    </Wireframe>
  );
}

export function AdminDashboardWireframe() {
  return (
    <Wireframe figureNumber="3.1.5" caption="Admin Management Panel">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-gray-600" />
            <User className="size-5 text-gray-600" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b">
          <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
            Users
          </button>
          <button className="px-4 py-2 text-gray-600">
            Properties
          </button>
          <button className="px-4 py-2 text-gray-600">
            Bookings
          </button>
          <button className="px-4 py-2 text-gray-600">
            Reviews
          </button>
        </div>

        {/* User Management Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">User Management</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search users..."
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              />
              <Search className="size-4 text-gray-400" />
            </div>
          </div>
          
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="text-left p-3 font-medium">User ID</th>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '001', name: 'John Doe', email: 'john@email.com', role: 'Guest', status: 'Active' },
                  { id: '002', name: 'Jane Smith', email: 'jane@email.com', role: 'Host', status: 'Active' },
                  { id: '003', name: 'Bob Wilson', email: 'bob@email.com', role: 'Guest', status: 'Suspended' },
                ].map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 last:border-0">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'Host' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className="text-blue-600 text-xs">Edit</button>
                        <button className="text-red-600 text-xs">Suspend</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Wireframe>
  );
}

export function ReviewsWireframe() {
  return (
    <Wireframe figureNumber="3.1.6" caption="Reviews and Ratings Interface">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Guest Reviews</h2>
        
        {/* Overall Rating */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold">4.8</div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-1">45 reviews</div>
            </div>
            
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{stars} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${stars === 5 ? 80 : stars === 4 ? 60 : stars === 3 ? 30 : stars === 2 ? 10 : 5}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-gray-600">{stars === 5 ? 36 : stars === 4 ? 7 : stars === 3 ? 2 : 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="size-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">Guest Name</div>
                    <div className="text-sm text-gray-600">March 2026</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Amazing place! The location was perfect, close to everything. The apartment was clean
                and exactly as described. Would definitely stay here again.
              </p>
            </div>
          ))}
        </div>

        {/* Write Review Button */}
        <button className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-blue-400 hover:text-blue-600">
          + Write a Review
        </button>
      </div>
    </Wireframe>
  );
}

export function ClassDiagramFigure() {
  return (
    <Wireframe figureNumber="3.1.7" caption="System Class Diagram showing entity relationships and methods">
      <div className="flex justify-center bg-gray-50 p-4 rounded">
        <img 
          src={classdiagram} 
          alt="UrbanStay System Class Diagram" 
          className="max-w-full h-auto"
        />
      </div>
    </Wireframe>
  );
}

export function MobileWireframe() {
  return (
    <Wireframe figureNumber="3.1.7" caption="Mobile Responsive Design View">
      <div className="flex justify-center gap-8">
        {/* Mobile View 1 */}
        <div className="border-2 border-gray-400 rounded-2xl p-3 w-64 bg-white shadow-lg">
          <div className="space-y-3">
            {/* Mobile Header */}
            <div className="flex items-center justify-between pb-2 border-b">
              <Home className="size-6 text-blue-600" />
              <User className="size-6 text-gray-600" />
            </div>
            
            {/* Mobile Search */}
            <div className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex items-center gap-2 mb-2">
                <Search className="size-4 text-gray-400" />
                <input type="text" placeholder="Where to?" className="text-sm outline-none bg-transparent flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-gray-400" />
                <span className="text-sm text-gray-600">Add dates</span>
              </div>
            </div>
            
            {/* Mobile Property Cards */}
            <div className="space-y-2">
              {[
                { img: 'https://images.unsplash.com/photo-1666282167632-c613fbeb163c?w=300', name: 'Apartment 1', location: 'Downtown' },
                { img: 'https://images.unsplash.com/photo-1603072845032-7b5bd641a82a?w=300', name: 'Apartment 2', location: 'City Center' }
              ].map((property, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={property.img}
                    alt={property.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{property.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">4.8</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{property.location}</p>
                    <p className="text-sm font-medium mt-1">$120/night</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View 2 - Booking */}
        <div className="border-2 border-gray-400 rounded-2xl p-3 w-64 bg-white shadow-lg">
          <div className="space-y-3">
            {/* Mobile Header with Back */}
            <div className="flex items-center gap-3 pb-2 border-b">
              <button className="text-blue-600">←</button>
              <span className="font-medium">Booking Details</span>
            </div>
            
            {/* Property Preview */}
            <div className="h-24 rounded-lg overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1666282167632-c613fbeb163c?w=300"
                alt="Property Preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs mb-1">Check-in</label>
                <div className="border rounded-lg px-2 py-2 flex items-center gap-2">
                  <Calendar className="size-4 text-gray-400" />
                  <span className="text-sm">Mar 10, 2026</span>
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1">Check-out</label>
                <div className="border rounded-lg px-2 py-2 flex items-center gap-2">
                  <Calendar className="size-4 text-gray-400" />
                  <span className="text-sm">Mar 15, 2026</span>
                </div>
              </div>
            </div>
            
            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex justify-between text-sm mb-1">
                <span>5 nights</span>
                <span>$600</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>$600</span>
              </div>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm">
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </Wireframe>
  );
}