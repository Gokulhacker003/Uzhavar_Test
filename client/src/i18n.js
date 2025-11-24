import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Join Us Page translations
      joinUs: {
        title: "Join Our Team",
        subtitle: "Be part of something bigger",
        description: "Join Uzhavar Connect and help transform farming in India. We're looking for passionate individuals who want to make a difference.",
        whyJoin: "Why Join Us?",
        benefits: {
          impact: {
            title: "Make an Impact",
            desc: "Work on solutions that directly help farmers and improve agriculture"
          },
          growth: {
            title: "Career Growth",
            desc: "Continuous learning opportunities and professional development"
          },
          culture: {
            title: "Great Culture",
            desc: "Work with a passionate team in a collaborative environment"
          },
          innovation: {
            title: "Innovation",
            desc: "Use cutting-edge technology to solve real-world problems"
          }
        },
        positions: "Open Positions",
        applyNow: "Apply Now",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        position: "Position",
        resume: "Upload Resume",
        coverLetter: "Cover Letter",
        submit: "Submit Application",
        selectPosition: "Select Position",
        uploadFile: "Upload File",
        success: "Application submitted successfully!",
        error: "Please fill in all required fields"
      }
    }
  },
  ta: {
    translation: {
      // Join Us Page Tamil translations
      joinUs: {
        title: "எங்கள் அணியில் சேருங்கள்",
        subtitle: "பெரிய ஒன்றின் பகுதியாக இருங்கள்",
        description: "உழவர் கனெக்ட்டில் சேர்ந்து இந்தியாவில் விவசாயத்தை மாற்ற உதவுங்கள். மாற்றத்தை உருவாக்க விரும்பும் ஆர்வமுள்ள நபர்களை நாங்கள் தேடுகிறோம்.",
        whyJoin: "ஏன் எங்களுடன் சேர வேண்டும்?",
        benefits: {
          impact: {
            title: "தாக்கத்தை ஏற்படுத்துங்கள்",
            desc: "விவசாயிகளுக்கு நேரடியாக உதவும் மற்றும் விவசாயத்தை மேம்படுத்தும் தீர்வுகளில் பணியாற்றுங்கள்"
          },
          growth: {
            title: "தொழில் வளர்ச்சி",
            desc: "தொடர்ச்சியான கற்றல் வாய்ப்புகள் மற்றும் தொழில்முறை வளர்ச்சி"
          },
          culture: {
            title: "சிறந்த கலாச்சாரம்",
            desc: "ஒத்துழைப்பு சூழலில் ஆர்வமுள்ள குழுவுடன் பணியாற்றுங்கள்"
          },
          innovation: {
            title: "புதுமை",
            desc: "உண்மையான உலக சிக்கல்களை தீர்க்க அதிநவீன தொழில்நுட்பத்தைப் பயன்படுத்துங்கள்"
          }
        },
        positions: "திறந்த பதவிகள்",
        applyNow: "இப்போது விண்ணப்பிக்கவும்",
        name: "முழு பெயர்",
        email: "மின்னஞ்சல் முகவரி",
        phone: "தொலைபேசி எண்",
        position: "பதவி",
        resume: "ரெஸ்யூம் பதிவேற்றவும்",
        coverLetter: "கவர் லெட்டர்",
        submit: "விண்ணப்பத்தை சமர்ப்பிக்கவும்",
        selectPosition: "பதவியைத் தேர்ந்தெடுக்கவும்",
        uploadFile: "கோப்பை பதிவேற்றவும்",
        success: "விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
        error: "தயவுசெய்து அனைத்து தேவையான புலங்களையும் நிரப்பவும்"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('selectedLang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
