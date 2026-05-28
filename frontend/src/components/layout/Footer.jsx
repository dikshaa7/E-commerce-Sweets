import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-dark-900 text-gray-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🍬</span>
          <h3 className="text-xl font-display font-bold text-white">Indian Sweet Savories</h3>
        </div>
        <p className="text-sm leading-relaxed">
          Your trusted destination for premium Indian sweets. Handcrafted with love and delivered fresh to your doorstep.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="hover:text-primary-400 transition">Home</Link></li>
          <li><Link to="/products" className="hover:text-primary-400 transition">Shop All</Link></li>
          <li><Link to="/contact" className="hover:text-primary-400 transition">Contact Us</Link></li>
          <li><Link to="/admin/login" className="hover:text-primary-400 transition">Admin Login</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Categories</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/products" className="hover:text-primary-400 transition">Mithai</Link></li>
          <li><Link to="/products" className="hover:text-primary-400 transition">Cakes</Link></li>
          <li><Link to="/products" className="hover:text-primary-400 transition">Chocolates</Link></li>
          <li><Link to="/products" className="hover:text-primary-400 transition">Festival Sweets</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Contact Info</h4>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-2"><FiMapPin /> New Delhi, India</li>
          <li className="flex items-center gap-2"><FiPhone /> +91 12345 67890</li>
          <li className="flex items-center gap-2"><FiMail /> [EMAIL_ADDRESS]</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-700 py-4 text-center text-sm">
      © {new Date().getFullYear()} Indian Sweet Savories. Diksha Capstone Project.
    </div>
  </footer>
);

export default Footer;
