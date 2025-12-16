// Dummy hospital data for I.A.U VM Medical Park Florya Hospital
const dummyHospitals = [
    {
        _id: "iau-vm-medical-park",
        name: "I.A.U VM Medical Park Florya Hospital",
        country: { name: "Turkey" },
        city: { name: "Istanbul" },
        address: "Besyol, Florya, Akasya Sk. No:4 D:1, Istanbul, 34295, Turkey",
        coordinates: { lat: 40.9760, lng: 28.7836 },
        accreditation: ["JCI", "NABH"],
        facilities: [
            "TV in room", "Private rooms", "Free Wifi", "Phone in Room", "Mobility accessible rooms",
            "Family accommodation", "Laundry", "Welcome Safe", "Nursery services", "Dry cleaning",
            "Personal concierge", "Prayer room", "Fitness center", "Spa and wellness", "Café",
            "Business center", "Shopping", "Beauty Salon", "Parking", "ATM", "Hairdressing salon",
            "Newspaper service", "Restaurants", "Vegetarian menu", "Diet menu", "Interpreter services"
        ],
        specialties: [
            { _id: "cardio", name: "Cardiology & Cardiac Surgery", icon: "FaHeart" },
            { _id: "neuro", name: "Neurology & Neurosurgery", icon: "FaBrain" },
            { _id: "ortho", name: "Orthopedics", icon: "FaBone" },
            { _id: "onco", name: "Oncology", icon: "FaPlusSquare" },
            { _id: "gastro", name: "Gastroenterology", icon: "FaStethoscope" },
            { _id: "hepatology", name: "Hepatology", icon: "FaStethoscope" },
            { _id: "ophthal", name: "Ophthalmology", icon: "FaEye" },
            { _id: "spine", name: "Spine Surgery", icon: "FaBone" },
            { _id: "plastic", name: "Cosmetic & Plastic Surgery", icon: "FaSyringe" },
            { _id: "general", name: "General Surgery", icon: "FaStethoscope" },
            { _id: "nephro", name: "Nephrology", icon: "FaStethoscope" },
            { _id: "bariatric", name: "Bariatric Surgery", icon: "FaStethoscope" },
            { _id: "gyneco", name: "Obstetrics & Gynecology", icon: "FaStethoscope" }
        ],
        rating: 4.8,
        totalRatings: 16,
        beds: 300,
        established: 2017,
        area: "51,000 m²",
        operationRooms: 13,
        outpatientFacilities: 92,
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop",
        phone: "+90 212 867 0000",
        email: "info@medicalparkflorya.com",
        website: "https://medicalpark.com.tr/florya",
        languages: ["Arabic", "English", "French", "German", "Greek", "Russian", "Swedish", "Turkish", "Romanian"],
        description: `Established in 2017, I.A.U. V.M. Medical Park Florya Hospital is a multidisciplinary JCI-accredited hospital with 300-bed capacity. The hospital provides comprehensive medical treatments including Cardiac Surgery, Oncology, Obstetrics & Gynecology, General Surgery, and Orthopedics.

The hospital features modern diagnostic methods such as Biopsy, Transesophageal echocardiography, Colonoscopy, Hormone Tests, and Heart M.R.I. They have a team of highly professional medical staff fluent in multiple languages for international patients' comfort.

Based on the 360-degree concept of service, the hospital offers world-class healthcare infrastructure with rooms designed like 5-star hotels, ensuring maximum comfort during treatment.`,

        transportation: {
            airport: { distance: "44 km", time: "41 minutes" },
            railway: { distance: "22.7 km", time: "26 minutes" }
        },

        doctors: [
            {
                id: 1,
                name: "Op. Dr. Semih Tiber Mentese",
                specialty: "Aesthetics and Plastic Surgeon",
                rating: 4.6,
                ratingsCount: 97,
                experience: 14,
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
            },
            {
                id: 2,
                name: "Assoc. Dr. Sami Sökücü",
                specialty: "Orthopaedic and Joint Replacement Surgeon",
                experience: 20,
                image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face"
            },
            {
                id: 3,
                name: "Dr. Ahmet Alperen Koc",
                specialty: "Ophthalmologist",
                experience: 14,
                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face"
            },
            {
                id: 4,
                name: "Dr. Baris Demiriz",
                specialty: "General Surgeon",
                experience: 17,
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
            }
        ],

        patientReviews: [
            {
                id: 1,
                patientName: "Mrs. Eva Vigario",
                country: "Angola",
                rating: 5,
                comment: "My gastric sleeve surgery took place at Medical Park Hospital, and it was a success. The nurses and doctors provided exceptional care throughout my stay! Thanks!",
                date: "2024-01-15"
            },
            {
                id: 2,
                patientName: "Seth Wiggins",
                country: "United States",
                rating: 5,
                comment: "I travelled from the USA to Turkey for rhinoplasty and hair transplantation at Medical Park Hospital. The experience was outstanding. Highly recommended!",
                date: "2024-02-20"
            }
        ]
    }
];
