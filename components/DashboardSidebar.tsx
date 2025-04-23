'use client';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  // Navigation items configuration
  const navItems = [
    { id: 'plans', label: 'Study Plans', icon: 'fas fa-book-open' },
    { id: 'timer', label: 'Study Timer', icon: 'fas fa-clock' },
    { id: 'tasks', label: 'Tasks', icon: 'fas fa-tasks' },
    { id: 'resources', label: 'Resources', icon: 'fas fa-link' },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
  ];
  
  return (
    <aside className="md:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-indigo-600" aria-hidden="true"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Study Dashboard</h3>
              <p className="text-sm text-gray-500">Welcome back!</p>
            </div>
          </div>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => onTabChange(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center transition ${
                    activeTab === item.id 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${item.icon} mr-3`} aria-hidden="true"></i>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-800 mb-2">Need Help?</h4>
            <p className="text-sm text-indigo-700 mb-3">
              Have questions about using SchedulEd?
            </p>
            <button className="w-full px-3 py-2 text-sm text-indigo-700 border border-indigo-300 rounded-md hover:bg-indigo-100 transition">
              View Tutorial
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
} 