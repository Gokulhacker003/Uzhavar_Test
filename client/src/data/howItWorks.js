
import 'leaflet/dist/leaflet.css';
import { FaImage, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaFileAlt, FaClipboardList } from 'react-icons/fa';


const howItWorks = [
  {
    step: 1,
    title: "Farm Visit & Needs Mapping",
    description: "We visit your farm and document requirements",
    icon: <FaMapMarkerAlt />
  },
  {
    step: 2,
    title: "Quote + Calendar",
    description: "We provide transparent pricing and schedule",
    icon: <FaCalendarAlt />
  },
  {
    step: 3,
    title: "Contract & Team Assignment",
    description: "Sign agreement and we assign the right team",
    icon: <FaFileAlt />
  },
  {
    step: 4,
    title: "Work & Photo Upload",
    description: "Work execution with photo documentation",
    icon: <FaImage />
  },
  {
    step: 5,
    title: "Approval by Farmer",
    description: "Review and approve completed tasks",
    icon: <FaCheckCircle />
  },
  {
    step: 6,
    title: "Monthly Reports",
    description: "Detailed reporting of all work done",
    icon: <FaClipboardList />
  }
];

export default howItWorks;