import { FaClock, FaProcedures } from "react-icons/fa";
import { Link } from "react-router-dom";

const TreatmentCard = ({ t }) => {
  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case "Low": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "High": return "text-orange-600";
      case "Very High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div
      className="
        bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100
        hover:shadow-lg transition-shadow
        flex flex-col h-full        /* पूरा कार्ड column flex */
      "
    >
      {/* === Top Content === */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={t.icon}
            alt={t.title}
            className="w-20 object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <h3 className="text-xl font-bold text-gray-800">{t.title}</h3>
        </div>

        <div className="flex items-center text-teal-600 font-semibold mb-3">
          <FaProcedures className="mr-2" />
          <span>{t.category}</span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{t.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4 mt-auto">
          <div className="flex items-center text-gray-600">
            <FaClock className="mr-2 text-gray-400" />
            <span className="text-sm">{t.typicalDuration} min</span>
          </div>
          <div
            className={`flex items-center font-semibold ${getComplexityColor(
              t.typicalComplexity
            )}`}
          >
            <span className="text-sm">{t.typicalComplexity}</span>
          </div>
        </div>

        {t.typicalRecoveryTime && (
          <div className="mb-4 p-2 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Recovery: {t.typicalRecoveryTime}
            </p>
          </div>
        )}
      </div>

      {/* === Bottom Button (हमेशा बिल्कुल नीचे) === */}
      <Link
        to={`/treatments/${t._id}`}
        className="
          block w-full bg-teal-600 text-white text-center py-3
          font-semibold hover:bg-teal-700 transition-colors
          rounded-b-2xl
          mt-auto      /* यह बटन को कार्ड के बिलकुल नीचे धकेलेगा */
        "
      >
        View Details
      </Link>
    </div>
  );
};

export default TreatmentCard;
