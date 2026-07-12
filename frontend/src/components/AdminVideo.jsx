import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Video, 
  Upload, 
  Trash2, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  Filter,
  CloudUpload,
  Eye,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [videoSet, setVideoSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Redirect if not admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [problemsRes, videoStatusRes] = await Promise.all([
        axiosClient.get('/problem/getAllProblem'),
        axiosClient.get('/video/status'),
      ]);

      const problemsData = problemsRes.data.problems || problemsRes.data;
      setProblems(problemsData);
      setVideoSet(new Set(videoStatusRes.data.problemIdsWithVideo || []));
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (problemId) => {
    if (!window.confirm('Are you sure you want to delete this video solution?')) return;

    try {
      setDeleteLoading(problemId);
      setError(null);
      await axiosClient.delete(`/video/delete/${problemId}`);
      
      // Remove from videoSet
      setVideoSet(prev => {
        const updated = new Set(prev);
        updated.delete(problemId);
        return updated;
      });
      
      alert('Video deleted successfully!');
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete video';
      setError(message);
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter problems
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = searchTerm === "" || 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof problem.tags === 'string' && problem.tags.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === "all" || 
      problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'hard': return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20';
    }
  };

  const hasVideo = (problemId) => videoSet.has(problemId);

  if (user?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading video management...</p>
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Video Management</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Upload and manage video solutions for problems</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Problems</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{problems.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">With Videos</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {Array.from(videoSet).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/10 dark:to-orange-500/10 rounded-lg flex items-center justify-center">
                <CloudUpload className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Ready for Upload</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {problems.length - Array.from(videoSet).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Filtered</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{filteredProblems.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <span className="text-sm text-slate-700 dark:text-slate-300">Upload available (no video)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600"></div>
                <span className="text-sm text-slate-700 dark:text-slate-300">Delete available (has video)</span>
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <Info className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-500 ml-1">Hover over buttons for more info</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-500/5 dark:to-pink-500/5 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-rose-700 dark:text-rose-400">Error</h3>
                  <p className="text-sm text-rose-700/80 dark:text-rose-400/80 mt-1">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="text-rose-500 hover:text-rose-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search problems by title or tag..."
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
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="w-12 px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                  <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Difficulty</th>
                  <th className="w-48 px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tags</th>
                  <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Video Status</th>
                  <th className="w-64 px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem, index) => (
                    <tr 
                      key={problem._id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {problem.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600 dark:text-slate-400 text-sm">
                          {typeof problem.tags === 'string' ? problem.tags : 
                           Array.isArray(problem.tags) ? problem.tags.join(", ") : problem.tags}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          hasVideo(problem._id) 
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20'
                            : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20'
                        }`}>
                          {hasVideo(problem._id) ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Video Available
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              No Video
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* UPLOAD BUTTON */}
                          {hasVideo(problem._id) ? (
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-300 to-purple-400 text-white rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
                              disabled
                              title="Video already uploaded. Delete existing video first."
                            >
                              <Upload className="w-4 h-4" />
                              Upload
                            </button>
                          ) : (
                            <NavLink 
                              to={`/admin/upload/${problem._id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow"
                              title="Upload video solution"
                            >
                              <Upload className="w-4 h-4" />
                              Upload
                            </NavLink>
                          )}

                          {/* DELETE BUTTON */}
                          {hasVideo(problem._id) ? (
                            <button
                              onClick={() => handleDelete(problem._id)}
                              disabled={deleteLoading === problem._id}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                              title="Delete video solution"
                            >
                              {deleteLoading === problem._id ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-300 to-pink-400 text-white rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
                              disabled
                              title="No video to delete"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 opacity-20" />
                        <p>No problems found matching your filters</p>
                        <button 
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm mt-2"
                          onClick={() => {
                            setSearchTerm('');
                            setDifficultyFilter('all');
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

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-600">
          <p className="flex items-center justify-center gap-2">
            <Video className="w-4 h-4" />
            {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminVideo;















