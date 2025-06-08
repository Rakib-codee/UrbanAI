'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, TreePine, Droplets, Wind, Thermometer, Leaf, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// Define types for our data
interface EnvironmentalGoal {
  id: number;
  name: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  progress: number;
  status: 'On Track' | 'In Progress' | 'At Risk' | 'Not Started';
  description: string;
  icon: LucideIcon;
}

interface Category {
  id: string;
  name: string;
}

export default function EnvironmentalGoalsPage() {
  // Mock darkMode and location since we don't have the actual context
  const darkMode = false;
  const location = { city: 'New York' };
  const loading = false;
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'Air Quality',
    currentValue: '',
    targetValue: '',
    unit: '',
    deadline: '',
    description: ''
  });
  
  // Sample categories
  const categories: Category[] = [
    { id: 'All', name: 'All Categories' },
    { id: 'Air Quality', name: 'Air Quality' },
    { id: 'Green Coverage', name: 'Green Coverage' },
    { id: 'Water Conservation', name: 'Water Conservation' },
    { id: 'Energy Efficiency', name: 'Energy Efficiency' },
    { id: 'Waste Management', name: 'Waste Management' }
  ];
  
  // Sample environmental goals
  const [goals, setGoals] = useState<EnvironmentalGoal[]>([
    {
      id: 1,
      name: 'Reduce Carbon Emissions',
      category: 'Air Quality',
      currentValue: 72,
      targetValue: 50,
      unit: 'tons CO₂/month',
      deadline: '2024-12-31',
      progress: 45,
      status: 'In Progress',
      description: 'Reduce carbon emissions through improved public transportation and renewable energy adoption.',
      icon: Cloud
    },
    {
      id: 2,
      name: 'Increase Green Space',
      category: 'Green Coverage',
      currentValue: 18,
      targetValue: 30,
      unit: '% of urban area',
      deadline: '2025-06-30',
      progress: 60,
      status: 'On Track',
      description: 'Expand urban parks and green spaces to enhance biodiversity and improve air quality.',
      icon: TreePine
    },
    {
      id: 3,
      name: 'Water Usage Reduction',
      category: 'Water Conservation',
      currentValue: 3800,
      targetValue: 3000,
      unit: 'kL/day',
      deadline: '2024-09-30',
      progress: 30,
      status: 'At Risk',
      description: 'Implement water-saving measures across municipal facilities and public spaces.',
      icon: Droplets
    },
    {
      id: 4,
      name: 'Renewable Energy Adoption',
      category: 'Energy Efficiency',
      currentValue: 22,
      targetValue: 50,
      unit: '% of total energy',
      deadline: '2026-01-31',
      progress: 44,
      status: 'In Progress',
      description: 'Increase the proportion of renewable energy in the city\'s total energy consumption.',
      icon: Thermometer
    },
    {
      id: 5,
      name: 'Improve Air Quality Index',
      category: 'Air Quality',
      currentValue: 85,
      targetValue: 95,
      unit: 'AQI score',
      deadline: '2024-12-31',
      progress: 70,
      status: 'On Track',
      description: 'Enhance air quality through reduced traffic emissions and industrial pollution control.',
      icon: Wind
    },
    {
      id: 6,
      name: 'Biodiversity Enhancement',
      category: 'Green Coverage',
      currentValue: 230,
      targetValue: 350,
      unit: 'native species count',
      deadline: '2025-12-31',
      progress: 35,
      status: 'In Progress',
      description: 'Increase biodiversity by planting native species and creating wildlife corridors.',
      icon: Leaf
    }
  ]);
  
  // Filter goals based on selected category
  const filteredGoals = selectedCategory === 'All' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);
  
  // Calculate overall environmental progress
  const overallProgress = Math.round(
    goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
  );
  
  // Handle new goal submission
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalIcons: Record<string, LucideIcon> = {
      'Air Quality': Wind,
      'Green Coverage': TreePine,
      'Water Conservation': Droplets,
      'Energy Efficiency': Thermometer,
      'Waste Management': Trash2
    };
    
    const newGoalItem: EnvironmentalGoal = {
      id: goals.length + 1,
      name: newGoal.name,
      category: newGoal.category,
      currentValue: parseFloat(newGoal.currentValue),
      targetValue: parseFloat(newGoal.targetValue),
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      description: newGoal.description,
      progress: 0,
      status: 'Not Started',
      icon: goalIcons[newGoal.category] || Leaf
    };
    
    setGoals([...goals, newGoalItem]);
    setShowAddGoalForm(false);
    setNewGoal({
      name: '',
      category: 'Air Quality',
      currentValue: '',
      targetValue: '',
      unit: '',
      deadline: '',
      description: ''
    });
  };
  
  // Delete a goal
  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className={`h-12 w-12 rounded-full border-4 border-t-transparent ${darkMode ? 'border-white' : 'border-gray-800'} animate-spin`}></div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold mb-1">Environmental Goals</h1>
                <p className="text-gray-500 dark:text-gray-400">Set and track environmental targets for {location?.city || 'your city'}</p>
              </div>
              <button 
                onClick={() => setShowAddGoalForm(true)}
                className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Add New Goal
              </button>
            </div>
            
            {/* Overall Progress */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-xl shadow-sm mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h2 className="text-xl font-semibold mb-4">Overall Environmental Progress</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-2/3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress Toward Goals</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-full rounded-full ${
                        overallProgress > 75 ? 'bg-green-500' : 
                        overallProgress > 50 ? 'bg-blue-500' : 
                        overallProgress > 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="flex items-center text-green-500"><span className="w-3 h-3 inline-block mr-1 bg-green-500 rounded-full"></span> On Track: {goals.filter(g => g.status === 'On Track').length}</span>
                  </div>
                  <div>
                    <span className="flex items-center text-blue-500"><span className="w-3 h-3 inline-block mr-1 bg-blue-500 rounded-full"></span> In Progress: {goals.filter(g => g.status === 'In Progress').length}</span>
                  </div>
                  <div>
                    <span className="flex items-center text-red-500"><span className="w-3 h-3 inline-block mr-1 bg-red-500 rounded-full"></span> At Risk: {goals.filter(g => g.status === 'At Risk').length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === category.id 
                      ? 'bg-green-600 text-white' 
                      : darkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 rounded-xl shadow-sm relative ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <button 
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${
                      goal.category === 'Air Quality' ? 'bg-blue-500' :
                      goal.category === 'Green Coverage' ? 'bg-green-500' :
                      goal.category === 'Water Conservation' ? 'bg-cyan-500' :
                      goal.category === 'Energy Efficiency' ? 'bg-amber-500' :
                      'bg-purple-500'
                    } text-white mr-4`}>
                      <goal.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">{goal.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{goal.category}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current: {goal.currentValue} {goal.unit}</span>
                      <span>Target: {goal.targetValue} {goal.unit}</span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-full rounded-full ${
                          goal.status === 'On Track' ? 'bg-green-500' : 
                          goal.status === 'In Progress' ? 'bg-blue-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      goal.status === 'On Track' ? 'bg-green-100 text-green-800' : 
                      goal.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {goal.status}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{goal.description}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Add Goal Form */}
            {showAddGoalForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-black/60' : 'bg-gray-800/60'}`}
              >
                <div className={`w-full max-w-md p-6 rounded-xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h2 className="text-xl font-semibold mb-4">Add New Environmental Goal</h2>
                  
                  <form onSubmit={handleAddGoal}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Goal Name</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                        required
                      >
                        {categories.filter(c => c.id !== 'All').map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Current Value</label>
                        <input
                          type="number"
                          className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                          value={newGoal.currentValue}
                          onChange={(e) => setNewGoal({...newGoal, currentValue: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Target Value</label>
                        <input
                          type="number"
                          className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                          value={newGoal.targetValue}
                          onChange={(e) => setNewGoal({...newGoal, targetValue: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Unit of Measurement</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                        placeholder="e.g., tons CO₂, %, km²"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Deadline</label>
                      <input
                        type="date"
                        className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddGoalForm(false)}
                        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <Save size={18} className="mr-2" />
                        Save Goal
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
} 