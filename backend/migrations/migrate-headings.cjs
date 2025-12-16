// migrations/migrateHeadings.cjs
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

const Heading = require('../models/Headings.cjs'); // Make sure path is correct

// Replace this with your JSON data
const headingsData = [
    {
        section: "treatment",
        language: "EN",
        home: [
            {
                heading: "Our Medical Services",
                subheading: "Specialized Treatments",
                description: "We offer a wide range of medical treatments and procedures with the highest standards of care"
            }
        ],
        page: [
            {
                heading: "Medical Treatments & Procedures",
                subheading: "",
                description: "Explore 2 medical treatments and procedures with advanced filtering options to find the right care for your needs."
            }
        ],
        detailPage: {
            navbar: ["Overview", "Hospitals", "Doctors", "Procedures"],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "hospital",
        language: "EN",
        home: [
            {
                heading: "Partner Hospitals",
                subheading: "World-Class Healthcare Facalities",
                description: "We collaborate with accredited hospitals that offer state-of-the-art technology and expert medical staff"
            }
        ],
        page: [
            {
                heading: "Our Medical Services",
                subheading: "",
                description: "We offer a wide range of medical treatments and procedures with the highest standards of care"
            }
        ],
        detailPage: {
            navbar: ["Overview", "Doctors", "Treatments", "Facilities", "Contact"],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "procedure",
        language: "EN",
        home: [
            {
                heading: "Lowest Quotes Assured",
                subheading: "Quality Care at Best Prices",
                description: "We constantly negotiate better prices and alternatives without compromising treatment quality, Our prices are consistently lower."
            }
        ],
        page: [
            { heading: "", subheading: "", description: "" }
        ],
        detailPage: {
            navbar: [""],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "process",
        language: "EN",
        home: [
            {
                heading: "Our Process",
                subheading: "Simple & Transparent",
                description: "From initial consultation to post-treatment care, we guide you through every step of your medical journey"
            }
        ],
        page: [
            { heading: "", subheading: "", description: "" }
        ],
        detailPage: {
            navbar: [""],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "service",
        language: "EN",
        home: [
            {
                heading: "Our services cover Every Need",
                subheading: "You will be assisted by a dedicated case manager from our team. ",
                description: "You will be assisted by a dedicated case manager from our team. List of services you can expect from us."
            }
        ],
        page: [
            { heading: "", subheading: "", description: "" }
        ],
        detailPage: {
            navbar: [""],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    // {
    //     section: "treatment",
    //     language: "HI",
    //     home: [
    //         {
    //             heading: "हमारी चिकित्सा सेवाएँ",
    //             subheading: "विशिष्ट उपचार",
    //             description: "हम देखभाल के उच्चतम मानकों के साथ चिकित्सा उपचार और प्रक्रियाओं की एक विस्तृत श्रृंखला प्रदान करते हैं"
    //         }
    //     ],
    //     page: [
    //         { heading: "", subheading: "", description: "" }
    //     ],
    //     detailPage: {
    //         navbar: [""],
    //         headings: [
    //             { level: "h1", text: "" }
    //         ]
    //     }
    // },
    {
        section: "doctor",
        language: "EN",
        home: [
            { heading: "", subheading: "", description: "" }
        ],
        page: [
            {
                heading: "Find Doctors",
                subheading: "",
                description: "Discover 4 medical specialists with advanced filtering options to find the right healthcare professional for your needs."
            }
        ],
        detailPage: {
            navbar: ["Overview", "Treatments", "Qualifications", "Contact"],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "blog",
        language: "EN",
        home: [
            {
                heading: "Latest Blog Posts",
                subheading: "",
                description: "Loading our latest health insights"
            }
        ],
        page: [
            {
                heading: "Our Blog",
                subheading: "",
                description: "Discover The latest health insights, tips and news from our medical experts."
            }
        ],
        detailPage: {
            navbar: [""],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "navbar",
        language: "EN",
        home: [{ heading: "", subheading: "", description: "" }],
        page: [{ heading: "", subheading: "", description: "" }],
        detailPage: {
            navbar: ["Home", "Treatments", "Doctors", "Hospitals", "About Us", "Log In"],
            headings: [{ level: "h1", text: "" }]
        }
    },
    {
        section: "navbar",
        language: "FR",
        home: [{ heading: "", subheading: "", description: "" }],
        page: [{ heading: "", subheading: "", description: "" }],
        detailPage: {
            navbar: ["1", "1", "1", "1", "1"],
            headings: [{ level: "h1", text: "" }]
        }
    },

    {
        section: "treatment",
        language: "HI",
        home: [
            {
                heading: "हमारी चिकित्सा सेवाएँ",
                subheading: "विशिष्ट उपचार",
                description: "हम देखभाल के उच्चतम मानकों के साथ चिकित्सा उपचार और प्रक्रियाओं की एक विस्तृत श्रृंखला प्रदान करते हैं"
            }
        ],
        page: [
            {
                heading: "चिकित्सा उपचार और प्रक्रियाएँ",
                subheading: "",
                description: "उन्नत फ़िल्टर विकल्पों के साथ 2 चिकित्सा उपचार और प्रक्रियाओं का अन्वेषण करें और अपनी ज़रूरत के अनुसार सही देखभाल चुनें।"
            }
        ],
        detailPage: {
            navbar: ["ओवरव्यू", "अस्पताल", "डॉक्टर", "प्रक्रियाएँ"],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "hospital",
        language: "HI",
        home: [
            {
                heading: "साझेदार अस्पताल",
                subheading: "विश्वस्तरीय स्वास्थ्य सुविधाएँ",
                description: "हम मान्यता प्राप्त अस्पतालों के साथ सहयोग करते हैं जो अत्याधुनिक तकनीक और विशेषज्ञ चिकित्सा स्टाफ प्रदान करते हैं।"
            }
        ],
        page: [
            {
                heading: "हमारी चिकित्सा सेवाएँ",
                subheading: "",
                description: "हम देखभाल के उच्चतम मानकों के साथ चिकित्सा उपचार और प्रक्रियाओं की एक विस्तृत श्रृंखला प्रदान करते हैं।"
            }
        ],
        detailPage: {
            navbar: ["ओवरव्यू", "डॉक्टर", "उपचार", "सुविधाएँ", "संपर्क करें"],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "procedure",
        language: "HI",
        home: [
            {
                heading: "सर्वोत्तम मूल्य सुनिश्चित",
                subheading: "बेहतरीन दाम में गुणवत्ता देखभाल",
                description: "हम लगातार बेहतर कीमतों और विकल्पों के लिए बातचीत करते हैं बिना उपचार की गुणवत्ता से समझौता किए। हमारे मूल्य लगातार कम होते हैं।"
            }
        ],
        page: [
            { heading: "", subheading: "", description: "" }
        ],
        detailPage: {
            navbar: [""],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "process",
        language: "HI",
        home: [
            {
                heading: "हमारी प्रक्रिया",
                subheading: "सरल और पारदर्शी",
                description: "प्रारंभिक परामर्श से लेकर उपचार के बाद की देखभाल तक, हम आपकी चिकित्सा यात्रा के हर चरण में मार्गदर्शन करते हैं।"
            }
        ],
        page: [
            { heading: "", subheading: "", description: "" }
        ],
        detailPage: {
            navbar: [""],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "service",
        language: "HI",
        home: [
            {
                heading: "हमारी सेवाएँ हर आवश्यकता को पूरा करती हैं",
                subheading: "आपकी सहायता हमारी टीम के समर्पित केस मैनेजर द्वारा की जाएगी।",
                description: "आपकी सहायता हमारी टीम के समर्पित केस मैनेजर द्वारा की जाएगी। हमारी सेवाओं की सूची देखें जिन्हें आप हमसे उम्मीद कर सकते हैं।"
            }
        ],
        page: [
            { heading: "", subheading: "", description: "" }
        ],
        detailPage: {
            navbar: [""],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "doctor",
        language: "HI",
        home: [
            { heading: "", subheading: "", description: "" }
        ],
        page: [
            {
                heading: "डॉक्टर खोजें",
                subheading: "",
                description: "उन्नत फ़िल्टर विकल्पों के साथ 4 चिकित्सा विशेषज्ञों का पता लगाएँ और अपनी ज़रूरत के अनुसार सही स्वास्थ्य पेशेवर चुनें।"
            }
        ],
        detailPage: {
            navbar: ["ओवरव्यू", "उपचार", "योग्यता", "संपर्क करें"],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "blog",
        language: "HI",
        home: [
            {
                heading: "नवीनतम ब्लॉग पोस्ट",
                subheading: "",
                description: "हमारे नवीनतम स्वास्थ्य जानकारियाँ लोड हो रही हैं"
            }
        ],
        page: [
            {
                heading: "हमारा ब्लॉग",
                subheading: "",
                description: "हमारे चिकित्सा विशेषज्ञों से नवीनतम स्वास्थ्य जानकारियाँ, टिप्स और समाचार खोजें।"
            }
        ],
        detailPage: {
            navbar: [""],
            headings: [
                { level: "h1", text: "" }
            ]
        }
    },
    {
        section: "navbar",
        language: "HI",
        home: [{ heading: "", subheading: "", description: "" }],
        page: [{ heading: "", subheading: "", description: "" }],
        detailPage: {
            navbar: ["होम", "उपचार", "डॉक्टर", "अस्पताल", "हमारे बारे में", "लॉग इन"],
            headings: [{ level: "h1", text: "" }]
        }
    }
];


const migrateHeadings = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000
        });
        console.log('✅ MongoDB connected for headings migration');

        // Clear existing headings
        await Heading.deleteMany({});
        console.log('Cleared existing Heading data');

        // Insert all headings
        await Heading.insertMany(headingsData);
        console.log(`🎉 Inserted ${headingsData.length} heading documents`);

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrateHeadings();
