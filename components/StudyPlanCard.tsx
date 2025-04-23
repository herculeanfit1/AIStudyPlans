'use client';

import Image from 'next/image';

interface StudyPlanCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subjectArea: string;
  completionPercentage?: number;
}

export default function StudyPlanCard({
  title,
  description,
  duration,
  difficulty,
  subjectArea,
  completionPercentage = 0
}: StudyPlanCardProps) {
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectIcon = (subject: string) => {
    // Map subject areas to Font Awesome icons
    const subjectIconMap: {[key: string]: string} = {
      'math': 'fas fa-calculator',
      'science': 'fas fa-flask',
      'history': 'fas fa-landmark',
      'literature': 'fas fa-book',
      'language': 'fas fa-language',
      'programming': 'fas fa-code',
      'music': 'fas fa-music',
      'art': 'fas fa-palette'
    };
    
    return subjectIconMap[subject.toLowerCase()] || 'fas fa-book';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative h-40 bg-indigo-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <i className={`${getSubjectIcon(subjectArea)} text-white text-5xl`} aria-hidden="true"></i>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="text-gray-600 text-sm">
            <i className="far fa-clock mr-1" aria-hidden="true"></i> {duration}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        {completionPercentage > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">Progress</span>
              <span className="text-xs font-medium text-indigo-700">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
            View Plan
          </button>
        </div>
      </div>
    </div>
  );
} 