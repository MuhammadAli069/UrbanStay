import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  ImageRun,
  convertInchesToTwip
} from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

export function ExportToWord() {
  const [isGenerating, setIsGenerating] = useState(false);

  const captureWireframes = async () => {
    const figures = document.querySelectorAll('[data-figure]');
    const capturedImages: { figureNumber: string; imageData: string; caption: string }[] = [];

    for (const figure of figures) {
      const figureNumber = figure.getAttribute('data-figure') || '';
      const content = figure.querySelector('[data-wireframe-content]') as HTMLElement;
      const captionElement = figure.querySelector('[data-caption]');
      const caption = captionElement?.textContent || '';

      if (content) {
        try {
          const canvas = await html2canvas(content, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
          });
          
          const imageData = canvas.toDataURL('image/png');
          capturedImages.push({ figureNumber, imageData, caption });
        } catch (error) {
          console.error(`Error capturing figure ${figureNumber}:`, error);
        }
      }
    }

    return capturedImages;
  };

  const generateWordDocument = async () => {
    setIsGenerating(true);

    try {
      // Capture all wireframes as images
      const wireframeImages = await captureWireframes();

      const docChildren: any[] = [
        // Title Page
        new Paragraph({
          text: "Software Requirements Specification",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "for",
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "UrbanStay",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "Version 1.0 approved",
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "Prepared by TUN TUN MAUSII",
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: "March 5, 2026",
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        // Table of Contents
        new Paragraph({
          text: "Table of Contents",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({ text: "1. Introduction", spacing: { after: 100 } }),
        new Paragraph({ text: "   1.1 Purpose", spacing: { after: 100 } }),
        new Paragraph({ text: "   1.2 Document Conventions", spacing: { after: 100 } }),
        new Paragraph({ text: "   1.3 Intended Audience and Reading Suggestions", spacing: { after: 100 } }),
        new Paragraph({ text: "   1.4 Product Scope", spacing: { after: 100 } }),
        new Paragraph({ text: "2. Overall Description", spacing: { after: 100 } }),
        new Paragraph({ text: "3. External Interface Requirements", spacing: { after: 100 } }),
        new Paragraph({ text: "   3.1 User Interfaces", spacing: { after: 100 } }),
        new Paragraph({ text: "4. System Features", spacing: { after: 100 } }),
        new Paragraph({ text: "5. Other Nonfunctional Requirements", spacing: { after: 400 } }),

        // 1. Introduction
        new Paragraph({
          text: "1. Introduction",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          text: "1.1 Purpose",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "This document specifies the software requirements for UrbanStay Version 1.0, a web-based property rental and booking system.",
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: "This SRS describes the functional and non-functional requirements for the complete UrbanStay system, including:",
          spacing: { after: 100 }
        }),
        new Paragraph({ text: "• Guest module", spacing: { after: 50 } }),
        new Paragraph({ text: "• Host module", spacing: { after: 50 } }),
        new Paragraph({ text: "• Admin module", spacing: { after: 50 } }),
        new Paragraph({ text: "• Booking and review system", spacing: { after: 200 } }),
        new Paragraph({
          text: "This document will serve as a reference for developers, testers, project supervisors, and stakeholders during development and evaluation.",
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: "1.2 Document Conventions",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "The following conventions are used in this SRS:",
          spacing: { after: 100 }
        }),
        new Paragraph({ text: "• Functional requirements are labeled as: REQ-F-XX", spacing: { after: 50 } }),
        new Paragraph({ text: "• Non-functional requirements are labeled as: REQ-NF-XX", spacing: { after: 50 } }),
        new Paragraph({ text: "• Business rules are labeled as: BR-XX", spacing: { after: 50 } }),
        new Paragraph({ text: "• Priorities are categorized as: High (H), Medium (M), Low (L)", spacing: { after: 50 } }),
        new Paragraph({ text: "• \"TBD\" indicates information yet to be finalized", spacing: { after: 200 } }),

        new Paragraph({
          text: "1.3 Intended Audience and Reading Suggestions",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "This document is intended for:",
          spacing: { after: 100 }
        }),
        new Paragraph({ text: "• Developers – To understand system requirements", spacing: { after: 50 } }),
        new Paragraph({ text: "• Testers – To validate system behavior", spacing: { after: 50 } }),
        new Paragraph({ text: "• Project Supervisor – To evaluate system completeness", spacing: { after: 50 } }),
        new Paragraph({ text: "• UI/UX Designers – To ensure usability compliance", spacing: { after: 50 } }),
        new Paragraph({ text: "• Students (HCI Project Evaluators)", spacing: { after: 200 } }),

        new Paragraph({
          text: "1.4 Product Scope",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "UrbanStay is a web-based platform designed to connect property owners (hosts) with guests seeking short-term accommodation.",
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: "The system will:",
          spacing: { after: 100 }
        }),
        new Paragraph({ text: "• Allow hosts to list rental properties", spacing: { after: 50 } }),
        new Paragraph({ text: "• Allow guests to search and book properties", spacing: { after: 50 } }),
        new Paragraph({ text: "• Enable reviews and ratings", spacing: { after: 50 } }),
        new Paragraph({ text: "• Provide admin monitoring and control", spacing: { after: 200 } }),
        new Paragraph({
          text: "UrbanStay focuses on simplicity, accessibility, and suitability for local markets and students.",
          spacing: { after: 400 }
        }),

        // 2. Overall Description
        new Paragraph({
          text: "2. Overall Description",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          text: "2.1 Product Perspective",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "UrbanStay is a new, standalone academic prototype system inspired by platforms such as Airbnb and Booking.com.",
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: "However, UrbanStay focuses on:",
          spacing: { after: 100 }
        }),
        new Paragraph({ text: "• Local market", spacing: { after: 50 } }),
        new Paragraph({ text: "• Simple interface", spacing: { after: 50 } }),
        new Paragraph({ text: "• Reduced complexity", spacing: { after: 50 } }),
        new Paragraph({ text: "• Educational implementation", spacing: { after: 200 } }),

        new Paragraph({
          children: [
            new TextRun({ text: "System Architecture:", bold: true })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({ text: "Frontend: HTML, CSS, JavaScript (Bootstrap / optional React)", spacing: { after: 50 } }),
        new Paragraph({ text: "Backend: Python (Django/Flask)", spacing: { after: 50 } }),
        new Paragraph({ text: "Database: Relational Database (MySQL or SQLite)", spacing: { after: 200 } }),

        new Paragraph({
          text: "2.2 Product Functions",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "The system will provide:",
          spacing: { after: 100 }
        }),
        new Paragraph({ text: "• User Registration & Login", spacing: { after: 50 } }),
        new Paragraph({ text: "• Role-Based Dashboards", spacing: { after: 50 } }),
        new Paragraph({ text: "• Property Listing Management", spacing: { after: 50 } }),
        new Paragraph({ text: "• Image Upload", spacing: { after: 50 } }),
        new Paragraph({ text: "• Search & Filtering", spacing: { after: 50 } }),
        new Paragraph({ text: "• Booking & Reservation", spacing: { after: 50 } }),
        new Paragraph({ text: "• Availability Calendar", spacing: { after: 50 } }),
        new Paragraph({ text: "• Reviews & Ratings", spacing: { after: 50 } }),
        new Paragraph({ text: "• Wishlist/Favorites", spacing: { after: 50 } }),
        new Paragraph({ text: "• Admin Management Panel", spacing: { after: 50 } }),
        new Paragraph({ text: "• Email Notifications", spacing: { after: 200 } }),

        new Paragraph({
          text: "2.3 User Classes and Characteristics",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. Guests (Primary Users)", bold: true })
          ],
          spacing: { after: 50 }
        }),
        new Paragraph({ text: "• Browse and book properties", spacing: { after: 50 } }),
        new Paragraph({ text: "• Moderate technical knowledge", spacing: { after: 50 } }),
        new Paragraph({ text: "• Access via mobile or desktop", spacing: { after: 100 } }),

        new Paragraph({
          children: [
            new TextRun({ text: "2. Hosts", bold: true })
          ],
          spacing: { after: 50 }
        }),
        new Paragraph({ text: "• List and manage properties", spacing: { after: 50 } }),
        new Paragraph({ text: "• Upload images", spacing: { after: 50 } }),
        new Paragraph({ text: "• View bookings", spacing: { after: 50 } }),
        new Paragraph({ text: "• Moderate technical skills", spacing: { after: 100 } }),

        new Paragraph({
          children: [
            new TextRun({ text: "3. Administrator", bold: true })
          ],
          spacing: { after: 50 }
        }),
        new Paragraph({ text: "• Manage users", spacing: { after: 50 } }),
        new Paragraph({ text: "• Monitor listings", spacing: { after: 50 } }),
        new Paragraph({ text: "• Remove inappropriate content", spacing: { after: 50 } }),
        new Paragraph({ text: "• High system privileges", spacing: { after: 400 } }),

        // 3. External Interface Requirements
        new Paragraph({
          text: "3. External Interface Requirements",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          text: "3.1 User Interfaces",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "The UrbanStay system features a responsive web design with clean dashboard layouts and intuitive navigation. The following wireframes illustrate the key user interfaces:",
          spacing: { after: 200 }
        }),
      ];

      // Add wireframe images
      for (const wireframe of wireframeImages) {
        // Add the image
        const base64Data = wireframe.imageData.split(',')[1];
        docChildren.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)),
                transformation: {
                  width: 600,
                  height: 600 * (3/4) // Maintain aspect ratio
                }
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          })
        );

        // Add caption
        docChildren.push(
          new Paragraph({
            text: wireframe.caption,
            alignment: AlignmentType.CENTER,
            italics: true,
            spacing: { after: 300 }
          })
        );
      }

      // Continue with rest of the document
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: "User Interface Requirements:", bold: true })
          ],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "• Responsive web design supporting desktop, tablet, and mobile devices", spacing: { after: 50 } }),
        new Paragraph({ text: "• Clean dashboard layout with role-based views", spacing: { after: 50 } }),
        new Paragraph({ text: "• Search bar prominently displayed on homepage", spacing: { after: 50 } }),
        new Paragraph({ text: "• Property cards with images and key information", spacing: { after: 50 } }),
        new Paragraph({ text: "• Calendar-based booking interface", spacing: { after: 50 } }),
        new Paragraph({ text: "• Error messages displayed clearly and contextually", spacing: { after: 50 } }),
        new Paragraph({ text: "• Standard navigation bar across all pages", spacing: { after: 50 } }),
        new Paragraph({ text: "• Consistent color scheme and branding throughout", spacing: { after: 200 } }),

        new Paragraph({
          text: "3.2 Hardware Interfaces",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "• No special hardware required", spacing: { after: 50 } }),
        new Paragraph({ text: "• Works on desktops, laptops, tablets, smartphones", spacing: { after: 200 } }),

        new Paragraph({
          text: "3.3 Software Interfaces",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "• Database (MySQL / SQLite)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Python Web Framework (Django/Flask)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Email Service (SMTP)", spacing: { after: 50 } }),
        new Paragraph({ text: "• Web Browser", spacing: { after: 200 } }),

        new Paragraph({
          text: "3.4 Communications Interfaces",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "• HTTP/HTTPS protocol", spacing: { after: 50 } }),
        new Paragraph({ text: "• Email notifications via SMTP", spacing: { after: 50 } }),
        new Paragraph({ text: "• Secure authentication using encrypted passwords", spacing: { after: 400 } }),

        // 4. System Features
        new Paragraph({
          text: "4. System Features",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          text: "4.1 User Authentication",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "Description and Priority: Secure registration and login for Guests, Hosts, and Admin. Priority: High",
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Functional Requirements:", bold: true })
          ],
          spacing: { after: 50 }
        }),
        new Paragraph({ text: "REQ-F-01: System shall allow users to register as Guest or Host", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-02: System shall validate email uniqueness", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-03: System shall encrypt passwords", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-04: System shall allow secure login/logout", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-05: System shall restrict dashboard access based on role", spacing: { after: 200 } }),

        new Paragraph({
          text: "4.2 Property Listing Management",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "Priority: High",
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Functional Requirements:", bold: true })
          ],
          spacing: { after: 50 }
        }),
        new Paragraph({ text: "REQ-F-06: Host shall add property details (title, location, price)", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-07: Host shall upload multiple images", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-08: Host shall edit property information", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-09: Host shall delete property listing", spacing: { after: 200 } }),

        new Paragraph({
          text: "4.3 Search and Filtering",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "Priority: High", spacing: { after: 100 } }),
        new Paragraph({ text: "REQ-F-10: Guest shall search by location", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-11: Guest shall filter by price range", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-12: Guest shall filter by availability dates", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-13: System shall display matching results", spacing: { after: 200 } }),

        new Paragraph({
          text: "4.4 Booking System",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "Priority: High", spacing: { after: 100 } }),
        new Paragraph({ text: "REQ-F-14: Guest shall select check-in and check-out dates", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-15: System shall prevent double booking", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-16: Booking confirmation email shall be sent", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-17: Guest shall view booking history", spacing: { after: 200 } }),

        new Paragraph({
          text: "4.5 Reviews & Ratings",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "Priority: Medium", spacing: { after: 100 } }),
        new Paragraph({ text: "REQ-F-18: Guest shall submit review after stay", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-19: System shall display rating on property page", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-20: Admin shall remove inappropriate reviews", spacing: { after: 200 } }),

        new Paragraph({
          text: "4.6 Admin Dashboard",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "Priority: High", spacing: { after: 100 } }),
        new Paragraph({ text: "REQ-F-21: Admin shall view all users", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-22: Admin shall deactivate user accounts", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-F-23: Admin shall remove inappropriate listings", spacing: { after: 400 } }),

        // 5. Nonfunctional Requirements
        new Paragraph({
          text: "5. Other Nonfunctional Requirements",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          text: "5.1 Performance Requirements",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "REQ-NF-01: Page load time shall not exceed 3 seconds under normal conditions", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-NF-02: System support for at least 100 concurrent users (academic prototype level)", spacing: { after: 200 } }),

        new Paragraph({
          text: "5.2 Safety Requirements",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "REQ-NF-03: System shall prevent data loss during booking transactions", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-NF-04: Confirmation must be shown before deleting listings", spacing: { after: 200 } }),

        new Paragraph({
          text: "5.3 Security Requirements",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "REQ-NF-05: Passwords shall be encrypted", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-NF-06: Role-based authorization must be enforced", spacing: { after: 50 } }),
        new Paragraph({ text: "REQ-NF-07: System shall use HTTPS protocol", spacing: { after: 200 } }),

        new Paragraph({
          text: "5.4 Software Quality Attributes",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "• Usability – Simple UI for non-technical users", spacing: { after: 50 } }),
        new Paragraph({ text: "• Reliability – 95% uptime during testing", spacing: { after: 50 } }),
        new Paragraph({ text: "• Maintainability – Modular design", spacing: { after: 50 } }),
        new Paragraph({ text: "• Portability – Works across major browsers", spacing: { after: 50 } }),
        new Paragraph({ text: "• Scalability – Future support for payment gateway", spacing: { after: 200 } }),

        new Paragraph({
          text: "5.5 Business Rules",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({ text: "BR-01: Only hosts can create property listings", spacing: { after: 50 } }),
        new Paragraph({ text: "BR-02: Only guests can post reviews", spacing: { after: 50 } }),
        new Paragraph({ text: "BR-03: Review allowed only after booking completion", spacing: { after: 50 } }),
        new Paragraph({ text: "BR-04: Admin has authority to suspend accounts", spacing: { after: 400 } }),

        // 6. Other Requirements
        new Paragraph({
          text: "6. Other Requirements",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({ text: "• Database normalization up to 3NF", spacing: { after: 50 } }),
        new Paragraph({ text: "• Future support for payment integration", spacing: { after: 50 } }),
        new Paragraph({ text: "• Multi-language support (TBD)", spacing: { after: 400 } }),

        // Appendices
        new Paragraph({
          text: "Appendix A: Glossary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({ text: "Guest – User who books property", spacing: { after: 50 } }),
        new Paragraph({ text: "Host – Property owner", spacing: { after: 50 } }),
        new Paragraph({ text: "Admin – System manager", spacing: { after: 50 } }),
        new Paragraph({ text: "Booking – Reservation of property", spacing: { after: 50 } }),
        new Paragraph({ text: "Dashboard – Role-based control panel", spacing: { after: 400 } }),

        new Paragraph({
          text: "Appendix B: Analysis Models",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: "The following analysis models are included in this document:",
          spacing: { after: 100 }
        }),
        new Paragraph({ text: "• System Class Diagram (Figure 3.1.7)", spacing: { after: 50 } }),
        new Paragraph({ text: "• User Interface Wireframes (Figures 3.1.1 - 3.1.8)", spacing: { after: 400 } }),

        new Paragraph({
          text: "Appendix C: To Be Determined List",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({ text: "TBD-01: Final database selection", spacing: { after: 50 } }),
        new Paragraph({ text: "TBD-02: Email service provider", spacing: { after: 50 } }),
        new Paragraph({ text: "TBD-03: Deployment server details", spacing: { after: 50 } })
      );

      const doc = new Document({
        sections: [{
          properties: {},
          children: docChildren
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "UrbanStay_SRS_Document.docx");
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Error generating document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateWordDocument}
      disabled={isGenerating}
      className="fixed top-6 right-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <Loader2 className="size-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="size-5" />
          Download as Word
        </>
      )}
    </button>
  );
}
