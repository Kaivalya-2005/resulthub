import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import { Mail, GraduationCap, Award, BarChart3, Linkedin } from 'lucide-react';
import rahulImg from '../img/rahul.jpg';
import kaivalyaImg from '../img/kaivalya.jpg';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-4">
            About ResultHub
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Learn more about our mission to provide accessible and transparent academic results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  At Resulthub, we believe that while exams demand effort, checking results should be effortless. That’s why we’re dedicated to eliminating frustrating server crashes and ensuring a seamless experience for students, parents, teachers, and educators alike.                 
                </p>
                <p className="text-gray-600 mb-6">
                  We continuously strive to provide accurate performance metrics, meaningful result comparisons, and a secure environment for accessing results. Innovation drives us forward, and as a team of problem-solvers, we remain committed to delivering reliable, user-friendly solutions that transform the way results are accessed and understood.                
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <GraduationCap size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Academic Excellence</h3>
                      <p className="text-gray-600 text-sm">Supporting student achievement through accessible information</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-teal-100 p-3 rounded-full mr-4">
                      <Award size={24} className="text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Recognition</h3>
                      <p className="text-gray-600 text-sm">Celebrating student success and highlighting achievements</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <BarChart3 size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Data Insights</h3>
                      <p className="text-gray-600 text-sm">Providing meaningful analytics for better understanding</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-teal-100 p-3 rounded-full mr-4">
                      <Mail size={24} className="text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Communication</h3>
                      <p className="text-gray-600 text-sm">Facilitating clearer communication between schools and families</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={kaivalyaImg}
                        alt="Kaivalya Deshpande" 
                        className="w-full h-[300px] object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">Kaivalya Deshpande</h3>
                    <p className="text-teal-600 mb-3">Student at Savitribai Phule Pune University</p>
                    <p className="text-gray-600 text-sm mb-3">
                      Server-side Developer, Technical Expert, Database Administrator
                    </p>
                    <a 
                      href="https://www.linkedin.com/in/kaivalya-deshpande-8804982b5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Linkedin size={16} className="mr-1" />
                      LinkedIn Profile
                    </a>
                  </div>
                  <div className="text-center">
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={rahulImg}
                        alt="Rahul Patil" 
                        className="w-full h-[300px] object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">Rahul Patil</h3>
                    <p className="text-teal-600 mb-3">Student at University of Mumbai</p>
                    <p className="text-gray-600 text-sm mb-3">
                      Front-end developer, Cloud Administrator, Content Manager
                    </p>
                    <a 
                      href="https://www.linkedin.com/in/rahul-patil098?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Linkedin size={16} className="mr-1" />
                      LinkedIn Profile
                    </a>
                  </div>
                </div>                
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Card>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-purple-50 rounded-lg">
                  <h3 className="font-bold text-purple-800 mb-3 text-lg text-center">Reliability</h3>
                  <p className="text-gray-600">
                    We ensure secure and uninterrupted access to results, eliminating frustrating delays and technical failures.
                  </p>
                </div>
                <div className="p-6 bg-teal-50 rounded-lg">
                  <h3 className="font-bold text-teal-800 mb-3 text-lg text-center">Innovation</h3>
                  <p className="text-gray-600">
                    We constantly evolve, leveraging technology to deliver smarter solutions for seamless result-checking.
                  </p>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg">
                  <h3 className="font-bold text-purple-800 mb-3 text-lg text-center">Transperancy</h3>
                  <p className="text-gray-600">
                    Accuracy and clarity matter. We present performance metrics and comparisons with integrity, empowering informed decisions.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;