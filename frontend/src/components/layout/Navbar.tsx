import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Compare Results', path: '/compare' },
    { name: 'Performance Review', path: '/performance' },
    { name: 'About Us', path: '/about' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white bg-opacity-90 backdrop-blur-md shadow-lg py-2'
          : 'bg-gradient-to-r from-purple-600 to-teal-400 py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <GraduationCap 
              size={32} 
              className={`${scrolled ? 'text-purple-600' : 'text-white'}`} 
            />
            <span 
              className={`text-xl font-bold ${
                scrolled ? 'text-purple-600' : 'text-white'
              }`}
            >
              ResultHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-medium ${
                  scrolled ? 'text-gray-800 hover:text-purple-600' : 'text-white hover:text-teal-100'
                } transition-colors`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-underline"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                      scrolled ? 'bg-purple-600' : 'bg-white'
                    }`}
                    initial={false}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className={scrolled ? 'text-gray-800' : 'text-white'} size={24} />
            ) : (
              <Menu className={scrolled ? 'text-gray-800' : 'text-white'} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block py-2 px-4 rounded ${
                    location.pathname === link.path
                      ? 'bg-white bg-opacity-20 font-medium'
                      : ''
                  } ${
                    scrolled ? 'text-gray-800 hover:text-purple-600' : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;