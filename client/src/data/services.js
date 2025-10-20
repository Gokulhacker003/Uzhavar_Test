
import 'leaflet/dist/leaflet.css';
import {FaCalendarAlt,FaShoppingCart } from 'react-icons/fa';
import { MdOutlineConstruction,  MdSell, MdLandscape } from 'react-icons/md';
import { GiWoodenFence } from 'react-icons/gi';

const services = [
  {
    title: "AMC (Annual Maintenance Contract)",
    icon: <FaCalendarAlt className="service-icon" />,
    description: "Scheduled maintenance for your farm with calendar-based tracking"
  },
  {
    title: "New Projects",
    icon: <MdOutlineConstruction className="service-icon" />,
    description: "Fencing, drip irrigation, planting and more"
  },
  {
    title: "Construction",
    icon: <GiWoodenFence className="service-icon" />,
    description: "Tanks, pools, sheds and other farm structures"
  },
  {
    title: "Inputs Supply",
    icon: <FaShoppingCart className="service-icon" />,
    description: "Tools, fertilizers, motors and other farm inputs"
  },
  {
    title: "Land Buy/Sell",
    icon: <MdLandscape className="service-icon" />,
    description: "Verified listings with soil/water data"
  },
  {
    title: "Crop Sales",
    icon: <MdSell className="service-icon" />,
    description: "Buyer connect and market price comparison"
  }
];

export default services;