'use client';

export default function Features() {
  const features = [
    {
      icon: "fas fa-brain",
      title: "Personalized Learning",
      description: "Study plans tailored to your unique learning style, schedule, and knowledge level."
    },
    {
      icon: "fas fa-calendar-alt",
      title: "Smart Scheduling",
      description: "Optimize your study time with intelligently scheduled sessions based on your peak productivity hours."
    },
    {
      icon: "fas fa-chart-line",
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and achieve consistent improvement."
    },
    {
      icon: "fas fa-book",
      title: "Curated Resources",
      description: "Access high-quality learning materials specifically chosen to match your learning style and goals."
    },
    {
      icon: "fas fa-bell",
      title: "Smart Reminders",
      description: "Never miss a study session with timely notifications and calendar integration."
    },
    {
      icon: "fas fa-shield-alt",
      title: "Privacy Focused",
      description: "Enhanced protection for all users with special safeguards for students under 18."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose SchedulEd?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform offers everything you need to maximize your study efficiency.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-2xl mb-6">
                <i className={feature.icon}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 