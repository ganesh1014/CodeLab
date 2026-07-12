import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Edit2, 
  Save, 
  X, 
  Shield, 
  Code,
  Clock,
  TrendingUp,
  ArrowLeft,
  Trophy,
  BarChart3,
  Hash,
  Home
} from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useSelector((state) => state.auth);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);

  const isOwnProfile = isAuthenticated && currentUser?._id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/user/profile/${id}`);
      setProfile(res.data.user);
      setEditForm({
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName || "",
        age: res.data.user.age || ""
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      await axiosClient.put('/user/profile/update', editForm);
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="card bg-base-100 border border-error/20 shadow-sm">
            <div className="card-body p-6">
              <h3 className="card-title text-error mb-2">Error Loading Profile</h3>
              <p className="text-base-content/60 mb-4">{error}</p>
              <button 
                className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 w-full"
                onClick={() => navigate('/')}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 text-base-content p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-square"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-base-content">Profile</h1>
            <p className="text-base-content/60 text-sm">Viewing {isOwnProfile ? 'your' : ''} profile</p>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="card bg-base-100 border border-base-300 shadow-sm mb-6">
          <div className="card-body p-6">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
              <h2 className="text-lg font-semibold text-base-content">Profile Information</h2>
              
              {/* Edit Button */}
              {isOwnProfile && (
                <div className="join">
                  {isEditing ? (
                    <>
                      <button 
                        className="join-item btn btn-sm btn-ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button 
                        className="join-item btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                        onClick={handleUpdate}
                        disabled={updateLoading}
                      >
                        {updateLoading ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save
                      </button>
                    </>
                  ) : (
                    <button 
                      className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Profile Content */}
            <div className="flex flex-col md:flex-row gap-6 items-start">

              <div className="flex-shrink-0">
                <div className="avatar placeholder">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-24 h-24 rounded-full text-3xl font-bold shadow-lg flex items-center justify-center ">
                    {/* <span className="font-[cursive] italic lowercase" style={{ fontFamily: "'Pacifico', cursive" }}>
                      {profile.firstName?.[0]?.toLowerCase()}
                      {profile.lastName?.[0]?.toLowerCase()}
                    </span> */}
                    <span className="italic  tracking-wide" style={{fontFamily: "'Great Vibes', cursive",fontSize: "42px",fontWeight: "500",}}>
                      {profile.firstName?.[0]}
                      {profile.lastName?.[0]?.toLowerCase()}
                    </span>
                  </div>
                </div>
            </div>

              {/* Info Section */}
              <div className="flex-1 w-full">
                <div className="mb-6">
                  {isEditing ? (
                    <div className="space-y-4 max-w-md">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-base-content/60">First Name</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered bg-base-100 w-full"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                            placeholder="First Name"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-base-content/60">Last Name</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered bg-base-100 w-full"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-base-content/60">Age</span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered bg-base-100 w-24"
                          value={editForm.age}
                          onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                          placeholder="Age"
                          min="6"
                          max="80"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-base-content">
                          {profile.firstName} {profile.lastName}
                        </h1>
                        {profile.role === 'admin' && (
                          <span className="badge badge-sm bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                            <Shield className="w-3 h-3" /> Admin
                          </span>
                        )}
                      </div>
                      <p className="text-base-content/60 flex items-center gap-2 mb-4">
                        <Mail className="w-4 h-4" /> {profile.emailId}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        {profile.age && (
                          <span className="text-base-content/60 flex items-center gap-1">
                            <User className="w-4 h-4" /> Age: {profile.age}
                          </span>
                        )}
                        <span className="text-base-content/60 flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> Joined {formatDate(profile.createdAt)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card bg-gradient-to-r from-base-200 to-base-300 border border-base-300">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                          <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60 uppercase tracking-wider">Problems Solved</p>
                          <p className="text-xl font-bold text-base-content">
                            {profile.problemSolved?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-gradient-to-r from-base-200 to-base-300 border border-base-300">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60 uppercase tracking-wider">Role</p>
                          <p className="text-xl font-bold text-base-content capitalize">
                            {profile.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-gradient-to-r from-base-200 to-base-300 border border-base-300">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60 uppercase tracking-wider">Total Score</p>
                          <p className="text-xl font-bold text-base-content">
                            {profile.problemSolved?.length * 100 || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-gradient-to-r from-base-200 to-base-300 border border-base-300">
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60 uppercase tracking-wider">Rank</p>
                          <p className="text-xl font-bold text-base-content">
                            #--
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Solved Problems Section */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
                  <h2 className="text-lg font-semibold text-base-content flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Solved Problems ({profile.problemSolved?.length || 0})
                  </h2>
                </div>
                
                {profile.problemSolved?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="text-base-content/60 uppercase tracking-wider">#</th>
                          <th className="text-base-content/60 uppercase tracking-wider">Title</th>
                          <th className="text-base-content/60 uppercase tracking-wider">Difficulty</th>
                          <th className="text-base-content/60 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.problemSolved.map((problem, index) => (
                          <tr key={problem._id || index} className="hover:bg-base-200/50">
                            <td>
                              <div className="flex items-center gap-2 text-base-content/60">
                                <Hash className="w-4 h-4" />
                                {index + 1}
                              </div>
                            </td>
                            <td>
                              <span className="font-medium text-base-content hover:text-indigo-600 cursor-pointer">
                                {problem.title}
                              </span>
                            </td>
                            <td>
                              <span className={`badge badge-sm border-0 ${
                                problem.difficulty === 'easy' 
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                  : problem.difficulty === 'medium' 
                                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              }`}>
                                {problem.difficulty}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-ghost btn-xs hover:bg-base-300"
                                onClick={() => navigate(`/problem/${problem._id}`)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="avatar placeholder mb-4">
                      <div className="bg-gradient-to-br from-base-200 to-base-300 w-16 h-16 rounded-full flex items-center justify-center">
                        <Code className="w-8 h-8 text-base-content/40" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-base-content mb-2">No problems solved yet</h3>
                    <p className="text-base-content/60 mb-6">Start your coding journey!</p>
                    {isOwnProfile && (
                      <button 
                        className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
                        onClick={() => navigate('/')}
                      >
                        Browse Problems
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 border border-base-300 shadow-sm h-full">
              <div className="card-body p-6">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
                  <h2 className="text-lg font-semibold text-base-content flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Activity Timeline
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"></div>
                      <div className="w-0.5 h-full bg-gradient-to-b from-base-300 to-base-300/0 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="text-sm font-medium text-base-content">Joined Platform</p>
                      <p className="text-xs text-base-content/60 mt-1">{formatDate(profile.createdAt)}</p>
                    </div>
                  </div>
                  
                  {profile.updatedAt !== profile.createdAt && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gradient-to-b from-base-300 to-base-300/0 mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-sm font-medium text-base-content">Profile Updated</p>
                        <p className="text-xs text-base-content/60 mt-1">{formatDate(profile.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-base-content">Last Activity</p>
                      <p className="text-xs text-base-content/60 mt-1">
                        {profile.problemSolved?.length > 0 
                          ? "Solved " + profile.problemSolved.length + " problems" 
                          : "No activity yet"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {profile.problemSolved?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-base-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-base-content/60">Problem Solving Rate</span>
                      <span className="text-sm font-medium text-base-content">
                        {Math.round((profile.problemSolved.length / 30) * 100)}%
                      </span>
                    </div>
                    <progress 
                      className="progress progress-primary w-full h-2" 
                      value={Math.min(100, (profile.problemSolved.length / 30) * 100)} 
                      max="100"
                    ></progress>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;