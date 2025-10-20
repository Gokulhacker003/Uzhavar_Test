import 'leaflet/dist/leaflet.css';
import {  FaHandshake , FaImage, FaCalendarAlt, FaCheckCircle, FaUserFriends, FaBriefcase } from 'react-icons/fa';
import {
  GiWateringCan
} from 'react-icons/gi';


const trustFactors = [
  {
    title: "Photo Proof for Every Task",
    icon: <FaImage />,
    description: "Visual verification of completed work"
  },
  {
    title: "Calendar-Based AMC",
    icon: <FaCalendarAlt />,
    description: "Structured, not ad-hoc maintenance"
  },
  {
    title: "Fertilizer + Weather Synced",
    icon: <GiWateringCan />,
    description: "Smart scheduling based on conditions"
  },
  {
    title: "Transparent Pricing",
    icon: <FaHandshake />,
    description: "No hidden fees, no middlemen"
  },
  {
    title: "Easy Approval Process",
    icon: <FaCheckCircle />,
    description: "Via app or WhatsApp"
  },
  {
    title: "Trained Local Teams",
    icon: <FaUserFriends />,
    description: "Verified contracts and reliable workers"
  },
  {
    title: "One Vendor Responsibility",
    icon: <FaBriefcase />,
    description: "Single point of contact for all work"
  }
];

export default trustFactors;