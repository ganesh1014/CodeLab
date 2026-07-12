import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { logoutUser } from '../authSlice';
import { useTheme } from '../context/ThemeContext';
import { 
  Settings as SettingsIcon,
  ArrowLeft, Moon, Sun, Monitor, LogOut,
  Code2, AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    websiteTheme, 
    editorTheme, 
    changeWebsiteTheme, 
    changeEditorTheme 
  } = useTheme();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 text-base-content p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-ghost btn-square"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Settings
            </h1>
            <p className="text-base-content/60 text-sm">Manage your preferences</p>
          </div>
        </div>

        {/* Website Theme Section */}
        <div className="card bg-base-100 border border-base-300 shadow-sm mb-6">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
              <h2 className="card-title text-lg text-base-content flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Appearance
              </h2>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-base-content/60 mb-4 uppercase tracking-wider">
                Website Theme
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'system', label: 'System', icon: Monitor, description: 'Follows your OS' },
                  { id: 'light',  label: 'Light',  icon: Sun, description: 'Light mode' },
                  { id: 'dark',   label: 'Dark',   icon: Moon, description: 'Dark mode' },
                ].map((theme) => {
                  const isActive = websiteTheme === theme.id;
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => changeWebsiteTheme(theme.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                        isActive
                          ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10'
                          : 'border-base-300 bg-base-200/50 hover:border-base-content/20'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-base-content/60'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isActive
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-base-content'
                      }`}>
                        {theme.label}
                      </span>
                      <span className="text-xs text-base-content/40 mt-1">
                        {theme.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Editor Theme Section */}
        <div className="card bg-base-100 border border-base-300 shadow-sm mb-6">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
              <h2 className="card-title text-lg text-base-content flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Code Editor
              </h2>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-base-content/60 mb-4 uppercase tracking-wider">
                Monaco Editor Theme
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'vs-dark',   label: 'Dark+',          desc: 'VS Code Dark Plus',    icon: Moon },
                  { id: 'light',     label: 'Light',          desc: 'VS Code Light',        icon: Sun },
                  { id: 'hc-black',  label: 'High Contrast',  desc: 'Accessibility',        icon: Code2 },
                  { id: 'dark',      label: 'Dark',           desc: 'VS Code Dark',         icon: Moon },
                ].map((theme) => {
                  const isActive = editorTheme === theme.id;
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => changeEditorTheme(theme.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isActive
                          ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10'
                          : 'border-base-300 bg-base-200/50 hover:border-base-content/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-base-content/60'
                        }`} />
                        <div>
                          <span className={`block font-medium ${
                            isActive
                              ? 'text-indigo-700 dark:text-indigo-300'
                              : 'text-base-content'
                          }`}>
                            {theme.label}
                          </span>
                          <span className="text-xs text-base-content/40">
                            {theme.desc}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
              <h2 className="card-title text-lg text-base-content">Session</h2>
            </div>
            
            {!showLogoutConfirm ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="btn w-full gap-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-700 dark:text-red-400">
                      Confirm Logout
                    </h3>
                    <p className="text-sm text-base-content/60 mt-1">
                      Are you sure you want to logout?
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleLogout}
                    className="flex-1 btn bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0"
                  >
                    Yes, Logout
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 btn bg-base-200 hover:bg-base-300 text-base-content border-0"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-base-content/40">
          <p>CodeLab v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;