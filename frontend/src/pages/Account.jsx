import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { 
  User, 
  Mail, 
  Shield, 
  CreditCard, 
  Github, 
  Linkedin, 
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';

const Account = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

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
              <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Account
            </h1>
            <p className="text-base-content/60 text-sm">Manage your account details and connections</p>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="card bg-base-100 border border-base-300 shadow-sm mb-6">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
              <h2 className="card-title text-lg text-base-content">Account Information</h2>
            </div>
            
            <div className="space-y-6">
              {/* CodeLab ID */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-lg border border-indigo-200 dark:border-indigo-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">CodeLab ID</p>
                    <p className="font-mono text-sm text-base-content">{user._id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(user._id)}
                  className="btn btn-ghost btn-sm btn-square"
                  title="Copy ID"
                >
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Grid Layout for other fields */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300 hover:border-base-content/20 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-base-content/60" />
                    <span className="text-sm text-base-content/60">First Name</span>
                  </div>
                  <p className="text-base-content font-medium">{user.firstName}</p>
                </div>

                {/* Last Name */}
                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300 hover:border-base-content/20 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-base-content/60" />
                    <span className="text-sm text-base-content/60">Last Name</span>
                  </div>
                  <p className="text-base-content font-medium">{user.lastName || '-'}</p>
                </div>

                {/* Email */}
                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300 hover:border-base-content/20 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-base-content/60" />
                    <span className="text-sm text-base-content/60">Email ID</span>
                  </div>
                  <p className="text-base-content font-medium">{user.emailId}</p>
                </div>

                {/* Role */}
                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300 hover:border-base-content/20 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-base-content/60" />
                    <span className="text-sm text-base-content/60">Role</span>
                  </div>
                  <div className={`badge badge-sm gap-1 ${
                    user.role === 'admin' 
                      ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' 
                      : 'bg-base-200 text-base-content/70 border-base-300'
                  }`}>
                    {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-base-content/40">
          <p>Your CodeLab ID is unique and cannot be changed.</p>
        </div>
      </div>
    </div>
  );
};

export default Account;