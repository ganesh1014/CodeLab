import React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, RefreshCw, Zap, Video, Shield, LayoutDashboard, Users } from 'lucide-react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function Admin() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [selectedOption, setSelectedOption] = useState(null);

  // Redirect if not admin
  React.useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'from-emerald-500 to-teal-600',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10',
      borderColor: 'border-emerald-200 dark:border-emerald-500/20',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'from-amber-500 to-orange-600',
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10',
      borderColor: 'border-amber-200 dark:border-amber-500/20',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'from-rose-500 to-pink-600',
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'from-rose-50 to-pink-50 dark:from-rose-500/10 dark:to-pink-500/10',
      borderColor: 'border-rose-200 dark:border-rose-500/20',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload And Delete Videos',
      icon: Video,
      color: 'from-indigo-500 to-purple-600',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10',
      borderColor: 'border-indigo-200 dark:border-indigo-500/20',
      route: '/admin/video'
    },
    {
      id: 'users',
      title: 'Manage Users',
      description: 'View all users, promote to admin, or create new admins',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10',
      borderColor: 'border-blue-200 dark:border-blue-500/20',
      route: '/admin/users'
    }
  ];

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-base-content">
              Admin Panel
            </h1>
          </div>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            Manage coding problems and platform content
          </p>
        </div>

        {/* Stats Bar */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60 uppercase tracking-wider">Admin Status</p>
                    <p className="text-xl font-bold text-base-content">Active</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60 uppercase tracking-wider">Quick Actions</p>
                    <p className="text-xl font-bold text-base-content">4 Available</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60 uppercase tracking-wider">Last Updated</p>
                    <p className="text-xl font-bold text-base-content">Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="card-body p-8">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${option.iconBg} border ${option.borderColor}`}>
                      <IconComponent size={32} className={option.iconColor} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-base-content mb-3">
                        {option.title}
                      </h2>
                      
                      <p className="text-base-content/60 mb-6 leading-relaxed">
                        {option.description}
                      </p>
                      
                      {/* Action Button */}
                      <NavLink 
                        to={option.route}
                        className={`btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${option.color} hover:opacity-90 text-white font-medium rounded-lg border-0`}
                      >
                        <IconComponent size={20} />
                        {option.title}
                      </NavLink>
                    </div>
                  </div>
                </div>
                
                {/* Selected Indicator */}
                {selectedOption === option.id && (
                  <div className={`h-1 bg-gradient-to-r ${option.color}`}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-base-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-base-content/60 text-sm">
              Logged in as <span className="font-medium text-base-content">{user?.emailId}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="btn btn-ghost gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
              
              <NavLink
                to="/settings"
                className="btn btn-ghost gap-2"
              >
                <Shield className="w-4 h-4" />
                Settings
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;