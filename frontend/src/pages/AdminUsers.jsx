import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRole } from '../authSlice';
import { 
  ArrowLeft, Crown, User as UserIcon, ShieldAlert, 
  Search, Filter, RefreshCw, AlertTriangle, Users, 
  UserCheck, UserPlus 
} from 'lucide-react';
import { useNavigate } from 'react-router';

function AdminUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allUsers, isUsersLoading, user: currentUser } = useSelector((state) => state.auth);
  
  // Local state for filters and UI
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [promoteLoading, setPromoteLoading] = useState(null);

  // Redirect non-admin users
  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Fetch users when component mounts (admin only)
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser?.role]);

  // Filter users based on search and role
  useEffect(() => {
    if (!allUsers) return;
    
    let result = [...allUsers];

    // Apply search filter (name, email)
    if (searchTerm) {
      result = result.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.emailId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(user => 
        user.role?.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, allUsers]);

  const fetchUsers = async () => {
    try {
      setError(null);
      await dispatch(fetchAllUsers()).unwrap();
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error(err);
    }
  };

  const handlePromote = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to promote ${userName} to Admin? This action grants full platform access.`)) {
      return;
    }
    
    try {
      setPromoteLoading(userId);
      await dispatch(updateUserRole({ userId, role: 'admin' })).unwrap();
      // Refresh user list after successful promotion
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to promote user');
      console.error(err);
    } finally {
      setPromoteLoading(null);
    }
  };

  // Compute stats from allUsers (full list, not filtered)
  const totalUsers = allUsers?.length || 0;
  const adminCount = allUsers?.filter(u => u.role === 'admin').length || 0;
  const regularCount = allUsers?.filter(u => u.role !== 'admin').length || 0;

  const getRoleBadgeStyle = (role) => {
    if (role === 'admin') {
      return 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20';
    }
    return 'text-slate-600 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20';
  };

  // Don't render anything while redirecting
  if (currentUser?.role !== 'admin') {
    return null;
  }

  if (isUsersLoading && !allUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-500/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">Error</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300"
                  onClick={fetchUsers}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Manage user roles and permissions</p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/5 dark:to-purple-500/5 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-indigo-800 dark:text-indigo-400">Admin Role Management</h3>
              <p className="text-sm text-indigo-700/80 dark:text-indigo-400/80 mt-1">
                Promoting a user to admin gives them full access to manage problems, users, and platform settings.
                Only current admins can perform this action.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-500/10 to-slate-600/10 dark:from-slate-500/10 dark:to-slate-600/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Users</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-500/10 dark:to-indigo-500/10 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Administrators</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{adminCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Regular Users</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{regularCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <select
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="user">Regular Users</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="w-12 px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="w-36 px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr 
                      key={user._id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                        {user.emailId}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeStyle(user.role)}`}>
                          {user.role === 'admin' ? (
                            <span className="flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            'User'
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.role !== 'admin' ? (
                          <button
                            onClick={() => handlePromote(user._id, `${user.firstName} ${user.lastName}`)}
                            disabled={promoteLoading === user._id}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                          >
                            {promoteLoading === user._id ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Promoting...
                              </>
                            ) : (
                              <>
                                <Crown className="w-4 h-4" />
                                Promote
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium text-center">
                            Already Admin
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <UserPlus className="w-8 h-8 opacity-20" />
                        <p>No users found matching your filters</p>
                        <button 
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm mt-2"
                          onClick={() => {
                            setSearchTerm('');
                            setRoleFilter('all');
                          }}
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-600">
          <p className="flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} displayed
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;


//from-indigo-500 to-purple-600