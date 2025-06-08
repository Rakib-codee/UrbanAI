'use client';

import { useState, useEffect } from 'react';
import { Bell, BellPlus, Check, X, Shield, Leaf, Car, Building, Cloud, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/app/i18n/hooks';

type Notification = {
  id: string;
  title: string;
  title_bn?: string;
  message: string;
  message_bn?: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  category?: string;
};

type SubscriptionCategory = {
  id: string;
  name: string;
  name_bn?: string;
  description: string;
  description_bn?: string;
  icon: React.ReactNode;
  isSubscribed: boolean;
};

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New air quality data available',
    title_bn: 'নতুন বায়ু গুণমান ডেটা উপলব্ধ',
    message: 'Air quality reports for Dhaka have been updated.',
    message_bn: 'ঢাকার বায়ু গুণমান প্রতিবেদন আপডেট করা হয়েছে।',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
    type: 'info',
    category: 'environment'
  },
  {
    id: '2',
    title: 'System update',
    title_bn: 'সিস্টেম আপডেট',
    message: 'UrbanAI platform will be updated tonight at 2AM.',
    message_bn: 'UrbanAI প্ল্যাটফর্ম আজ রাত ২টায় আপডেট হবে।',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    type: 'warning',
    category: 'system'
  },
  {
    id: '3',
    title: 'Traffic simulation complete',
    title_bn: 'ট্রাফিক সিমুলেশন সম্পন্ন',
    message: 'Your traffic simulation for Gulshan area is ready to view.',
    message_bn: 'গুলশান এলাকার জন্য আপনার ট্রাফিক সিমুলেশন দেখার জন্য প্রস্তুত।',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    type: 'success',
    category: 'traffic'
  },
  {
    id: '4',
    title: 'New environmental goal added',
    title_bn: 'নতুন পরিবেশগত লক্ষ্য যোগ করা হয়েছে',
    message: 'A new city-wide environmental goal for carbon reduction has been added.',
    message_bn: 'কার্বন নিঃসরণ কমানোর জন্য একটি নতুন সিটি-ব্যাপী পরিবেশগত লক্ষ্য যোগ করা হয়েছে।',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    read: false,
    type: 'info',
    category: 'environment'
  },
  {
    id: '5',
    title: 'Energy consumption alert',
    title_bn: 'শক্তি ব্যবহারের সতর্কতা',
    message: 'Energy usage in Central District is 15% higher than normal.',
    message_bn: 'সেন্ট্রাল জেলায় শক্তি ব্যবহার স্বাভাবিকের তুলনায় ১৫% বেশি।',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: false,
    type: 'warning',
    category: 'energy'
  }
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'subscriptions'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showSubscribeSuccess, setShowSubscribeSuccess] = useState(false);
  const { language } = useTranslation();
  const isBangla = language === 'bn';
  
  // Subscription categories
  const [subscriptionCategories, setSubscriptionCategories] = useState<SubscriptionCategory[]>([
    {
      id: 'environment',
      name: 'Environmental Updates',
      name_bn: 'পরিবেশ আপডেট',
      description: 'Air quality, green spaces, and sustainability initiatives',
      description_bn: 'বায়ু মান, সবুজ স্থান এবং টেকসই উদ্যোগ',
      icon: <Leaf className="h-5 w-5 text-green-500" />,
      isSubscribed: true
    },
    {
      id: 'traffic',
      name: 'Traffic & Mobility',
      name_bn: 'ট্রাফিক ও চলাচল',
      description: 'Traffic conditions, public transit, and road updates',
      description_bn: 'ট্রাফিক অবস্থা, পাবলিক ট্রানজিট এবং রাস্তার আপডেট',
      icon: <Car className="h-5 w-5 text-blue-500" />,
      isSubscribed: true
    },
    {
      id: 'development',
      name: 'Urban Development',
      name_bn: 'নগর উন্নয়ন',
      description: 'Construction projects, zoning changes, and city planning',
      description_bn: 'নির্মাণ প্রকল্প, জোনিং পরিবর্তন এবং শহর পরিকল্পনা',
      icon: <Building className="h-5 w-5 text-purple-500" />,
      isSubscribed: false
    },
    {
      id: 'energy',
      name: 'Energy Management',
      name_bn: 'শক্তি ব্যবস্থাপনা',
      description: 'Power usage, renewable energy, and grid updates',
      description_bn: 'বিদ্যুৎ ব্যবহার, নবায়নযোগ্য শক্তি এবং গ্রিড আপডেট',
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      isSubscribed: false
    },
    {
      id: 'weather',
      name: 'Weather Alerts',
      name_bn: 'আবহাওয়া সতর্কতা',
      description: 'Severe weather warnings and forecasts',
      description_bn: 'তীব্র আবহাওয়া সতর্কতা এবং পূর্বাভাস',
      icon: <Cloud className="h-5 w-5 text-cyan-500" />,
      isSubscribed: false
    },
    {
      id: 'system',
      name: 'System Notifications',
      name_bn: 'সিস্টেম বিজ্ঞপ্তি',
      description: 'Platform updates, maintenance, and security alerts',
      description_bn: 'প্ল্যাটফর্ম আপডেট, রক্ষণাবেক্ষণ এবং নিরাপত্তা সতর্কতা',
      icon: <Shield className="h-5 w-5 text-red-500" />,
      isSubscribed: true
    }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const clearAll = () => {
    setNotifications([]);
  };

  const toggleSubscription = (categoryId: string) => {
    setSubscriptionCategories(subscriptionCategories.map(category => 
      category.id === categoryId 
        ? { ...category, isSubscribed: !category.isSubscribed } 
        : category
    ));
    
    // Show success message
    setShowSubscribeSuccess(true);
    setTimeout(() => setShowSubscribeSuccess(false), 3000);
  };
  
  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.notification-center')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return isBangla ? 'এখনই' : 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${isBangla ? 'মিনিট আগে' : 'minutes ago'}`;
    } else if (diffInMinutes < 60 * 24) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${isBangla ? 'ঘন্টা আগে' : 'hours ago'}`;
    } else {
      const days = Math.floor(diffInMinutes / (60 * 24));
      return `${days} ${isBangla ? 'দিন আগে' : 'days ago'}`;
    }
  };
  
  return (
    <div className="notification-center relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            {/* Notification Header with Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${
                    activeTab === 'notifications'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {isBangla ? 'বিজ্ঞপ্তি' : 'Notifications'} {unreadCount > 0 && `(${unreadCount})`}
                </button>
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${
                    activeTab === 'subscriptions'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {isBangla ? 'সাবস্ক্রিপশন' : 'Subscriptions'}
                </button>
              </div>
            </div>

            {/* Notification Content */}
            {activeTab === 'notifications' && (
              <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">
                    {isBangla ? 'আপনার বিজ্ঞপ্তি' : 'Your Notifications'}
              </h3>
              <div className="flex space-x-2">
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  {isBangla ? 'সব পঠিত বলে চিহ্নিত করুন' : 'Mark all as read'}
                </button>
                <button 
                  onClick={clearAll}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {isBangla ? 'সব মুছুন' : 'Clear all'}
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto py-2">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {isBangla ? 'কোন বিজ্ঞপ্তি নেই' : 'No notifications'}
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                      !notification.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`mt-0.5 w-2 h-2 rounded-full ${
                        notification.type === 'info' ? 'bg-blue-500' :
                        notification.type === 'warning' ? 'bg-amber-500' :
                        notification.type === 'success' ? 'bg-green-500' :
                        'bg-red-500'
                      }`} />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">
                          {isBangla && notification.title_bn ? notification.title_bn : notification.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {isBangla && notification.message_bn ? notification.message_bn : notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                {isBangla ? 'সব বিজ্ঞপ্তি দেখুন' : 'View all notifications'}
              </button>
            </div>
              </>
            )}

            {/* Subscription Content */}
            {activeTab === 'subscriptions' && (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-sm mb-1">
                    {isBangla ? 'আপডেট সাবস্ক্রিপশন' : 'Update Subscriptions'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isBangla 
                      ? 'আপনি যে ধরনের স্মার্ট সিটি আপডেট পেতে চান তা নির্বাচন করুন' 
                      : 'Choose which types of smart city updates you want to receive'}
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto py-2">
                  {subscriptionCategories.map((category) => (
                    <div 
                      key={category.id}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          {category.icon}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">
                            {isBangla && category.name_bn ? category.name_bn : category.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-[200px]">
                            {isBangla && category.description_bn ? category.description_bn : category.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSubscription(category.id)}
                        className={`ml-2 flex-shrink-0 px-2 py-1.5 rounded-md text-xs font-medium ${
                          category.isSubscribed 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {category.isSubscribed ? (
                          <span className="flex items-center">
                            <Check className="h-3 w-3 mr-1" />
                            {isBangla ? 'সাবস্ক্রাইব করা আছে' : 'Subscribed'}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <BellPlus className="h-3 w-3 mr-1" />
                            {isBangla ? 'সাবস্ক্রাইব করুন' : 'Subscribe'}
                          </span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isBangla 
                      ? 'আপনি যেকোনো সময় আপনার সাবস্ক্রিপশন পরিবর্তন করতে পারেন' 
                      : 'You can change your subscriptions at any time'}
                  </p>
                </div>
              </>
            )}

            {/* Success Toast */}
            <AnimatePresence>
              {showSubscribeSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
                >
                  <Check className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {isBangla 
                      ? 'সাবস্ক্রিপশন আপডেট করা হয়েছে!' 
                      : 'Subscription updated successfully!'}
                  </span>
                  <button 
                    onClick={() => setShowSubscribeSuccess(false)}
                    className="ml-2 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 