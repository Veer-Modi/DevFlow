"use client";

import { motion } from 'framer-motion';
import { Compass, Hash, TrendingUp, Users, Flame, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function Explore() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const topics = [
    { name: 'React', count: 1245, icon: <LayoutGrid size={16} /> },
    { name: 'Next.js', count: 854, icon: <LayoutGrid size={16} /> },
    { name: 'TypeScript', count: 632, icon: <LayoutGrid size={16} /> },
    { name: 'Architecture', count: 421, icon: <LayoutGrid size={16} /> },
    { name: 'Node.js', count: 398, icon: <LayoutGrid size={16} /> },
    { name: 'TailwindCSS', count: 276, icon: <LayoutGrid size={16} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0B0F17]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 mb-4">
            <Compass className="text-[#10a37f]" size={36} /> Explore
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover trending topics, popular discussions, and connect with developers across the globe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Flame className="text-orange-500" size={24} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Topics</h2>
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {topics.map(topic => (
                  <motion.div 
                    key={topic.name} 
                    variants={itemVariants}
                    className="bg-white dark:bg-[#171717] p-5 rounded-2xl border border-gray-200 dark:border-[rgba(255,255,255,0.05)] shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                        <span className="p-2 bg-gray-100 dark:bg-[#212121] rounded-lg text-gray-500 group-hover:text-[#10a37f] transition-colors">
                          {topic.icon}
                        </span>
                        {topic.name}
                      </div>
                      <span className="text-xs font-medium bg-[#10a37f]/10 text-[#10a37f] px-2 py-1 rounded-full">
                        {topic.count} posts
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#10a37f] to-teal-900 rounded-3xl p-8 text-white shadow-xl shadow-[#10a37f]/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users size={20} /> Join the Community
              </h3>
              <p className="text-teal-50 mb-6 text-sm">
                Create an account to participate in these discussions, ask questions, and share your expertise.
              </p>
              <Link href="/register" className="block text-center w-full bg-white text-[#10a37f] px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                Sign Up Now
              </Link>
            </div>

            <div className="bg-white dark:bg-[#171717] rounded-3xl p-6 border border-gray-200 dark:border-[rgba(255,255,255,0.05)]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#10a37f]" /> Quick Links
              </h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-[#10a37f] dark:hover:text-[#10a37f] text-sm font-medium transition-colors">Latest Posts</Link></li>
                <li><Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-[#10a37f] dark:hover:text-[#10a37f] text-sm font-medium transition-colors">Unanswered Questions</Link></li>
                <li><Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-[#10a37f] dark:hover:text-[#10a37f] text-sm font-medium transition-colors">Most Upvoted</Link></li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
