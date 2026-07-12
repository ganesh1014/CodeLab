import { Link, useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import {
  Code,
  BookOpen,
  LineChart,
  BarChart,
  Trophy,
  SquareCode,
  MessageCircle,
  LayoutGrid,
  GitBranch,
  Cpu,
  GitMerge,
  Link as LinkIcon,
  Coins,
  CheckCircle2,
  Circle,
  TrendingUp,
  Users,
  Zap,
  Calendar,
  ArrowRight,
  Video,
  Bot,
  Activity,
  Terminal,
  Shield,
  LogOut,
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Refs for smooth scrolling
  const videoRef = useRef(null);
  const aiRef = useRef(null);
  const analyticsRef = useRef(null);
  const judgeRef = useRef(null);
  const problemsRef = useRef(null);
  const [selectedLang, setSelectedLang] = useState('C++');

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Dummy stats (unchanged)
  const stats = [
    { label: 'Problems', value: '2,500+', icon: BookOpen, trend: '+200 new' },
    { label: 'Active Users', value: '100K+', icon: Users, trend: 'global' },
    { label: 'Success Rate', value: '72%', icon: TrendingUp, trend: '+5%' },
    { label: 'Daily Challenges', value: '1', icon: Calendar, trend: 'every day' },
  ];

  // Features data (updated with actual features)
  const features = [
    { 
      icon: Video, 
      title: 'Video Solutions', 
      description: 'Watch expert video explanations for every problem. Learn step-by-step approaches.',
      ref: videoRef,
      image: '🎥'
    },
    { 
      icon: Bot, 
      title: 'AI Chatbot Assistant', 
      description: 'Get intelligent hints, code reviews, and problem-specific guidance from our AI.',
      ref: aiRef,
      image: '🤖'
    },
    { 
      icon: Activity, 
      title: 'Dashboard Analytics', 
      description: 'Track your progress, contest ratings, and skill gaps with detailed visualizations.',
      ref: analyticsRef,
      image: '📊'
    },
    { 
      icon: Terminal, 
      title: 'Judge0 Code Runner', 
      description: 'Run your code instantly with Judge0 API. Supports 40+ languages with real-time output.',
      ref: judgeRef,
      image: '⚡'
    }
  ];

  // Topics data (same)
  const topics = [
    { name: 'Arrays', icon: LayoutGrid, color: 'indigo' },
    { name: 'Graphs', icon: GitBranch, color: 'purple' },
    { name: 'Dynamic Prog.', icon: Cpu, color: 'pink' },
    { name: 'Trees', icon: GitMerge, color: 'green' },
    { name: 'Linked Lists', icon: LinkIcon, color: 'blue' },
    { name: 'Greedy', icon: Coins, color: 'orange' },
  ];


// Language-specific code snippets
const codeExamples = {
    'C++': `class Solution {
    public:
          vector<int> twoSum(vector<int>& nums, int target) {
              unordered_map<int, int> map;
              for (int i = 0; i < nums.size(); i++) {
                  int complement = target - nums[i];
                  if (map.find(complement) != map.end()) {
                      return {map[complement], i};
                  }
                  map[nums[i]] = i;
              }
              return {};
          }
      };`,
      
        'Java': `class Solution {
          public int[] twoSum(int[] nums, int target) {
              Map<Integer, Integer> map = new HashMap<>();
              for (int i = 0; i < nums.length; i++) {
                  int complement = target - nums[i];
                  if (map.containsKey(complement)) {
                      return new int[] {map.get(complement), i};
                  }
                  map.put(nums[i], i);
              }
              return new int[] {};
          }
      }`,
    
      'JavaScript': `/**
     * @param {number[]} nums
     * @param {number} target
     * @return {number[]}
     */
    var twoSum = function(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
            const complement = target - nums[i];
            if (map.has(complement)) {
                return [map.get(complement), i];
            }
            map.set(nums[i], i);
        }
        return [];
    };`
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Sticky Navbar - Updated with feature links */}
      <nav className="sticky top-0 z-50 bg-base-100 border-b border-base-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="navbar flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-base-content">CodeLab</span>
            </Link>

            {/* Feature Navigation Links (scroll) */}
            <div className="hidden md:flex items-center gap-5">
              <button onClick={() => scrollToSection(problemsRef)} className="text-base-content/70 hover:text-base-content transition-colors text-sm font-medium">
                Problems
              </button>
              <button onClick={() => scrollToSection(analyticsRef)} className="text-base-content/70 hover:text-base-content transition-colors text-sm font-medium">
                Analytics
              </button>
              <button onClick={() => scrollToSection(judgeRef)} className="text-base-content/70 hover:text-base-content transition-colors text-sm font-medium">
                Fast Execution
              </button>
              <button onClick={() => scrollToSection(videoRef)} className="text-base-content/70 hover:text-base-content transition-colors text-sm font-medium">
                Video Solutions
              </button>
              <button onClick={() => scrollToSection(aiRef)} className="text-base-content/70 hover:text-base-content transition-colors text-sm font-medium">
                AI Chatbot
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn btn-ghost rounded-xl hover:bg-base-200 text-base-content/80">
                Log In
              </Link>
              <Link to="/signup" className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-xl">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section (unchanged but CTA buttons now go to signup) */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-base-content leading-tight">
                  Master Coding Interviews{' '}
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    with Confidence
                  </span>
                </h1>
                <p className="text-base-content/60 text-lg max-w-lg">
                  Video solutions + AI chatbot + Real-time code execution + Enterprise-grade security.
                  All in one platform.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link to="/signup" className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-xl px-6 h-11">
                    Start Solving
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <button onClick={() => scrollToSection(videoRef)} className="btn btn-ghost hover:bg-base-200 rounded-xl px-6">
                    Explore Features
                  </button>
                </div>
              </div>

              {/* Right Side - Dashboard Mockup Card (keep same) */}
              <div className="bg-base-100 border border-base-200 rounded-2xl shadow-sm p-5">
                {/* ... same dashboard mockup content as before ... */}
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-base-content">🔥 Trending Problems</h3>
                    <span className="text-xs text-base-content/40 bg-base-200 px-2 py-1 rounded-lg">Weekly Hot</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 hover:bg-base-200 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-base-content">Two Sum</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-success badge-sm rounded-lg">Easy</span>
                        <span className="text-xs text-base-content/40">✓ Solved</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-base-200 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <Circle className="w-5 h-5 text-base-content/30" />
                        <span className="text-sm font-medium text-base-content">Add Two Numbers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-warning badge-sm rounded-lg">Medium</span>
                        <span className="text-xs text-base-content/40">Attempted</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-base-200 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <Circle className="w-5 h-5 text-base-content/30" />
                        <span className="text-sm font-medium text-base-content">Longest Substring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-error badge-sm rounded-lg">Hard</span>
                        <span className="text-xs text-base-content/40">Not Started</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-base-200 my-2"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-base-200 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-base-content/60">Weekly Goal</span>
                        <TrendingUp className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="text-xl font-bold text-base-content">12/20</div>
                      <progress className="progress progress-indigo w-full h-1 mt-2" value="60" max="100"></progress>
                      <p className="text-xs text-base-content/40 mt-1">60% completed</p>
                    </div>
                    <div className="bg-base-200 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-base-content/60">Contest Rating</span>
                        <Zap className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-xl font-bold text-base-content">1,642</div>
                      <p className="text-xs text-green-500 mt-1">↑ Top 12%</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="badge badge-success badge-md rounded-lg px-3">Easy</span>
                    <span className="badge badge-warning badge-md rounded-lg px-3">Medium</span>
                    <span className="badge badge-error badge-md rounded-lg px-3">Hard</span>
                    <span className="text-xs text-base-content/40 self-center">+250 problems</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section (unchanged) */}
        <section className="py-12 border-y border-base-200 bg-base-100/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-base-100 border border-base-200 rounded-xl p-5 shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-base-content/40 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-base-content mt-1">{stat.value}</p>
                      <p className="text-xs text-base-content/50 mt-2">{stat.trend}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        
        {/* 1. Problems Section with Dynamic Language Tabs */}
        <section ref={problemsRef} className="py-20 bg-base-100/30 border-y border-base-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left side – interactive problem card */}
              <div className="bg-base-100 border border-base-200 rounded-xl shadow-sm overflow-hidden">
                {/* Language tabs - now interactive */}
                <div className="flex border-b border-base-200 bg-base-100 p-1">
                  {['C++', 'Java', 'JavaScript'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        selectedLang === lang
                          ? 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 shadow-sm'
                          : 'text-base-content/60 hover:text-base-content hover:bg-base-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
        
                {/* Problem description */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-sm font-semibold text-green-600 bg-green-100 dark:bg-green-950/30 px-2 py-0.5 rounded">Easy</h3>
                    <span className="text-xs text-base-content/40">#1</span>
                  </div>
                  <h4 className="text-xl font-bold text-base-content">Two Sum</h4>
                  <p className="text-sm text-base-content/70">
                    Given an array of integers <code className="bg-base-200 px-1 rounded">nums</code> and an integer <code className="bg-base-200 px-1 rounded">target</code>, 
                    return <strong>indices</strong> of the two numbers that add up to <code className="bg-base-200 px-1 rounded">target</code>.
                  </p>
        
                  {/* Dynamic code block */}
                  <div className="bg-base-200 rounded-lg overflow-hidden">
                    <div className="bg-base-300/50 px-3 py-1.5 border-b border-base-200 flex justify-between items-center">
                      <span className="text-xs font-mono text-base-content/60">{selectedLang} Solution</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(codeExamples[selectedLang])}
                        className="text-xs text-base-content/40 hover:text-indigo-600 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="p-3 font-mono text-xs overflow-x-auto">
                      <code className="text-base-content/80 whitespace-pre">{codeExamples[selectedLang]}</code>
                    </pre>
                  </div>
        
                  {/* Example */}
                  <div className="bg-base-200 rounded-lg p-3 font-mono text-xs">
                    <div className="font-semibold mb-1 text-base-content/60">Example:</div>
                    <pre className="text-base-content/80">
        {`Input: nums = [2,7,11,15], target = 9
        Output: [0,1]
        Explanation: nums[0] + nums[1] = 2 + 7 = 9`}
                    </pre>
                  </div>
        
                  {/* Tags */}
                  <div className="flex gap-2 pt-2">
                    <span className="badge badge-outline rounded-lg">Array</span>
                    <span className="badge badge-outline rounded-lg">Hash Table</span>
                  </div>
                </div>
              </div>
        
              {/* Right side – description (unchanged) */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Practice Problems</span>
                </div>
                <h2 className="text-3xl font-bold text-base-content">Solve Real Coding Challenges</h2>
                <p className="text-base-content/60">
                  Choose from 2,500+ curated problems across multiple difficulty levels. Write and test your code directly in the browser with our Judge0‑powered code runner.
                </p>
                <ul className="space-y-2 text-base-content/70">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 3 language options: C++, Java, JavaScript</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Instant execution & test cases</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Company-tagged problems (Amazon, Google, Meta)</li>
                </ul>
                <Link to="/signup" className="inline-flex items-center gap-2 text-blue-600 font-medium mt-4">
                  Start solving now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* 2. Dashboard Analytics */}
        <section ref={analyticsRef} className="py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 text-sm">
                  <Activity className="w-4 h-4" />
                  <span>Detailed Analytics</span>
                </div>
                <h2 className="text-3xl font-bold text-base-content">Track Your Progress with Beautiful Dashboards</h2>
                <p className="text-base-content/60">Visualize your strengths, weaknesses, and improvement over time. See contest rankings, problem-solving velocity, and more.</p>
                <ul className="space-y-2 text-base-content/70">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Skill heatmaps</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Weekly & monthly reports</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Compare with peers</li>
                </ul>
                <Link to="/signup" className="inline-flex items-center gap-2 text-green-600 font-medium mt-4">View demo dashboard <ArrowRight className="w-4 h-4" /></Link>
              </div>
              <div className="order-1 md:order-2 bg-base-100 border border-base-200 rounded-xl p-4 shadow-sm">
                <div className="h-48 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg flex items-center justify-center">
                  <LineChart className="w-16 h-16 text-green-400" />
                  <span className="ml-2 text-base-content/40">Analytics chart mockup</span>
                </div>
                <p className="text-center text-sm text-base-content/50 mt-2">Interactive graphs & insights</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Judge0 API Integration */}
        <section ref={judgeRef} className="py-20 bg-base-100/30 border-y border-base-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-base-100 border border-base-200 rounded-xl p-4 shadow-sm">
                <div className="h-48 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg flex items-center justify-center">
                  <Terminal className="w-16 h-16 text-yellow-500" />
                  <span className="ml-2 text-base-content/40">Code editor + run output</span>
                </div>
                <p className="text-center text-sm text-base-content/50 mt-2">Run code in 40+ languages</p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>Judge0 Powered</span>
                </div>
                <h2 className="text-3xl font-bold text-base-content">Instant Code Execution with Judge0 </h2>
                <p className="text-base-content/60">Test your solutions directly in the browser. Supports C++, Java, JavaScript, and 35+ other languages with real-time output and performance metrics.</p>
                <ul className="space-y-2 text-base-content/70">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Secure sandboxed execution</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Custom test cases</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Memory & time tracking</li>
                </ul>
                <Link to="/signup" className="inline-flex items-center gap-2 text-yellow-600 font-medium mt-4">Try code runner <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </section>


        {/* 4. Video Solutions */}
        <section ref={videoRef} className="py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 text-sm">
                  <Video className="w-4 h-4" />
                  <span>Expert-Led Videos</span>
                </div>
                <h2 className="text-3xl font-bold text-base-content">Video Solutions for Every Problem</h2>
                <p className="text-base-content/60">Stuck on a problem? Watch step-by-step video explanations from experienced engineers. Learn multiple approaches, complexity analysis, and edge cases.</p>
                <ul className="space-y-2 text-base-content/70">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 200+ curated videos</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Updated with new problems weekly</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Downloadable code snippets</li>
                </ul>
                <Link to="/signup" className="inline-flex items-center gap-2 text-indigo-600 font-medium mt-4">Try a free video <ArrowRight className="w-4 h-4" /></Link>
              </div>
              <div className="order-1 md:order-2 bg-base-100 border border-base-200 rounded-xl p-4 shadow-sm">
                <div className="aspect-video bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                  <Video className="w-16 h-16 text-indigo-400" />
                  <span className="ml-2 text-base-content/40">Video player mockup</span>
                </div>
                <p className="text-center text-sm text-base-content/50 mt-2">Watch video solutions inline</p>
              </div>
            </div>
          </div>
        </section>


        {/* 5. AI Chatbot Assistant */}
        <section ref={aiRef} className="py-20 bg-base-100/30 border-y border-base-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-base-100 border border-base-200 rounded-xl p-4 shadow-sm">
                <div className="aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex flex-col items-center justify-center">
                  <Bot className="w-16 h-16 text-purple-400 mb-2" />
                  <div className="bg-base-200 rounded-lg p-3 max-w-xs text-sm">👤 User: "Can you give me a hint for Two Sum?"</div>
                  <div className="bg-indigo-100 dark:bg-indigo-950/30 rounded-lg p-3 max-w-xs text-sm mt-2">🤖 AI: "Try using a hash map to store complements."</div>
                </div>
                <p className="text-center text-sm text-base-content/50 mt-2">Context-aware AI chat</p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/30 text-purple-600 text-sm">
                  <Bot className="w-4 h-4" />
                  <span>AI-Powered Assistance</span>
                </div>
                <h2 className="text-3xl font-bold text-base-content">Chat with AI for Problem-Specific Help</h2>
                <p className="text-base-content/60">Get instant hints, code explanations, and alternative solutions. Our AI is trained on thousands of coding problems and best practices.</p>
                <ul className="space-y-2 text-base-content/70">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Real-time problem reference</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Code review suggestions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 24/7 available</li>
                </ul>
                <Link to="/signup" className="inline-flex items-center gap-2 text-purple-600 font-medium mt-4">Try AI chat <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </section>


        {/* Topic Categories Section (unchanged) */}
        <section className="py-12 border-y border-base-200 bg-base-100/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-base-content">Browse by Topic</h2>
              <p className="text-base-content/60 text-sm mt-1">Master specific data structures & algorithms</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {topics.map((topic, idx) => (
                <Link key={idx} to={`/topics/${topic.name.toLowerCase()}`} className="group">
                  <div className="bg-base-100 border border-base-200 rounded-xl p-4 text-center hover:border-indigo-300 transition-all hover:shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-base-200 mx-auto flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/30 transition-colors mb-2">
                      <topic.icon className="w-5 h-5 text-base-content/70 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-base-content/80 group-hover:text-indigo-600 transition-colors">
                      {topic.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner (unchanged) */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 md:p-12 text-center shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to become interview ready?
              </h2>
              <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
                Join CodeLab today and start solving real-world coding challenges with video solutions, AI assistance, and enterprise security.
              </p>
              <Link to="/signup" className="btn bg-white text-indigo-700 hover:bg-indigo-50 border-0 rounded-xl px-8 h-11 font-medium">
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (unchanged) */}
      <footer className="border-t border-base-200 bg-base-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-base-content">CodeLab</span>
              </div>
              <p className="text-sm text-base-content/60">
                Video solutions + AI chatbot + Judge0 integration. Secure by design.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-base-content mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection(problemsRef)} className="text-base-content/60 hover:text-base-content transition-colors">Coding Problems</button></li>
                <li><button onClick={() => scrollToSection(videoRef)} className="text-base-content/60 hover:text-base-content transition-colors">Video Solutions</button></li>
                <li><button onClick={() => scrollToSection(aiRef)} className="text-base-content/60 hover:text-base-content transition-colors">AI Chatbot</button></li>
                <li><button onClick={() => scrollToSection(analyticsRef)} className="text-base-content/60 hover:text-base-content transition-colors">Analytics</button></li>
                <li><button onClick={() => scrollToSection(judgeRef)} className="text-base-content/60 hover:text-base-content transition-colors">Judge0 Runner</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-base-content mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-base-content/60 hover:text-base-content transition-colors">About</Link></li>
                <li><Link to="/blog" className="text-base-content/60 hover:text-base-content transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="text-base-content/60 hover:text-base-content transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-base-content mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-base-content/60 hover:text-base-content transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="text-base-content/60 hover:text-base-content transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-base-200 mt-8 pt-6 text-center text-sm text-base-content/40">
            © 2025 CodeLab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;