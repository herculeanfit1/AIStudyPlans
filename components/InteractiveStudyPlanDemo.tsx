"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";

interface StudyPlanItem {
  title: string;
  duration: string;
  resources: string[];
  completionTime: string;
}

interface StudyPlan {
  subject: string;
  description: string;
  totalDuration: string;
  items: StudyPlanItem[];
}

// Pre-made study plans for demo purposes
const studyPlans: Record<string, StudyPlan> = {
  "machine learning": {
    subject: "Machine Learning",
    description: "A comprehensive study plan to master the fundamentals of machine learning and AI algorithms.",
    totalDuration: "8 weeks",
    items: [
      {
        title: "Mathematics Foundations",
        duration: "2 weeks",
        resources: [
          "Linear Algebra - Khan Academy",
          "Calculus - 3Blue1Brown",
          "Statistics & Probability - MIT OpenCourseWare"
        ],
        completionTime: "20 hours"
      },
      {
        title: "Python Programming",
        duration: "1 week",
        resources: [
          "Python for Data Science - DataCamp",
          "NumPy & Pandas Fundamentals - Real Python",
          "Jupyter Notebooks - Official Documentation"
        ],
        completionTime: "10 hours"
      },
      {
        title: "ML Algorithms",
        duration: "3 weeks",
        resources: [
          "Supervised Learning - Coursera ML Course",
          "Unsupervised Learning - Stanford CS229",
          "Neural Networks - Deep Learning Book Ch. 6-9"
        ],
        completionTime: "30 hours"
      },
      {
        title: "Practical Projects",
        duration: "2 weeks",
        resources: [
          "Image Classification with TensorFlow",
          "Natural Language Processing with PyTorch",
          "ML Model Deployment with Flask"
        ],
        completionTime: "20 hours"
      }
    ]
  },
  "javascript": {
    subject: "JavaScript",
    description: "Master modern JavaScript from fundamentals to advanced concepts and frameworks.",
    totalDuration: "6 weeks",
    items: [
      {
        title: "JavaScript Fundamentals",
        duration: "1 week",
        resources: [
          "JavaScript Basics - MDN Web Docs",
          "JavaScript Data Types & Structures",
          "Functions & Scope in JavaScript"
        ],
        completionTime: "10 hours"
      },
      {
        title: "DOM Manipulation",
        duration: "1 week",
        resources: [
          "Selecting & Modifying Elements",
          "Event Handling",
          "Creating Dynamic Content"
        ],
        completionTime: "8 hours"
      },
      {
        title: "Asynchronous JavaScript",
        duration: "2 weeks",
        resources: [
          "Promises & Async/Await",
          "Fetch API & AJAX",
          "Working with APIs"
        ],
        completionTime: "15 hours"
      },
      {
        title: "Modern JavaScript",
        duration: "2 weeks",
        resources: [
          "ES6+ Features",
          "Modules & Package Management",
          "React/Vue Introduction"
        ],
        completionTime: "20 hours"
      }
    ]
  },
  "data science": {
    subject: "Data Science",
    description: "Learn to analyze data, create visualizations, and extract insights with statistical methods.",
    totalDuration: "10 weeks",
    items: [
      {
        title: "Data Analysis Fundamentals",
        duration: "2 weeks",
        resources: [
          "Introduction to Data Analysis",
          "Python for Data Analysis",
          "Exploratory Data Analysis"
        ],
        completionTime: "20 hours"
      },
      {
        title: "Data Visualization",
        duration: "2 weeks",
        resources: [
          "Matplotlib & Seaborn",
          "Data Visualization Principles",
          "Interactive Visualizations with Plotly"
        ],
        completionTime: "15 hours"
      },
      {
        title: "Statistical Methods",
        duration: "3 weeks",
        resources: [
          "Descriptive Statistics",
          "Hypothesis Testing",
          "Regression Analysis"
        ],
        completionTime: "25 hours"
      },
      {
        title: "Machine Learning",
        duration: "3 weeks",
        resources: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Model Evaluation & Improvement"
        ],
        completionTime: "30 hours"
      }
    ]
  }
};

// Default study plan when nothing is selected
const defaultPlan: StudyPlan = {
  subject: "Select a subject",
  description: "Please enter a subject to see a personalized study plan.",
  totalDuration: "-",
  items: []
};

export default function InteractiveStudyPlanDemo() {
  const [subject, setSubject] = useState("");
  const [plan, setPlan] = useState<StudyPlan>(defaultPlan);
  const [showPlan, setShowPlan] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!subject.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const normalizedSubject = subject.toLowerCase().trim();
      
      // Check if we have a pre-made plan
      if (studyPlans[normalizedSubject]) {
        setPlan(studyPlans[normalizedSubject]);
      } else {
        // For other subjects, generate a generic plan
        setPlan({
          subject: subject.charAt(0).toUpperCase() + subject.slice(1),
          description: `A personalized study plan for mastering ${subject}.`,
          totalDuration: "8 weeks",
          items: [
            {
              title: "Fundamentals",
              duration: "2 weeks",
              resources: [
                `Introduction to ${subject}`,
                `${subject} Basic Concepts`,
                `${subject} Core Principles`
              ],
              completionTime: "15 hours"
            },
            {
              title: "Intermediate Concepts",
              duration: "3 weeks",
              resources: [
                `Advanced ${subject} Theory`,
                `${subject} Practical Applications`,
                `${subject} Problem Solving`
              ],
              completionTime: "25 hours"
            },
            {
              title: "Advanced Topics",
              duration: "3 weeks",
              resources: [
                `${subject} Specialization`,
                `${subject} in Practice`,
                `${subject} Real-world Projects`
              ],
              completionTime: "30 hours"
            }
          ]
        });
      }
      
      setShowPlan(true);
      setLoading(false);
    }, 1500); // Simulate 1.5 seconds of "AI generating" time
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Try Our Study Plan Generator
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Enter any subject you'd like to learn and get a personalized study plan instantly.
        </p>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              What do you want to learn?
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="subject" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Subject or Topic
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder="e.g., Machine Learning, JavaScript, Data Science"
                  value={subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold
                transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating Plan...
                  </span>
                ) : (
                  "Generate Study Plan"
                )}
              </button>
            </form>

            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p className="mb-2">Try these sample subjects:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(studyPlans).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSubject(key)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg overflow-hidden">
            {!showPlan ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                  <svg 
                    className="w-8 h-8 text-indigo-600 dark:text-indigo-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Your Study Plan Will Appear Here
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter a subject on the left to generate a personalized AI study plan.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {plan.subject}
                  </h3>
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs px-3 py-1 rounded-full">
                    {plan.totalDuration}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {plan.description}
                </p>

                <div className="space-y-4 overflow-auto max-h-[320px] pr-2">
                  {plan.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          {item.title}
                        </h4>
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                          {item.duration}
                        </span>
                      </div>
                      <ul className="space-y-1 pl-5 list-disc text-gray-600 dark:text-gray-300 text-sm">
                        {item.resources.map((resource, i) => (
                          <li key={i}>{resource}</li>
                        ))}
                      </ul>
                      <div className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
                        Est. completion: {item.completionTime}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                    onClick={() => {
                      document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Get Full Access
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 