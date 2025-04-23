import React from 'react';

interface StudyPlanPreviewProps {
  className?: string;
}

const StudyPlanPreview: React.FC<StudyPlanPreviewProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-xl overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Data Science Study Plan</h3>
        <p className="text-sm text-gray-500 mt-1">Personalized for your learning style and schedule</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-800">Week 1: Python Fundamentals</h4>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Estimated: 8 hours</span>
          </div>
          <ul className="space-y-2 pl-5 list-disc text-gray-600">
            <li>Introduction to Python syntax (2h)</li>
            <li>Data types and structures (3h)</li>
            <li>Control flow and functions (3h)</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-800">Week 2: Data Analysis</h4>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Estimated: 10 hours</span>
          </div>
          <ul className="space-y-2 pl-5 list-disc text-gray-600">
            <li>NumPy for numerical computing (3h)</li>
            <li>Pandas for data manipulation (4h)</li>
            <li>Data visualization with Matplotlib (3h)</li>
          </ul>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-800">Week 3: Machine Learning Basics</h4>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Estimated: 12 hours</span>
          </div>
          <ul className="space-y-2 pl-5 list-disc text-gray-600">
            <li>Introduction to scikit-learn (4h)</li>
            <li>Supervised learning algorithms (5h)</li>
            <li>Model evaluation techniques (3h)</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Progress: 25% complete</span>
          </div>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View full plan →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanPreview; 