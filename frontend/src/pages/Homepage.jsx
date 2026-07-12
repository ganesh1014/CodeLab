import { useEffect, useState, useMemo, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { 
  LogOut, 
  Code, 
  Compass, 
  LayoutDashboard, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Circle,
  Filter,
  Trophy,
  Settings,
  UserCircle,
  CreditCard,
  ChevronDown
} from 'lucide-react';

function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [activeTab, setActiveTab] = useState('problems');
  const [loading, setLoading] = useState(true);
  
  // Dropdown state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [problemsRes, solvedRes] = await Promise.all([
          axiosClient.get('/problem/getAllProblem'),
          user ? axiosClient.get('/problem/problemSolvedByUser') : Promise.resolve({ data: [] })
        ]);
        setProblems(problemsRes.data);
        setSolvedProblems(solvedRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
    setShowUserMenu(false);
  };

  const goToProfile = () => {
    if (user?._id) {
      navigate(`/profile/${user._id}`);
      setShowUserMenu(false);
    }
  };

  const goToAdmin = () => navigate('/admin');
  
  const goToAccount = () => {
    navigate('/account');
    setShowUserMenu(false);
  };

  const goToSettings = () => {
    navigate('/settings');
    setShowUserMenu(false);
  };
  
  // Filter logic
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
      const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
      const statusMatch = filters.status === 'all' || 
                        solvedProblems.some(sp => sp._id === problem._id);
      return difficultyMatch && tagMatch && statusMatch;
    });
  }, [problems, solvedProblems, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProblems = filteredProblems.slice(startIndex, startIndex + itemsPerPage);
  
  const solvedCount = solvedProblems.length;
  const totalCount = problems.length;
  const progressPercentage = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content font-sans">
      
      {/* Navigation Bar */}
      <div className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-50 px-6 h-16">
        <div className="navbar-start gap-8">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold hover:text-primary transition-colors text-base-content">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span>CodeLab</span>
          </NavLink>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('problems')}
              className={`btn btn-sm px-4 h-9 rounded-lg border-0 ${
                activeTab === 'problems'
                  ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300' // Soft purple active state
                  : 'btn-ghost text-base-content/70 hover:bg-base-200'
              }`}
            >
              Problems
            </button>
            
            <button
              onClick={() => setActiveTab('explore')}
              className={`btn btn-sm px-4 h-9 rounded-lg border-0 ${
                activeTab === 'explore'
                  ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300'
                  : 'btn-ghost text-base-content/70 hover:bg-base-200'
              }`}
            >
              Explore
            </button>
          </div>
        </div>

        <div className="navbar-end gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={goToAdmin}
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-0 px-4 h-9 rounded-lg font-medium shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin</span>
            </button>
          )}

          {/* User Dropdown */}
          <div 
            className={`dropdown dropdown-end ${showUserMenu ? 'dropdown-open' : ''}`} 
            ref={menuRef}
          >
            <div 
              role="button" 
              className="btn btn-ghost btn-sm px-2 gap-2 hover:bg-base-200 h-9 rounded-lg"
              onClick={(e) => {
                e.stopPropagation(); // Prevent bubble up
                setShowUserMenu(!showUserMenu);
              }}
            >
              <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full w-8 flex items-center justify-center">
                  <span className="text-xs font-bold">{user?.firstName?.[0]?.toUpperCase()}</span>
                </div>
              </div>
              <span className="font-medium hidden sm:block text-sm">{user?.firstName}</span>
              <ChevronDown className={`w-4 h-4 text-base-content/50 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Content */}
            {showUserMenu && (
              <ul className="menu dropdown-content mt-2 z-[100] p-2 shadow-xl bg-base-100 rounded-xl w-56 border border-base-200 animate-in fade-in zoom-in-95 duration-100">
                <li className="menu-title px-4 py-2 border-b border-base-200 bg-base-50 -mx-2 -mt-2 mb-2 rounded-t-xl">
                  <span className="text-sm font-bold text-base-content">{user?.firstName} {user?.lastName}</span>
                  <span className="text-xs font-normal text-base-content/60 lowercase truncate">{user?.emailId}</span>
                </li>
                <li><a onClick={goToProfile} className="py-2.5"><UserCircle className="w-4 h-4" /> Profile</a></li>
                <li><a onClick={goToAccount} className="py-2.5"><CreditCard className="w-4 h-4" /> Account</a></li>
                <li><a onClick={goToSettings} className="py-2.5"><Settings className="w-4 h-4" /> Settings</a></li>
                <div className="divider my-1"></div>
                <li><a onClick={handleLogout} className="text-error hover:bg-error/10 py-2.5"><LogOut className="w-4 h-4" /> Logout</a></li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {activeTab === 'problems' ? (
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Solved Card */}
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body flex-row items-center p-5 gap-5">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <Trophy className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider font-bold mb-1">Solved</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-base-content">{solvedCount}</span>
                      <span className="text-sm text-base-content/40 font-medium">/ {totalCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress Card */}
              <div className="card bg-base-100 shadow-sm border border-base-200 md:col-span-2">
                <div className="card-body p-5 justify-center">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-base-content/50 uppercase tracking-wider font-bold">Progress</p>
                    <span className="text-sm font-bold text-emerald-500">{Math.round(progressPercentage)}%</span>
                  </div>
                  <progress 
                    className="progress progress-success w-full h-2.5" 
                    value={progressPercentage} 
                    max="100"
                  ></progress>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4 flex-row flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-base-content/60 mr-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>

                <select 
                  className="select select-bordered select-sm w-full max-w-[160px] focus:border-indigo-500 focus:outline-none"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Problems</option>
                  <option value="solved">Solved</option>
                </select>

                <select 
                  className="select select-bordered select-sm w-full max-w-[160px] focus:border-indigo-500 focus:outline-none"
                  value={filters.difficulty}
                  onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <select 
                  className="select select-bordered select-sm w-full max-w-[160px] focus:border-indigo-500 focus:outline-none"
                  value={filters.tag}
                  onChange={(e) => setFilters({...filters, tag: e.target.value})}
                >
                  <option value="all">All Topics</option>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>

                <div className="ml-auto text-sm text-base-content/40 font-medium">
                  Showing {paginatedProblems.length} of {filteredProblems.length} problems
                </div>
              </div>
            </div>

            {/* Problems Table */}
            <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-100 border-b border-base-200">
                    <tr>
                      <th className="w-16 py-4 pl-6 text-xs font-bold text-base-content/40 uppercase tracking-wider">Status</th>
                      <th className="py-4 text-xs font-bold text-base-content/40 uppercase tracking-wider">Title</th>
                      <th className="w-32 py-4 text-xs font-bold text-base-content/40 uppercase tracking-wider">Difficulty</th>
                      <th className="w-32 py-4 text-xs font-bold text-base-content/40 uppercase tracking-wider">Topic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {paginatedProblems.length > 0 ? (
                      paginatedProblems.map((problem) => {
                        const isSolved = solvedProblems.some(sp => sp._id === problem._id);
                        return (
                          <tr 
                            key={problem._id} 
                            className="hover:bg-base-50 transition-colors cursor-pointer group border-0"
                            onClick={() => navigate(`/problem/${problem._id}`)}
                          >
                            <td className="pl-6 py-4">
                              {isSolved ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-base-content/20 group-hover:text-base-content/40 transition-colors" />
                              )}
                            </td>
                            <td className="py-4">
                              <span className={`font-medium text-[15px] ${isSolved ? 'text-base-content/60' : 'text-base-content'} group-hover:text-indigo-600 transition-colors`}>
                                {problem.title}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className={`badge badge-sm border-0 py-3 font-semibold ${
                                problem.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                problem.difficulty === 'medium' ? 'bg-amber-50 text-amber-600 dark:bg-yellow-500/10 dark:text-yellow-400' :
                                'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                              }`}>
                                {problem.difficulty}
                              </div>
                            </td>
                            <td className="py-4">
                              <span className="text-sm text-base-content/50 italic">
                                {problem.tags}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-16 text-center text-base-content/60">
                          <div className="flex flex-col items-center gap-2">
                            <Filter className="w-10 h-10 opacity-10" />
                            <p>No problems found</p>
                            <button 
                              className="btn btn-link btn-sm no-underline text-indigo-600"
                              onClick={() => setFilters({ difficulty: 'all', tag: 'all', status: 'all' })}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-base-200 px-6 py-4 flex items-center justify-between bg-base-50/50">
                  <div className="text-sm text-base-content/50">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <div className="join shadow-sm bg-base-100 rounded-lg">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="join-item btn btn-sm btn-ghost border-r border-base-200 disabled:bg-transparent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {getPageNumbers().map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                        disabled={page === '...'}
                        className={`join-item btn btn-sm border-r border-base-200 ${
                          page === currentPage
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600'
                            : page === '...'
                            ? 'btn-ghost btn-disabled bg-transparent'
                            : 'btn-ghost hover:bg-base-200 bg-transparent font-normal'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="join-item btn btn-sm btn-ghost disabled:bg-transparent"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State for future pages */}
            {currentPage > totalPages && (
              <div className="card bg-base-100 border border-base-200 p-12 text-center mt-6 shadow-sm">
                <div className="flex flex-col items-center">
                    <Compass className="w-16 h-16 text-base-content/10 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">More problems coming soon</h3>
                    <p className="text-base-content/50">Check back later for new challenges</p>
                    <button 
                    className="btn bg-indigo-600 hover:bg-indigo-700 text-white mt-4 border-0"
                    onClick={() => setCurrentPage(1)}
                    >
                    Back to Page 1
                    </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card bg-base-100 border border-base-200 p-16 text-center shadow-sm">
            <div className="flex flex-col items-center">
                <Compass className="w-20 h-20 text-base-content/10 mb-6" />
                <h2 className="text-2xl font-bold mb-2">Explore</h2>
                <p className="text-base-content/50 max-w-md">We are currently working on new features for the Explore section. Stay tuned!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;










































































