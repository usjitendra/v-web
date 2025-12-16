const mongoose = require('mongoose');
const path = require('path');
const Doctor = require('../models/Doctor.cjs');
const Hospital = require('../models/Hospital.cjs');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

const sampleDoctors = [
    {
        firstName: "Rajesh",
        lastName: "Kumar",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1170&q=80",
        specialty: "Cardiologist",
        specialties: ["Cardiology", "Interventional Cardiology"],
        qualifications: [
            { degree: "MBBS", institute: "All India Institute of Medical Sciences", year: 2005 },
            { degree: "MD - Cardiology", institute: "Christian Medical College, Vellore", year: 2010 }
        ],
        experience: 15,
        languages: ["English", "Hindi", "Tamil"],
        rating: 4.8,
        totalRatings: 124,
        consultationFee: 1500,
        availability: {
            Monday: [{ start: "09:00", end: "17:00" }],
            Tuesday: [{ start: "09:00", end: "17:00" }],
            Wednesday: [{ start: "09:00", end: "13:00" }],
            Thursday: [{ start: "09:00", end: "17:00" }],
            Friday: [{ start: "09:00", end: "17:00" }],
            Saturday: [{ start: "10:00", end: "14:00" }]
        },
        bio: "Senior Cardiologist with over 15 years of experience treating complex heart conditions.",
        awards: [{ name: "Best Cardiologist Award", year: 2019, presentedBy: "Indian Medical Association" }],
        memberships: ["Cardiological Society of India", "American College of Cardiology"],
        publications: [
            { title: "Advanced Techniques in Coronary Angioplasty", journal: "Journal of Interventional Cardiology", year: 2018, link: "https://example.com/publication1" }
        ]
    },
    {
        firstName: "Priya",
        lastName: "Sharma",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1170&q=80",
        specialty: "Orthopedic Surgeon",
        specialties: ["Orthopedics", "Joint Replacement"],
        qualifications: [
            { degree: "MBBS", institute: "Grant Medical College, Mumbai", year: 2008 },
            { degree: "MS - Orthopedics", institute: "King Edward Memorial Hospital", year: 2013 }
        ],
        experience: 12,
        languages: ["English", "Hindi", "Marathi"],
        rating: 4.7,
        totalRatings: 98,
        consultationFee: 1200,
        availability: {
            Monday: [{ start: "10:00", end: "18:00" }],
            Tuesday: [{ start: "10:00", end: "18:00" }],
            Wednesday: [{ start: "10:00", end: "18:00" }],
            Thursday: [{ start: "10:00", end: "15:00" }],
            Friday: [{ start: "10:00", end: "18:00" }]
        },
        bio: "Expert orthopedic surgeon specializing in joint replacement and sports injuries.",
        awards: [{ name: "Excellence in Orthopedics", year: 2020, presentedBy: "Indian Orthopaedic Association" }],
        memberships: ["Indian Orthopaedic Association", "International Society of Orthopaedic Surgery"],
        publications: [
            { title: "Minimally Invasive Techniques in Knee Replacement", journal: "Journal of Orthopaedic Surgery", year: 2019, link: "https://example.com/publication2" }
        ]
    },
    {
        firstName: "Amit",
        lastName: "Verma",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1170&q=80",
        specialty: "Neurologist",
        specialties: ["Neurology", "Stroke Management"],
        qualifications: [
            { degree: "MBBS", institute: "Maulana Azad Medical College", year: 2006 },
            { degree: "DM - Neurology", institute: "AIIMS, Delhi", year: 2012 }
        ],
        experience: 14,
        languages: ["English", "Hindi"],
        rating: 4.9,
        totalRatings: 210,
        consultationFee: 1600,
        availability: {
            Monday: [{ start: "11:00", end: "17:00" }],
            Wednesday: [{ start: "11:00", end: "17:00" }],
            Friday: [{ start: "11:00", end: "17:00" }]
        },
        bio: "Specialist in stroke and neurodegenerative diseases with extensive research background.",
        awards: [{ name: "Best Neurologist Award", year: 2021, presentedBy: "Neurological Society of India" }],
        memberships: ["Indian Academy of Neurology"],
        publications: [
            { title: "Neuroplasticity in Stroke Recovery", journal: "Neurology Journal", year: 2020, link: "https://example.com/publication3" }
        ]
    },
    {
        firstName: "Sneha",
        lastName: "Patel",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1170&q=80",
        specialty: "Dermatologist",
        specialties: ["Dermatology", "Cosmetology"],
        qualifications: [
            { degree: "MBBS", institute: "BJ Medical College, Ahmedabad", year: 2011 },
            { degree: "MD - Dermatology", institute: "Nair Hospital, Mumbai", year: 2015 }
        ],
        experience: 10,
        languages: ["English", "Gujarati", "Hindi"],
        rating: 4.6,
        totalRatings: 150,
        consultationFee: 1000,
        availability: {
            Tuesday: [{ start: "09:00", end: "14:00" }],
            Thursday: [{ start: "13:00", end: "18:00" }],
            Saturday: [{ start: "10:00", end: "15:00" }]
        },
        bio: "Renowned dermatologist known for advanced cosmetic treatments and skin surgery.",
        awards: [{ name: "Young Dermatologist Award", year: 2018, presentedBy: "Indian Association of Dermatologists" }],
        memberships: ["Indian Association of Dermatologists"],
        publications: [
            { title: "Advances in Laser Skin Treatment", journal: "Dermatology Today", year: 2019, link: "https://example.com/publication4" }
        ]
    },
    {
        firstName: "Manoj",
        lastName: "Singh",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b9642738?auto=format&fit=crop&w=1170&q=80",
        specialty: "Pediatrician",
        specialties: ["Pediatrics", "Neonatology"],
        qualifications: [
            { degree: "MBBS", institute: "Lady Hardinge Medical College", year: 2009 },
            { degree: "MD - Pediatrics", institute: "PGIMER Chandigarh", year: 2014 }
        ],
        experience: 11,
        languages: ["English", "Hindi"],
        rating: 4.8,
        totalRatings: 180,
        consultationFee: 900,
        availability: {
            Monday: [{ start: "09:00", end: "13:00" }],
            Wednesday: [{ start: "09:00", end: "13:00" }],
            Friday: [{ start: "09:00", end: "13:00" }]
        },
        bio: "Compassionate pediatrician with expertise in neonatal care and childhood immunizations.",
        awards: [{ name: "Pediatric Care Excellence", year: 2022, presentedBy: "Indian Academy of Pediatrics" }],
        memberships: ["Indian Academy of Pediatrics"],
        publications: [
            { title: "Neonatal Nutrition Guidelines", journal: "Indian Pediatrics", year: 2021, link: "https://example.com/publication5" }
        ]
    },
    {
        firstName: "Ritika",
        lastName: "Mehra",
        image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1170&q=80",
        specialty: "Gynecologist",
        specialties: ["Obstetrics", "Infertility"],
        qualifications: [
            { degree: "MBBS", institute: "St. John's Medical College", year: 2007 },
            { degree: "MD - Obstetrics & Gynaecology", institute: "AIIMS, Delhi", year: 2012 }
        ],
        experience: 13,
        languages: ["English", "Hindi", "Kannada"],
        rating: 4.9,
        totalRatings: 190,
        consultationFee: 1400,
        availability: {
            Tuesday: [{ start: "09:00", end: "16:00" }],
            Thursday: [{ start: "09:00", end: "16:00" }],
            Saturday: [{ start: "09:00", end: "16:00" }]
        },
        bio: "Specialist in high-risk pregnancies and fertility treatments with a patient-centered approach.",
        awards: [{ name: "Excellence in Women’s Health", year: 2020, presentedBy: "Federation of Obstetric & Gynaecological Societies of India" }],
        memberships: ["FOGSI"],
        publications: [
            { title: "New Horizons in Fertility Treatment", journal: "Indian Journal of Gynecology", year: 2020, link: "https://example.com/publication6" }
        ]
    },
    {
        firstName: "Arjun",
        lastName: "Rao",
        image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=1170&q=80",
        specialty: "ENT Specialist",
        specialties: ["Otolaryngology", "Head & Neck Surgery"],
        qualifications: [
            { degree: "MBBS", institute: "Kempegowda Institute of Medical Sciences", year: 2010 },
            { degree: "MS - ENT", institute: "Bangalore Medical College", year: 2015 }
        ],
        experience: 9,
        languages: ["English", "Kannada", "Hindi"],
        rating: 4.5,
        totalRatings: 120,
        consultationFee: 1100,
        availability: {
            Monday: [{ start: "10:00", end: "16:00" }],
            Thursday: [{ start: "10:00", end: "16:00" }],
            Friday: [{ start: "10:00", end: "16:00" }]
        },
        bio: "Experienced ENT surgeon skilled in endoscopic sinus surgeries and cochlear implants.",
        awards: [{ name: "ENT Excellence Award", year: 2021, presentedBy: "Indian ENT Association" }],
        memberships: ["Association of Otolaryngologists of India"],
        publications: [
            { title: "Advances in Cochlear Implant Surgery", journal: "ENT Journal", year: 2021, link: "https://example.com/publication7" }
        ]
    },
    {
        firstName: "Farah",
        lastName: "Khan",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1170&q=80",
        specialty: "Psychiatrist",
        specialties: ["Adult Psychiatry", "Child & Adolescent Psychiatry"],
        qualifications: [
            { degree: "MBBS", institute: "Osmania Medical College", year: 2008 },
            { degree: "MD - Psychiatry", institute: "NIMHANS", year: 2013 }
        ],
        experience: 12,
        languages: ["English", "Hindi", "Urdu"],
        rating: 4.8,
        totalRatings: 160,
        consultationFee: 1300,
        availability: {
            Tuesday: [{ start: "11:00", end: "17:00" }],
            Friday: [{ start: "11:00", end: "17:00" }],
            Saturday: [{ start: "11:00", end: "17:00" }]
        },
        bio: "Compassionate psychiatrist with expertise in adolescent mental health and mood disorders.",
        awards: [{ name: "Mental Health Advocate Award", year: 2019, presentedBy: "Indian Psychiatric Society" }],
        memberships: ["Indian Psychiatric Society"],
        publications: [
            { title: "Cognitive Behavioral Therapy in Adolescents", journal: "Psychiatry Today", year: 2020, link: "https://example.com/publication8" }
        ]
    },
    {
        firstName: "Kiran",
        lastName: "Desai",
        image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1170&q=80",
        specialty: "Oncologist",
        specialties: ["Medical Oncology", "Radiation Oncology"],
        qualifications: [
            { degree: "MBBS", institute: "Gujarat Medical College", year: 2006 },
            { degree: "DM - Oncology", institute: "Tata Memorial Hospital", year: 2012 }
        ],
        experience: 16,
        languages: ["English", "Hindi", "Gujarati"],
        rating: 4.9,
        totalRatings: 220,
        consultationFee: 2000,
        availability: {
            Monday: [{ start: "10:00", end: "18:00" }],
            Wednesday: [{ start: "10:00", end: "18:00" }],
            Friday: [{ start: "10:00", end: "18:00" }]
        },
        bio: "Highly experienced oncologist with specialization in chemotherapy and radiation therapy.",
        awards: [{ name: "Oncology Excellence Award", year: 2018, presentedBy: "Indian Cancer Society" }],
        memberships: ["Indian Society of Medical & Pediatric Oncology"],
        publications: [
            { title: "Targeted Therapies in Oncology", journal: "Cancer Research Journal", year: 2021, link: "https://example.com/publication9" }
        ]
    },
    {
        firstName: "राजेश",
        lastName: "कुमार",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1170&q=80",
        specialty: "हृदय रोग विशेषज्ञ",
        specialties: ["हृदय रोग विज्ञान", "इंटरवेंशनल कार्डियोलॉजी"],
        qualifications: [
            { degree: "एमबीबीएस", institute: "ऑल इंडिया इंस्टीट्यूट ऑफ मेडिकल साइंसेज़", year: 2005 },
            { degree: "एमडी - हृदय रोग विज्ञान", institute: "क्रिश्चियन मेडिकल कॉलेज, वेल्लोर", year: 2010 }
        ],
        experience: 15,
        languages: ["अंग्रेज़ी", "हिंदी", "तमिल"],
        rating: 4.8,
        totalRatings: 124,
        consultationFee: 1500,
        availability: {
            सोमवार: [{ start: "09:00", end: "17:00" }],
            मंगलवार: [{ start: "09:00", end: "17:00" }],
            बुधवार: [{ start: "09:00", end: "13:00" }],
            गुरुवार: [{ start: "09:00", end: "17:00" }],
            शुक्रवार: [{ start: "09:00", end: "17:00" }],
            शनिवार: [{ start: "10:00", end: "14:00" }]
        },
        bio: "15 वर्षों के अनुभव वाले वरिष्ठ हृदय रोग विशेषज्ञ, जटिल हृदय स्थितियों के इलाज में विशेषज्ञ।",
        awards: [{ name: "सर्वश्रेष्ठ हृदय रोग विशेषज्ञ पुरस्कार", year: 2019, presentedBy: "इंडियन मेडिकल एसोसिएशन" }],
        memberships: ["इंडियन कार्डियोलॉजिकल सोसाइटी", "अमेरिकन कॉलेज ऑफ कार्डियोलॉजी"],
        publications: [
            { title: "कोरोनरी एंजियोप्लास्टी में उन्नत तकनीकें", journal: "जर्नल ऑफ इंटरवेंशनल कार्डियोलॉजी", year: 2018, link: "https://example.com/publication1" }
        ],
        language: "HI"
    },
    {
        firstName: "प्रिया",
        lastName: "शर्मा",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1170&q=80",
        specialty: "अस्थि शल्य चिकित्सक",
        specialties: ["अस्थि रोग", "जोड़ प्रत्यारोपण"],
        qualifications: [
            { degree: "एमबीबीएस", institute: "ग्रांट मेडिकल कॉलेज, मुंबई", year: 2008 },
            { degree: "एमएस - अस्थि रोग", institute: "किंग एडवर्ड मेमोरियल हॉस्पिटल", year: 2013 }
        ],
        experience: 12,
        languages: ["अंग्रेज़ी", "हिंदी", "मराठी"],
        rating: 4.7,
        totalRatings: 98,
        consultationFee: 1200,
        availability: {
            सोमवार: [{ start: "10:00", end: "18:00" }],
            मंगलवार: [{ start: "10:00", end: "18:00" }],
            बुधवार: [{ start: "10:00", end: "18:00" }],
            गुरुवार: [{ start: "10:00", end: "15:00" }],
            शुक्रवार: [{ start: "10:00", end: "18:00" }]
        },
        bio: "जोड़ प्रत्यारोपण और खेल चोटों में विशेषज्ञ अनुभवी अस्थि शल्य चिकित्सक।",
        awards: [{ name: "ऑर्थोपेडिक्स में उत्कृष्टता", year: 2020, presentedBy: "इंडियन ऑर्थोपेडिक एसोसिएशन" }],
        memberships: ["इंडियन ऑर्थोपेडिक एसोसिएशन", "इंटरनेशनल सोसाइटी ऑफ ऑर्थोपेडिक सर्जरी"],
        publications: [
            { title: "घुटने प्रत्यारोपण में न्यूनतम इनवेसिव तकनीकें", journal: "जर्नल ऑफ ऑर्थोपेडिक सर्जरी", year: 2019, link: "https://example.com/publication2" }
        ],
        language: "HI"
    },
    {
        firstName: "अमित",
        lastName: "वर्मा",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1170&q=80",
        specialty: "तंत्रिका रोग विशेषज्ञ",
        specialties: ["न्यूरोलॉजी", "स्ट्रोक प्रबंधन"],
        qualifications: [
            { degree: "एमबीबीएस", institute: "मौलाना आज़ाद मेडिकल कॉलेज", year: 2006 },
            { degree: "डीएम - न्यूरोलॉजी", institute: "एम्स, दिल्ली", year: 2012 }
        ],
        experience: 14,
        languages: ["अंग्रेज़ी", "हिंदी"],
        rating: 4.9,
        totalRatings: 210,
        consultationFee: 1600,
        availability: {
            सोमवार: [{ start: "11:00", end: "17:00" }],
            बुधवार: [{ start: "11:00", end: "17:00" }],
            शुक्रवार: [{ start: "11:00", end: "17:00" }]
        },
        bio: "स्ट्रोक और न्यूरोडीजेनेरेटिव रोगों में विशेषज्ञ, व्यापक शोध अनुभव के साथ।",
        awards: [{ name: "सर्वश्रेष्ठ न्यूरोलॉजिस्ट पुरस्कार", year: 2021, presentedBy: "न्यूरोलॉजिकल सोसाइटी ऑफ इंडिया" }],
        memberships: ["इंडियन एकेडमी ऑफ न्यूरोलॉजी"],
        publications: [
            { title: "स्ट्रोक रिकवरी में न्यूरोप्लास्टिसिटी", journal: "न्यूरोलॉजी जर्नल", year: 2020, link: "https://example.com/publication3" }
        ],
        language: "HI"
    },
    {
        firstName: "स्नेहा",
        lastName: "पटेल",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1170&q=80",
        specialty: "त्वचा रोग विशेषज्ञ",
        specialties: ["त्वचा विज्ञान", "कॉस्मेटोलॉजी"],
        qualifications: [
            { degree: "एमबीबीएस", institute: "बीजे मेडिकल कॉलेज, अहमदाबाद", year: 2011 },
            { degree: "एमडी - त्वचा विज्ञान", institute: "नायर हॉस्पिटल, मुंबई", year: 2015 }
        ],
        experience: 10,
        languages: ["अंग्रेज़ी", "गुजराती", "हिंदी"],
        rating: 4.6,
        totalRatings: 150,
        consultationFee: 1000,
        availability: {
            मंगलवार: [{ start: "09:00", end: "14:00" }],
            गुरुवार: [{ start: "13:00", end: "18:00" }],
            शनिवार: [{ start: "10:00", end: "15:00" }]
        },
        bio: "उन्नत कॉस्मेटिक उपचार और त्वचा शल्य चिकित्सा के लिए प्रसिद्ध त्वचा रोग विशेषज्ञ।",
        awards: [{ name: "यंग डर्मेटोलॉजिस्ट पुरस्कार", year: 2018, presentedBy: "इंडियन एसोसिएशन ऑफ डर्मेटोलॉजिस्ट्स" }],
        memberships: ["इंडियन एसोसिएशन ऑफ डर्मेटोलॉजिस्ट्स"],
        publications: [
            { title: "लेजर स्किन ट्रीटमेंट में प्रगति", journal: "डर्मेटोलॉजी टुडे", year: 2019, link: "https://example.com/publication4" }
        ],
        language: "HI"
    },
    {
        firstName: "मनोज",
        lastName: "सिंह",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b9642738?auto=format&fit=crop&w=1170&q=80",
        specialty: "बाल रोग विशेषज्ञ",
        specialties: ["बाल रोग", "नवजात देखभाल"],
        qualifications: [
            { degree: "एमबीबीएस", institute: "लेडी हार्डिंग मेडिकल कॉलेज", year: 2009 },
            { degree: "एमडी - बाल रोग", institute: "पीजीआईएमईआर चंडीगढ़", year: 2014 }
        ],
        experience: 11,
        languages: ["अंग्रेज़ी", "हिंदी"],
        rating: 4.8,
        totalRatings: 180,
        consultationFee: 900,
        availability: {
            सोमवार: [{ start: "09:00", end: "13:00" }],
            बुधवार: [{ start: "09:00", end: "13:00" }],
            शुक्रवार: [{ start: "09:00", end: "13:00" }]
        },
        bio: "नवजात देखभाल और बाल टीकाकरण में विशेषज्ञ दयालु बाल रोग विशेषज्ञ।",
        awards: [{ name: "पीडियाट्रिक केयर एक्सीलेंस", year: 2022, presentedBy: "इंडियन एकेडमी ऑफ पीडियाट्रिक्स" }],
        memberships: ["इंडियन एकेडमी ऑफ पीडियाट्रिक्स"],
        publications: [
            { title: "नवजात पोषण दिशानिर्देश", journal: "इंडियन पीडियाट्रिक्स", year: 2021, link: "https://example.com/publication5" }
        ],
        language: "HI"
    },
    {
        firstName: "ऋतिका",
        lastName: "मेहरा",
        image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1170&q=80",
        specialty: "स्त्री रोग विशेषज्ञ",
        specialties: ["प्रसूति", "बांझपन"],
        qualifications: [
            { degree: "एमबीबीएस", institute: "सेंट जॉन्स मेडिकल कॉलेज", year: 2007 },
            { degree: "एमडी - प्रसूति एवं स्त्री रोग", institute: "एम्स, दिल्ली", year: 2012 }
        ],
        experience: 13,
        languages: ["अंग्रेज़ी", "हिंदी", "कन्नड़"],
        rating: 4.9,
        totalRatings: 190,
        consultationFee: 1400,
        availability: {
            मंगलवार: [{ start: "09:00", end: "16:00" }],
            गुरुवार: [{ start: "09:00", end: "16:00" }],
            शनिवार: [{ start: "09:00", end: "16:00" }]
        },
        bio: "उच्च जोखिम वाली गर्भावस्थाओं और प्रजनन उपचारों में विशेषज्ञ, रोगी-केंद्रित दृष्टिकोण के साथ।",
        awards: [{ name: "महिला स्वास्थ्य में उत्कृष्टता", year: 2020, presentedBy: "फेडरेशन ऑफ ऑब्स्टेट्रिक एंड गाइनकोलॉजिकल सोसाइटीज़ ऑफ इंडिया" }],
        memberships: ["एफओजीएसआई"],
        publications: [
            { title: "प्रजनन उपचार में नई दिशाएं", journal: "इंडियन जर्नल ऑफ गायनेकोलॉजी", year: 2020, link: "https://example.com/publication6" }
        ],
        language: "HI"
    },
    {
        firstName: "अर्जुन",
        lastName: "राव",
        image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=1170&q=80",
        specialty: "ईएनटी विशेषज्ञ",
        specialties: ["कान-नाक-गला रोग", "सिर एवं गर्दन शल्य चिकित्सा"],
        qualifications: [
            { degree: "एमबीबीएस", institute: "केम्पेगौड़ा इंस्टीट्यूट ऑफ मेडिकल साइंसेज", year: 2010 },
            { degree: "एमएस - ईएनटी", institute: "बैंगलोर मेडिकल कॉलेज", year: 2015 }
        ],
        experience: 9,
        languages: ["अंग्रेज़ी", "कन्नड़", "हिंदी"],
        rating: 4.5,
        totalRatings: 120,
        consultationFee: 1100,
        availability: {
            सोमवार: [{ start: "10:00", end: "16:00" }],
            गुरुवार: [{ start: "10:00", end: "16:00" }],
            शुक्रवार: [{ start: "10:00", end: "16:00" }]
        },
        bio: "एंडोस्कोपिक साइनस सर्जरी और कॉकलियर इम्प्लांट में कुशल अनुभवी ईएनटी सर्जन।",
        awards: [{ name: "ईएनटी उत्कृष्टता पुरस्कार", year: 2021, presentedBy: "इंडियन ईएनटी एसोसिएशन" }],
        memberships: ["एसोसिएशन ऑफ ओटोलैरिंजोलॉजिस्ट्स ऑफ इंडिया"],
        publications: [
            { title: "कॉकलियर इम्प्लांट सर्जरी में प्रगति", journal: "ईएनटी जर्नल", year: 2021, link: "https://example.com/publication7" }
        ],
        language: "HI"
    },
    {
        firstName: "फ़राह",
        lastName: "ख़ान",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1170&q=80",
        specialty: "मनोचिकित्सक",
        specialties: ["वयस्क मनोचिकित्सा", "बाल एवं किशोर मनोचिकित्सा"],
        qualifications: [
            { degree: "एमबीबीएस", institute: "उस्मानिया मेडिकल कॉलेज", year: 2008 },
            { degree: "एमडी - मनोचिकित्सा", institute: "निम्हान्स", year: 2013 }
        ],
        experience: 12,
        languages: ["अंग्रेज़ी", "हिंदी", "उर्दू"],
        rating: 4.8,
        totalRatings: 160,
        consultationFee: 1300,
        availability: {
            मंगलवार: [{ start: "11:00", end: "17:00" }],
            शुक्रवार: [{ start: "11:00", end: "17:00" }],
            शनिवार: [{ start: "11:00", end: "17:00" }]
        },
        bio: "किशोर मानसिक स्वास्थ्य और मूड विकारों में विशेषज्ञ दयालु मनोचिकित्सक।",
        awards: [{ name: "मानसिक स्वास्थ्य अधिवक्ता पुरस्कार", year: 2019, presentedBy: "इंडियन साइकिएट्रिक सोसाइटी" }],
        memberships: ["इंडियन साइकिएट्रिक सोसाइटी"],
        publications: [
            { title: "किशोरों में संज्ञानात्मक व्यवहार थेरेपी", journal: "साइकिएट्री टुडे", year: 2020, link: "https://example.com/publication8" }
        ],
        language: "HI"
    },
    {
        firstName: "किरण",
        lastName: "देसी",
        image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1170&q=80",
        specialty: "कैंसर विशेषज्ञ",
        specialties: ["चिकित्सकीय ऑन्कोलॉजी", "विकिरण ऑन्कोलॉजी"],
        qualifications: [
            { degree: "एमबीबीएस", institute: "गुजरात मेडिकल कॉलेज", year: 2006 },
            { degree: "डीएम - ऑन्कोलॉजी", institute: "टाटा मेमोरियल हॉस्पिटल", year: 2012 }
        ],
        experience: 16,
        languages: ["अंग्रेज़ी", "हिंदी", "गुजराती"],
        rating: 4.9,
        totalRatings: 220,
        consultationFee: 2000,
        availability: {
            सोमवार: [{ start: "10:00", end: "18:00" }],
            बुधवार: [{ start: "10:00", end: "18:00" }],
            शुक्रवार: [{ start: "10:00", end: "18:00" }]
        },
        bio: "कीमोथेरेपी और विकिरण उपचार में विशेषज्ञता वाले अत्यधिक अनुभवी कैंसर विशेषज्ञ।",
        awards: [{ name: "ऑन्कोलॉजी उत्कृष्टता पुरस्कार", year: 2018, presentedBy: "इंडियन कैंसर सोसाइटी" }],
        memberships: ["इंडियन सोसाइटी ऑफ मेडिकल एंड पीडियाट्रिक ऑन्कोलॉजी"],
        publications: [
            { title: "ऑन्कोलॉजी में लक्षित उपचार", journal: "कैंसर रिसर्च जर्नल", year: 2021, link: "https://example.com/publication9" }
        ],
        language: "HI"
    }


];


const migrateDoctors = async () => {
    try {
        // 1. Connect to DB
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000
        });
        console.log('✅ MongoDB connected for hospital migration');

        // Clear existing data
        await Doctor.deleteMany({});
        console.log('Cleared existing doctor data');

        // Get hospitals to assign to doctors
        const hospitals = await Hospital.find({});

        if (hospitals.length === 0) {
            throw new Error('Please migrate hospitals first');
        }

        // // Assign hospitals to sample doctors
        // sampleDoctors[0].hospital = hospitals[0]._id; // Apollo Hospitals
        // sampleDoctors[1].hospital = hospitals[1]._id; // Fortis Memorial
        // sampleDoctors[2].hospital = hospitals[0]._id; // Apollo Hospitals
        // sampleDoctors[3].hospital = hospitals[0]._id; // Apollo Hospitals

        sampleDoctors.forEach((doctor, idx) => {
            doctor.hospital = hospitals[idx % hospitals.length]._id;  // round-robin assignment
        });

        // Insert sample data
        await Doctor.insertMany(sampleDoctors);
        console.log('Sample doctors data migrated successfully');

        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

migrateDoctors();