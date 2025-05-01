"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, BarChart, HelpCircle } from "lucide-react";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [rotatingWords, setRotatingWords] = useState([
    "tracker",
    "companion",
    "helper",
  ]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(
        (prevIndex) => (prevIndex + 1) % rotatingWords.length
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const features = [
    {
      title: "Track Daily Routines",
      description:
        "Monitor your daily habits with our simple and intuitive interface.",
      icon: "📝",
    },
    {
      title: "Build Consistency",
      description:
        "Develop consistent routines and see your progress over time.",
      icon: "📈",
    },
    {
      title: "Achieve Goals",
      description: "Set personal goals and track your journey to achievement.",
      icon: "🎯",
    },
    {
      title: "Insightful Statistics",
      description: "Get detailed insights about your habits and routines.",
      icon: "📊",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Deepti Manna",
      designation: "Productivity Enthusiast",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      quote:
        "This app has transformed how I manage my daily habits. Simple yet powerful!",
    },
    {
      id: 2,
      name: "Biplab Roy",
      designation: "Professor",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      quote:
        "I recommend Routine Tracker to all my classes. It's the perfect tool for building consistency.",
    },
    {
      id: 3,
      name: "Soumyajit Khan",
      designation: "Student",
      image:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      quote:
        "As a busy student, this app helps me balance academics, fitness, and personal time effectively.",
    },
  ];

  // Page animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  };

  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-black text-white overflow-hidden"
    >
      {/* Header */}
      <motion.header
        variants={childVariants}
        className="container mx-auto py-6 px-4 flex justify-between items-center"
      >
        <Link
          href="/"
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500"
        >
          Remind Me
        </Link>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <div className="flex gap-2">
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </motion.header>

      {/* Hero Section with Animated Text Moved to First Line */}
      <Spotlight className="max-w-6xl mx-auto relative pt-10 md:pt-24 pb-20">
        <div className="container px-4 mx-auto text-center">
          <motion.div variants={childVariants} className="relative mb-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <div className="flex items-center justify-center flex-wrap">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
                  Your personal{" "}
                </span>
                <div className="inline-flex overflow-hidden h-14 md:h-16">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={rotatingWords[currentWordIndex]}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-blue-400 min-w-24 md:min-w-32 inline-block"
                    >
                      {rotatingWords[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <div className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500 mt-2">
                Build Better Habits with Routine Tracker
              </div>
            </h1>
          </motion.div>

          <motion.div
            variants={childVariants}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mt-8"
          >
            <p>Transform your daily routines into lasting habits</p>
          </motion.div>

          <motion.div
            variants={childVariants}
            className="flex flex-col md:flex-row justify-center gap-4 mt-16"
          >
            {!isSignedIn && (
              <>
                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 px-8 py-6">
                    Get Started Free
                  </Button>
                </SignUpButton>
                <Link href="#features">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800 px-8 py-6"
                  >
                    Learn More
                  </Button>
                </Link>
              </>
            )}
            {isSignedIn && (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 px-8 py-6">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </Spotlight>

      {/* How It Works - Enhanced Animation */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500"
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-indigo-500/20">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Routines</h3>
              <p className="text-gray-300">
                Define your daily habits and routines with our easy-to-use
                interface
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-indigo-500/20">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Daily</h3>
              <p className="text-gray-300">
                Check off completed tasks and build consistency with daily
                tracking
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-indigo-500/20">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">See Results</h3>
              <p className="text-gray-300">
                Visualize your progress and celebrate your consistency streaks
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Animation */}
      <section id="features" className="py-20 bg-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500"
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px -10px rgba(79, 70, 229, 0.3)",
                  transition: { duration: 0.2 },
                }}
                className="bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-300 border border-gray-700/50"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with Enhanced Animation */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500"
          >
            What Our Users Say
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px -10px rgba(79, 70, 229, 0.3)",
                  transition: { duration: 0.2 },
                }}
                className="bg-gray-800 p-6 rounded-2xl border border-gray-700/50"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-blue-400">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {testimonial.designation}
                    </p>
                  </div>
                </div>
                <p className="text-gray-300">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section with Enhanced Animation */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="text-center p-6 rounded-2xl bg-gray-800/30 border border-gray-700/30"
            >
              <h3 className="text-4xl font-bold text-blue-400 mb-2">10,000+</h3>
              <p className="text-gray-300">Active Users</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="text-center p-6 rounded-2xl bg-gray-800/30 border border-gray-700/30"
            >
              <h3 className="text-4xl font-bold text-blue-400 mb-2">1M+</h3>
              <p className="text-gray-300">Habits Tracked</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="text-center p-6 rounded-2xl bg-gray-800/30 border border-gray-700/30"
            >
              <h3 className="text-4xl font-bold text-blue-400 mb-2">92%</h3>
              <p className="text-gray-300">User Satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Animation */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-8 rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
              Ready to Transform Your Habits?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
              Join thousands of users who have improved their lives with Routine
              Tracker.
            </p>
            {!isSignedIn && (
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 px-8 py-6 text-lg shadow-lg shadow-indigo-500/20">
                  Get Started Today
                </Button>
              </SignUpButton>
            )}
            {isSignedIn && (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 px-8 py-6 text-lg shadow-lg shadow-indigo-500/20">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer with Animation */}
      <motion.footer
        variants={childVariants}
        className="bg-gray-900 py-12 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Remind Me. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
