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
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">About MedicwayCare</h3>
            <p className="text-sm opacity-90">
              MedicwayCare connects patients worldwide with the best hospitals and
              doctors for affordable medical treatment abroad. We provide expert
              healthcare guidance and support globally.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:underline text-sm opacity-90">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:underline">
                  Doctors
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:underline">
                  Hospitals
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Medical Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
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
            <h3 className="text-lg font-semibold mb-4 text-white">Connect With Us</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <a
                href="https://www.facebook.com/share/1LEebindtd/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.instagram.com/medicwaycare?igsh=MXU4MWZyZTFrdHV3Yw=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/@MedicwayCare"
                target="_blank"
                rel="noopener noreferrer"
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
              href="https://wa.me/919354799090"
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
            <strong>Note:</strong> MedicwayCare does not provide medical
            advice, diagnosis or treatment. The services and information offered
            on www.medicwaycare.in are intended solely for informational purposes and
            cannot replace the professional consultation or treatment by a
            physician. MedicwayCare discourages copying, cloning of its
            webpages and its content and it will follow the legal procedures to
            protect its intellectual property.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm opacity-80">
          © {new Date().getFullYear()} MedicwayCare. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
