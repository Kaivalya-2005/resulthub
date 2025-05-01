import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4">ResultHub</h3>
            <p className="text-gray-300 mb-4">
              Providing accurate and accessible student results with advanced analytics and comparison tools.
            </p>
            <p className="flex items-center text-gray-300">
              <Heart size={16} className="mr-2 text-red-400" />
              Made with pride and care
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-teal-400 transition">Home</a></li>
              <li><a href="/compare" className="text-gray-300 hover:text-teal-400 transition">Compare Results</a></li>
              <li><a href="/performance" className="text-gray-300 hover:text-teal-400 transition">Performance Review</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-teal-400 transition">About Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center text-gray-300">
                <Phone size={16} className="mr-2 text-teal-400" />
                +91 9372914080 / +91 9619980713
              </p>
              <p className="flex items-center text-gray-300">
                <Mail size={16} className="mr-2 text-teal-400" />
                info@resulthub.edu
              </p>
              <p className="flex items-start text-gray-300">
                <MapPin size={35} className="mr-2 mt-1 text-teal-400" />
                <span>Smt. Radhikabai Meghe Vidyalaya, Sivaji Rao Rd, near welcome Sweets, Sector 16, Airoli, Navi Mumbai, Maharashtra 400708</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ResultHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;