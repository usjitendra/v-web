import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DoctorCard from "../DoctorCard";

export default function DoctorSection({ doctors }) {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    // Group doctors into pairs
    const doctorPairs = [];
    for (let i = 0; i < doctors.length; i += 2) {
        doctorPairs.push(doctors.slice(i, i + 2));
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Meet our Doctors</h2>
            {doctors.length > 0 ? (
                <div className="relative">
                    {/* Left Arrow */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                        <FaChevronLeft className="text-gray-600" />
                    </button>

                    {/* Scrollable Container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x snap-mandatory"
                    >
                        {doctorPairs.map((pair, index) => (
                            <div key={index} className="flex-none w-64 md:w-80 lg:w-96 flex flex-col space-y-4 snap-start">
                                {pair.map((doctor, idx) => (
                                    <DoctorCard doc={doctor} key={idx} />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                        <FaChevronRight className="text-gray-600" />
                    </button>
                </div>
            ) : (
                <p className="text-gray-500 text-center py-8">No doctors available.</p>
            )}
        </div>
    );
}
