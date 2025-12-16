// import {
//   FaFacebookF,
//   FaInstagram,
//   FaLinkedinIn,
//   FaReddit,
//   FaTwitter,
//   FaYoutube,
// } from "react-icons/fa";
// import { SiQuora } from "react-icons/si"; // Quora comes from Simple Icons

// export default function Footer() {
//   return (
//     <footer
//       className="text-white py-10 mt-12"
//       style={{ backgroundColor: "rgb(0 128 128)" }}
//     >
//       <div className="container mx-auto px-6">
//         {/* Top Section */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Logo & Description */}
//           <div>
//             <h2 className="text-2xl font-bold mb-3">Vaidam Clone</h2>
//             <p className="text-sm opacity-90 leading-relaxed">
//               Bringing trusted healthcare information and connections closer to
//               you. Built for learning and development purposes.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <a href="/" className="hover:underline hover:opacity-80">
//                   Home
//                 </a>
//               </li>
//               <li>
//                 <a href="/about" className="hover:underline hover:opacity-80">
//                   About Us
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="/services"
//                   className="hover:underline hover:opacity-80"
//                 >
//                   Services
//                 </a>
//               </li>
//               <li>
//                 <a href="/contact" className="hover:underline hover:opacity-80">
//                   Contact
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3">Contact</h3>
//             <ul className="space-y-2 text-sm">
//               <li>Email: info@vaidamclone.com</li>
//               <li>Phone: +91-123-456-7890</li>
//               <li>Location: Delhi, India</li>
//             </ul>
//           </div>

//           {/* Social Media */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
//             <div className="flex space-x-4 text-xl">
//               <a href="#" className="hover:opacity-80 transition">
//                 <FaFacebookF />
//               </a>
//               <a href="#" className="hover:opacity-80 transition">
//                 <FaTwitter />
//               </a>
//               <a href="#" className="hover:opacity-80 transition">
//                 <FaLinkedinIn />
//               </a>
//               <a href="#" className="hover:opacity-80 transition">
//                 <FaInstagram />
//               </a>
//               <a href="#" className="hover:opacity-80 transition">
//                 <FaYoutube />
//               </a>
//               <a href="#" className="hover:opacity-80 transition">
//                 <SiQuora />
//               </a>
//               <a href="#" className="hover:opacity-80 transition">
//                 <FaReddit />
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-white border-opacity-20 mt-8 pt-6 text-center text-sm opacity-80">
//           ©️ {new Date().getFullYear()} Vaidam Clone. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// }

// src/components/Footer.jsx
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaLinkedin,
  FaReddit,
} from "react-icons/fa";
import { SiQuora } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Vaidam</h3>
            <p className="text-sm opacity-90">
              Vaidam Health helps patients worldwide find the best hospitals and
              doctors for their treatment abroad. We connect patients with top
              medical experts globally.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Treatments
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Hospitals
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Medical Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Our Medical Destinations
            </h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <span className="flex items-center space-x-2">
                <img src="https://flagcdn.com/w20/in.png" alt="India" />{" "}
                <p>India</p>
              </span>
              <span className="flex items-center space-x-2">
                <img src="https://flagcdn.com/w20/th.png" alt="Thailand" />{" "}
                <p>Thailand</p>
              </span>
              <span className="flex items-center space-x-2">
                <img src="https://flagcdn.com/w20/ae.png" alt="UAE" />{" "}
                <p>UAE</p>
              </span>
              <span className="flex items-center space-x-2">
                <img src="https://flagcdn.com/w20/de.png" alt="Germany" />{" "}
                <p>Germany</p>
              </span>
              <span className="flex items-center space-x-2">
                <img src="https://flagcdn.com/w20/tr.png" alt="Turkey" />{" "}
                <p>Turkey</p>
              </span>
              <span className="flex items-center space-x-2">
                <img src="https://flagcdn.com/w20/sg.png" alt="Singapore" />{" "}
                <p>Singapore</p>
              </span>
            </div>
          </div>

          {/* Social + CTA */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <a
                href="#"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="#"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="#"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaReddit size={20} />
              </a>
              <a
                href="#"
                className="hover:scale-110 transform transition duration-300"
              >
                <SiQuora size={20} />
              </a>
            </div>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition transform hover:scale-105 w-fit"
            >
              <FaWhatsapp className="mr-2" /> Need Assistance
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-teal-400"></div>

        {/* Disclaimer */}
        <div className="text-xs opacity-80 leading-relaxed">
          <p>
            <strong>Note:</strong> Vaidam Health does not provide medical
            advice, diagnosis or treatment. The services and information offered
            on www.vaidam.com are intended solely for informational purposes and
            cannot replace the professional consultation or treatment by a
            physician. Vaidam Health discourages copying, cloning of its
            webpages and its content and it will follow the legal procedures to
            protect its intellectual property.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm opacity-80">
          © {new Date().getFullYear()} Vaidam Health. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
