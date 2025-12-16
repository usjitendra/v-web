const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
const Hospital = require('../models/Hospital.cjs');
const HospitalDetail = require('../models/HospitalDetail.cjs');

const hospitalDetailsData = [
    {
        hospitalName: "Apollo Hospitals, Delhi",
        description:
            "Apollo Hospitals, Delhi is a state-of-the-art multi-specialty hospital offering comprehensive healthcare services. With cutting-edge technology and renowned medical professionals, it provides world-class treatment across cardiac care, orthopedics, neurology, and cancer treatment.",
        address: "Mathura Road, New Delhi - 110076",
        coordinates: { lat: 28.5245, lng: 77.1855 },
        facilities: ["ICU", "Emergency", "Pharmacy", "Cafeteria", "WiFi", "Parking"],
        operationRooms: 15,
        outpatientFacilities: 50,
        totalArea: "45,000 m²",
        established: 1996,
        website: "https://apollohospitals.com/delhi",
        email: "info@apollodelhi.com",
        languages: ["English", "Hindi"],
        transportation: {
            airport: { distance: "20 km", time: "45 minutes" },
            railway: { distance: "8 km", time: "20 minutes" }
        },
        infrastructure: {
            parking: true,
            atm: true,
            prayerRoom: true,
            businessCenter: true,
            cafes: 2,
            restaurants: 1
        }
    },
    {
        hospitalName: "Fortis Memorial, Gurgaon",
        description:
            "Fortis Memorial Research Institute is a quaternary care hospital renowned for advanced neurosurgery, transplants, and pediatric specialties. It provides comprehensive international patient services and cutting-edge critical care.",
        address: "Sector 44, Gurugram, Haryana - 122002",
        coordinates: { lat: 28.4501, lng: 77.0722 },
        facilities: ["ICU", "24/7 Emergency", "Pharmacy", "WiFi", "Parking", "Blood Bank"],
        operationRooms: 18,
        outpatientFacilities: 60,
        totalArea: "55,000 m²",
        established: 2001,
        website: "https://www.fortishealthcare.com/india/hospitals-in-gurgaon",
        email: "info@fortisgurgaon.com",
        languages: ["English", "Hindi", "Arabic"],
        transportation: {
            airport: { distance: "15 km", time: "25 minutes" },
            railway: { distance: "12 km", time: "30 minutes" }
        },
        infrastructure: {
            parking: true,
            atm: true,
            prayerRoom: true,
            businessCenter: true,
            cafes: 3,
            restaurants: 2
        }
    },
    {
        hospitalName: "Max Super Speciality, Saket",
        description:
            "Max Super Speciality Hospital in Saket offers advanced oncology, ENT, and GI surgery programs. Known for minimally invasive techniques and comprehensive cancer care.",
        address: "Press Enclave Road, Saket, New Delhi - 110017",
        coordinates: { lat: 28.5281, lng: 77.2197 },
        facilities: ["ICU", "Emergency", "Pharmacy", "WiFi", "Parking", "Blood Bank"],
        operationRooms: 12,
        outpatientFacilities: 40,
        totalArea: "38,000 m²",
        established: 2004,
        website: "https://www.maxhealthcare.in/hospital-network/max-super-speciality-hospital-saket",
        email: "info@maxsaket.com",
        languages: ["English", "Hindi"],
        transportation: {
            airport: { distance: "17 km", time: "35 minutes" },
            railway: { distance: "10 km", time: "25 minutes" }
        },
        infrastructure: {
            parking: true,
            atm: true,
            prayerRoom: true,
            businessCenter: false,
            cafes: 1,
            restaurants: 1
        }
    },
    {
        hospitalName: "Kokilaben Dhirubhai Ambani, Mumbai",
        description:
            "Kokilaben Hospital is a premier tertiary care center offering robotic surgery, cardiology, and orthopedic excellence with globally accredited standards.",
        address: "Four Bungalows, Andheri West, Mumbai - 400053",
        coordinates: { lat: 19.1307, lng: 72.8261 },
        facilities: ["ICU", "Emergency", "Robotic Surgery", "Pharmacy", "WiFi", "Parking"],
        operationRooms: 20,
        outpatientFacilities: 70,
        totalArea: "60,000 m²",
        established: 2009,
        website: "https://www.kokilabenhospital.com",
        email: "info@kokilabenhospital.com",
        languages: ["English", "Hindi", "Marathi"],
        transportation: {
            airport: { distance: "8 km", time: "20 minutes" },
            railway: { distance: "5 km", time: "15 minutes" }
        },
        infrastructure: {
            parking: true,
            atm: true,
            prayerRoom: true,
            businessCenter: true,
            cafes: 4,
            restaurants: 2
        }
    },
    {
        hospitalName: "Johns Hopkins Hospital, Baltimore",
        description:
            "A world-renowned academic medical center providing cutting-edge research-based treatment in neurology, oncology, and transplant care.",
        address: "1800 Orleans St, Baltimore, MD 21287, USA",
        coordinates: { lat: 39.2965, lng: -76.5920 },
        facilities: ["ICU", "Emergency", "Pharmacy", "Research Labs", "WiFi", "Parking"],
        operationRooms: 30,
        outpatientFacilities: 120,
        totalArea: "1,000,000 ft²",
        established: 1889,
        website: "https://www.hopkinsmedicine.org",
        email: "contact@jhmi.edu",
        languages: ["English", "Spanish"],
        transportation: {
            airport: { distance: "22 km", time: "30 minutes" },
            railway: { distance: "5 km", time: "10 minutes" }
        },
        infrastructure: {
            parking: true,
            atm: true,
            prayerRoom: true,
            businessCenter: true,
            cafes: 6,
            restaurants: 3
        }
    },
    {
        hospitalName: "Cleveland Clinic, Ohio",
        description:
            "Internationally recognized for cardiovascular care, Cleveland Clinic offers cutting-edge medical technology and specialized research programs.",
        address: "9500 Euclid Avenue, Cleveland, OH 44195, USA",
        coordinates: { lat: 41.5036, lng: -81.6200 },
        facilities: ["ICU", "Emergency", "Pharmacy", "Research Labs", "WiFi", "Parking"],
        operationRooms: 28,
        outpatientFacilities: 100,
        totalArea: "850,000 ft²",
        established: 1921,
        website: "https://my.clevelandclinic.org",
        email: "info@clevelandclinic.org",
        languages: ["English", "Spanish"],
        transportation: {
            airport: { distance: "26 km", time: "35 minutes" },
            railway: { distance: "6 km", time: "15 minutes" }
        },
        infrastructure: {
            parking: true,
            atm: true,
            prayerRoom: true,
            businessCenter: true,
            cafes: 5,
            restaurants: 2
        }
    },
    {
        hospitalName: "King's College Hospital, Dubai",
        description:
            "A premium healthcare facility offering UK-standard treatment with expertise in hepatology, cardiology, and general surgery.",
        address: "Dubai Hills, Dubai, UAE",
        coordinates: { lat: 25.1797, lng: 55.2744 },
        facilities: ["ICU", "Emergency", "Pharmacy", "VIP Suites", "WiFi", "Parking"],
        operationRooms: 14,
        outpatientFacilities: 60,
        totalArea: "50,000 m²",
        established: 2019,
        website: "https://kingscollegehospitaldubai.com",
        email: "info@kchdubai.com",
        languages: ["English", "Arabic"],
        transportation: {
            airport: { distance: "18 km", time: "25 minutes" },
            railway: { distance: "10 km", time: "20 minutes" }
        },
        infrastructure: {
            parking: true,
            atm: true,
            prayerRoom: true,
            businessCenter: true,
            cafes: 2,
            restaurants: 2
        }
    },
    {
        hospitalName: "Singapore General Hospital",
        description:
            "Singapore’s largest and oldest hospital delivering advanced patient care, medical education, and clinical research across multiple disciplines.",
        address: "Outram Road, Singapore 169608",
        coordinates: { lat: 1.2789, lng: 103.8354 },
        facilities: ["ICU", "Emergency", "Pharmacy", "Research Labs", "WiFi", "Parking"],
        operationRooms: 22,
        outpatientFacilities: 90,
        totalArea: "95,000 m²",
        established: 1821,
        website: "https://www.sgh.com.sg",
        email: "contact@sgh.com.sg",
        languages: ["English", "Mandarin", "Malay"],
        transportation: {
            airport: { distance: "20 km", time: "25 minutes" },
            railway: { distance: "3 km", time: "8 minutes" }
        },
        infrastructure: {
            parking: true,
            atm: true,
            prayerRoom: true,
            businessCenter: true,
            cafes: 3,
            restaurants: 2
        }
    },
    {
        hospitalName: "Charité – Universitätsmedizin Berlin",
        description:
            "One of Europe’s largest university hospitals, Charité is known for top-class research, teaching, and patient care across a broad spectrum of specialties.",
        address: "Charitéplatz 1, 10117 Berlin, Germany",
        coordinates: { lat: 52.5251, lng: 13.3799 },
        facilities: ["ICU", "Emergency", "Pharmacy", "Research Labs", "WiFi", "Parking"],
        operationRooms: 25,
        outpatientFacilities: 110,
        totalArea: "120,000 m²",
        established: 1710,
        website: "https://www.charite.de",
        email: "contact@charite.de",
        languages: ["German", "English"],
        transportation: {
            airport: { distance: "28 km", time: "35 minutes" },
            railway: { distance: "1 km", time: "5 minutes" }
        },
        infrastructure: {
            parking: true,
            atm: true,
            prayerRoom: true,
            businessCenter: true,
            cafes: 4,
            restaurants: 3
        }
    },
    {
        hospitalName: "St Thomas' Hospital, London",
        description:
            "A historic London hospital providing exemplary healthcare services with specialties in cardiac care, maternity, and renal medicine.",
        address: "Westminster Bridge Rd, London SE1 7EH, UK",
        coordinates: { lat: 51.4980, lng: -0.1180 },
        facilities: ["ICU", "Emergency", "Pharmacy", "WiFi", "Parking"],
        operationRooms: 16,
        outpatientFacilities: 70,
        totalArea: "65,000 m²",
        established: 1871,
        website: "https://www.guysandstthomas.nhs.uk",
        email: "info@stthomas.nhs.uk",
        languages: ["English"],
        transportation: {
            airport: { distance: "30 km", time: "45 minutes" },
            railway: { distance: "2 km", time: "10 minutes" }
        },
        infrastructure: {
            parking: true,
            atm: true,
            prayerRoom: true,
            businessCenter: false,
            cafes: 2,
            restaurants: 1
        }
    }
];


async function migrate() {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000
        });

        console.log('🚀 Starting hospital details migration...');

        for (const detailData of hospitalDetailsData) {
            // Find the hospital by name
            const hospital = await Hospital.findOne({ name: detailData.hospitalName });

            if (hospital) {
                // Check if details already exist
                const existingDetails = await HospitalDetail.findOne({ hospital: hospital._id });

                if (!existingDetails) {
                    const { hospitalName, ...details } = detailData;
                    await HospitalDetail.create({
                        hospital: hospital._id,
                        ...details
                    });
                    console.log(`✅ Added details for ${hospital.name}`);
                } else {
                    console.log(`ℹ️  Details already exist for ${hospital.name}`);
                }
            } else {
                console.log(`❌ Hospital not found: ${detailData.hospitalName}`);
            }
        }

        console.log('🎉 Hospital details migration completed!');

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB connection closed');
    }
}

migrate();