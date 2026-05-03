import {
  GuestHomepageWireframe,
  PropertyDetailWireframe,
  HostDashboardWireframe,
  BookingCalendarWireframe,
  AdminDashboardWireframe,
  ReviewsWireframe,
  MobileWireframe
} from './WireframeViewer';
import { ExportToWord } from './ExportToWord';

export function SRSDocument() {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <ExportToWord />
      
      {/* Title Page */}
      <div className="text-center mb-12 pb-8 border-b-2">
        <h1 className="text-4xl font-bold mb-4">Software Requirements Specification</h1>
        <h2 className="text-2xl mb-6">for</h2>
        <h2 className="text-3xl text-blue-600 mb-6">UrbanStay</h2>
        <p className="text-lg mb-2">Version 1.0 approved</p>
        <p className="mb-1">Prepared by TUN TUN MAUSII</p>
        <p className="text-gray-600">March 5, 2026</p>
      </div>

      {/* Table of Contents */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2">Table of Contents</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>1. Introduction</span><span>1</span></div>
          <div className="flex justify-between pl-4"><span>1.1 Purpose</span><span>1</span></div>
          <div className="flex justify-between pl-4"><span>1.2 Document Conventions</span><span>1</span></div>
          <div className="flex justify-between pl-4"><span>1.3 Intended Audience and Reading Suggestions</span><span>1</span></div>
          <div className="flex justify-between pl-4"><span>1.4 Product Scope</span><span>1</span></div>
          <div className="flex justify-between"><span>2. Overall Description</span><span>2</span></div>
          <div className="flex justify-between pl-4"><span>2.1 Product Perspective</span><span>2</span></div>
          <div className="flex justify-between pl-4"><span>2.2 Product Functions</span><span>2</span></div>
          <div className="flex justify-between pl-4"><span>2.3 User Classes and Characteristics</span><span>2</span></div>
          <div className="flex justify-between"><span>3. External Interface Requirements</span><span>3</span></div>
          <div className="flex justify-between pl-4"><span>3.1 User Interfaces</span><span>3</span></div>
          <div className="flex justify-between"><span>4. System Features</span><span>4</span></div>
          <div className="flex justify-between"><span>5. Other Nonfunctional Requirements</span><span>4</span></div>
        </div>
      </section>

      {/* 1. Introduction */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">1. Introduction</h2>
        
        <h3 className="text-2xl font-bold mb-3">1.1 Purpose</h3>
        <p className="mb-4">
          This document specifies the software requirements for UrbanStay Version 1.0, a web-based 
          property rental and booking system.
        </p>
        <p className="mb-4">This SRS describes the functional and non-functional requirements for the complete UrbanStay system, including:</p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Guest module</li>
          <li>Host module</li>
          <li>Admin module</li>
          <li>Booking and review system</li>
        </ul>
        <p className="mb-6">
          This document will serve as a reference for developers, testers, project supervisors, 
          and stakeholders during development and evaluation.
        </p>

        <h3 className="text-2xl font-bold mb-3">1.2 Document Conventions</h3>
        <p className="mb-3">The following conventions are used in this SRS:</p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Functional requirements are labeled as: <strong>REQ-F-XX</strong></li>
          <li>Non-functional requirements are labeled as: <strong>REQ-NF-XX</strong></li>
          <li>Business rules are labeled as: <strong>BR-XX</strong></li>
          <li>Priorities are categorized as: High (H), Medium (M), Low (L)</li>
          <li>"TBD" indicates information yet to be finalized</li>
        </ul>

        <h3 className="text-2xl font-bold mb-3">1.3 Intended Audience and Reading Suggestions</h3>
        <p className="mb-3">This document is intended for:</p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Developers – To understand system requirements</li>
          <li>Testers – To validate system behavior</li>
          <li>Project Supervisor – To evaluate system completeness</li>
          <li>UI/UX Designers – To ensure usability compliance</li>
          <li>Students (HCI Project Evaluators)</li>
        </ul>

        <h3 className="text-2xl font-bold mb-3">1.4 Product Scope</h3>
        <p className="mb-3">
          UrbanStay is a web-based platform designed to connect property owners (hosts) with 
          guests seeking short-term accommodation.
        </p>
        <p className="mb-3">The system will:</p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Allow hosts to list rental properties</li>
          <li>Allow guests to search and book properties</li>
          <li>Enable reviews and ratings</li>
          <li>Provide admin monitoring and control</li>
        </ul>
        <p className="mb-6">
          UrbanStay focuses on simplicity, accessibility, and suitability for local markets and students.
        </p>
      </section>

      {/* 2. Overall Description */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">2. Overall Description</h2>
        
        <h3 className="text-2xl font-bold mb-3">2.1 Product Perspective</h3>
        <p className="mb-3">UrbanStay is a new, standalone academic prototype system inspired by platforms such as:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Airbnb</li>
          <li>Booking.com</li>
        </ul>
        <p className="mb-3">However, UrbanStay focuses on:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Local market</li>
          <li>Simple interface</li>
          <li>Reduced complexity</li>
          <li>Educational implementation</li>
        </ul>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="font-bold mb-2">System Architecture:</p>
          <p><strong>Frontend:</strong> HTML, CSS, JavaScript (Bootstrap / optional React)</p>
          <p><strong>Backend:</strong> Python (Django/Flask)</p>
          <p><strong>Database:</strong> Relational Database (MySQL or SQLite)</p>
        </div>

        <h3 className="text-2xl font-bold mb-3">2.2 Product Functions</h3>
        <p className="mb-3">The system will provide:</p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>User Registration & Login</li>
          <li>Role-Based Dashboards</li>
          <li>Property Listing Management</li>
          <li>Image Upload</li>
          <li>Search & Filtering</li>
          <li>Booking & Reservation</li>
          <li>Availability Calendar</li>
          <li>Reviews & Ratings</li>
          <li>Wishlist/Favorites</li>
          <li>Admin Management Panel</li>
          <li>Email Notifications</li>
        </ul>

        <h3 className="text-2xl font-bold mb-3">2.3 User Classes and Characteristics</h3>
        <div className="space-y-4 mb-6">
          <div>
            <p className="font-bold">1. Guests (Primary Users)</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Browse and book properties</li>
              <li>Moderate technical knowledge</li>
              <li>Access via mobile or desktop</li>
            </ul>
          </div>
          <div>
            <p className="font-bold">2. Hosts</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>List and manage properties</li>
              <li>Upload images</li>
              <li>View bookings</li>
              <li>Moderate technical skills</li>
            </ul>
          </div>
          <div>
            <p className="font-bold">3. Administrator</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Manage users</li>
              <li>Monitor listings</li>
              <li>Remove inappropriate content</li>
              <li>High system privileges</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. External Interface Requirements */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">3. External Interface Requirements</h2>
        
        <h3 className="text-2xl font-bold mb-4">3.1 User Interfaces</h3>
        <p className="mb-6">
          The UrbanStay system features a responsive web design with clean dashboard layouts and 
          intuitive navigation. The following wireframes illustrate the key user interfaces:
        </p>

        {/* UI Mockups/Wireframes */}
        <div className="space-y-8 mb-8">
          <GuestHomepageWireframe />
          <PropertyDetailWireframe />
          <BookingCalendarWireframe />
          <HostDashboardWireframe />
          <AdminDashboardWireframe />
          <ReviewsWireframe />
          <MobileWireframe />
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="font-bold mb-2">User Interface Requirements:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Responsive web design supporting desktop, tablet, and mobile devices</li>
            <li>Clean dashboard layout with role-based views</li>
            <li>Search bar prominently displayed on homepage</li>
            <li>Property cards with images and key information</li>
            <li>Calendar-based booking interface</li>
            <li>Error messages displayed clearly and contextually</li>
            <li>Standard navigation bar across all pages</li>
            <li>Consistent color scheme and branding throughout</li>
          </ul>
        </div>

        <h3 className="text-2xl font-bold mb-3">3.2 Hardware Interfaces</h3>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>No special hardware required</li>
          <li>Works on desktops, laptops, tablets, smartphones</li>
        </ul>

        <h3 className="text-2xl font-bold mb-3">3.3 Software Interfaces</h3>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Database (MySQL / SQLite)</li>
          <li>Python Web Framework (Django/Flask)</li>
          <li>Email Service (SMTP)</li>
          <li>Web Browser</li>
        </ul>

        <h3 className="text-2xl font-bold mb-3">3.4 Communications Interfaces</h3>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>HTTP/HTTPS protocol</li>
          <li>Email notifications via SMTP</li>
          <li>Secure authentication using encrypted passwords</li>
        </ul>
      </section>

      {/* 4. System Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">4. System Features</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2">4.1 User Authentication</h3>
            <p className="mb-2"><strong>Description and Priority:</strong> Secure registration and login for Guests, Hosts, and Admin. Priority: High</p>
            <p className="mb-2"><strong>Functional Requirements:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>REQ-F-01:</strong> System shall allow users to register as Guest or Host</li>
              <li><strong>REQ-F-02:</strong> System shall validate email uniqueness</li>
              <li><strong>REQ-F-03:</strong> System shall encrypt passwords</li>
              <li><strong>REQ-F-04:</strong> System shall allow secure login/logout</li>
              <li><strong>REQ-F-05:</strong> System shall restrict dashboard access based on role</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">4.2 Property Listing Management</h3>
            <p className="mb-2"><strong>Priority:</strong> High</p>
            <p className="mb-2"><strong>Functional Requirements:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>REQ-F-06:</strong> Host shall add property details (title, location, price)</li>
              <li><strong>REQ-F-07:</strong> Host shall upload multiple images</li>
              <li><strong>REQ-F-08:</strong> Host shall edit property information</li>
              <li><strong>REQ-F-09:</strong> Host shall delete property listing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">4.3 Search and Filtering</h3>
            <p className="mb-2"><strong>Priority:</strong> High</p>
            <p className="mb-2"><strong>Functional Requirements:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>REQ-F-10:</strong> Guest shall search by location</li>
              <li><strong>REQ-F-11:</strong> Guest shall filter by price range</li>
              <li><strong>REQ-F-12:</strong> Guest shall filter by availability dates</li>
              <li><strong>REQ-F-13:</strong> System shall display matching results</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">4.4 Booking System</h3>
            <p className="mb-2"><strong>Priority:</strong> High</p>
            <p className="mb-2"><strong>Functional Requirements:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>REQ-F-14:</strong> Guest shall select check-in and check-out dates</li>
              <li><strong>REQ-F-15:</strong> System shall prevent double booking</li>
              <li><strong>REQ-F-16:</strong> Booking confirmation email shall be sent</li>
              <li><strong>REQ-F-17:</strong> Guest shall view booking history</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">4.5 Reviews & Ratings</h3>
            <p className="mb-2"><strong>Priority:</strong> Medium</p>
            <p className="mb-2"><strong>Functional Requirements:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>REQ-F-18:</strong> Guest shall submit review after stay</li>
              <li><strong>REQ-F-19:</strong> System shall display rating on property page</li>
              <li><strong>REQ-F-20:</strong> Admin shall remove inappropriate reviews</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">4.6 Admin Dashboard</h3>
            <p className="mb-2"><strong>Priority:</strong> High</p>
            <p className="mb-2"><strong>Functional Requirements:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>REQ-F-21:</strong> Admin shall view all users</li>
              <li><strong>REQ-F-22:</strong> Admin shall deactivate user accounts</li>
              <li><strong>REQ-F-23:</strong> Admin shall remove inappropriate listings</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Other Nonfunctional Requirements */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">5. Other Nonfunctional Requirements</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-2">5.1 Performance Requirements</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>REQ-NF-01:</strong> Page load time shall not exceed 3 seconds under normal conditions</li>
              <li><strong>REQ-NF-02:</strong> System support for at least 100 concurrent users (academic prototype level)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">5.2 Safety Requirements</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>REQ-NF-03:</strong> System shall prevent data loss during booking transactions</li>
              <li><strong>REQ-NF-04:</strong> Confirmation must be shown before deleting listings</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">5.3 Security Requirements</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>REQ-NF-05:</strong> Passwords shall be encrypted</li>
              <li><strong>REQ-NF-06:</strong> Role-based authorization must be enforced</li>
              <li><strong>REQ-NF-07:</strong> System shall use HTTPS protocol</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">5.4 Software Quality Attributes</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Usability</strong> – Simple UI for non-technical users</li>
              <li><strong>Reliability</strong> – 95% uptime during testing</li>
              <li><strong>Maintainability</strong> – Modular design</li>
              <li><strong>Portability</strong> – Works across major browsers</li>
              <li><strong>Scalability</strong> – Future support for payment gateway</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">5.5 Business Rules</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>BR-01:</strong> Only hosts can create property listings</li>
              <li><strong>BR-02:</strong> Only guests can post reviews</li>
              <li><strong>BR-03:</strong> Review allowed only after booking completion</li>
              <li><strong>BR-04:</strong> Admin has authority to suspend accounts</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Other Requirements */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">6. Other Requirements</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Database normalization up to 3NF</li>
          <li>Future support for payment integration</li>
          <li>Multi-language support (TBD)</li>
        </ul>
      </section>

      {/* Appendices */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Appendix A: Glossary</h2>
        <div className="space-y-2">
          <p><strong>Guest</strong> – User who books property</p>
          <p><strong>Host</strong> – Property owner</p>
          <p><strong>Admin</strong> – System manager</p>
          <p><strong>Booking</strong> – Reservation of property</p>
          <p><strong>Dashboard</strong> – Role-based control panel</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Appendix B: Analysis Models</h2>
        <p className="mb-3">The following analysis models are included in this document:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>User Interface Wireframes (Figures 3.1.1 - 3.1.7)</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Appendix C: To Be Determined List</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>TBD-01:</strong> Final database selection</li>
          <li><strong>TBD-02:</strong> Email service provider</li>
          <li><strong>TBD-03:</strong> Deployment server details</li>
        </ul>
      </section>
    </div>
  );
}