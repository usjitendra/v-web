// import { FaWhatsapp } from 'react-icons/fa';
// import './WhatsAppButton.css';

// const WhatsAppSectionButton = () => {
//   // Replace with your actual WhatsApp number in international format (without +)
//   const phoneNumber = '1234567890';

//   // Message that will be pre-filled (optional)
//   const message = 'Hello! I have a question about your services.';

//   // Create the WhatsApp URL
//   const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

//   return (
//     <div className="whatsapp-section-button-container">
//       <a
//         href={whatsappUrl}
//         className="whatsapp-section-button"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <FaWhatsapp className="whatsapp-section-icon" />
//         {/* <span>Chat with us on WhatsApp</span> */}
//       </a>
//     </div>
//   );
// };

// export default WhatsAppSectionButton;

import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

const WhatsAppSectionButton = () => {
  // Replace with your actual WhatsApp number in international format (without +)
  const phoneNumber = "1234567890";

  // Message that will be pre-filled (optional)
  const message = "Hello! I have a question about your services.";

  // Create the WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="whatsapp-section-button-container">
      <a
        href={whatsappUrl}
        className="whatsapp-section-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp className="whatsapp-section-icon" />
        <span className="whatsapp-section-text">Need Assistance?</span>
      </a>
    </div>
  );
};

export default WhatsAppSectionButton;
