import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';

import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu, 
  ChevronLeft,
  FileText,
  BookOpen,
  Lightbulb,
  History,
  MessageSquare,
  Code2,
  Terminal,
  BarChart3,
  Loader2,
  ArrowLeft,
  Home,
  Settings,
  UserCircle
} from 'lucide-react';
import { Monitor, Laptop } from 'lucide-react';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const langIcons = {
  javascript: 'JS',
  java: 'Ja',
  cpp: 'C++'
};

const ProblemPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  const { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setPageLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode.find(
          sc => sc.language === langMap[selectedLanguage]
        )?.initialCode || '';

        setProblem(response.data);
        setCode(initialCode);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(
        sc => sc.language === langMap[selectedLanguage]
      )?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setActiveRightTab('testcase');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setActiveRightTab('result');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'hard': return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      default: return 'bg-base-200 text-base-content/60 border-base-300';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return <div className="w-2 h-2 rounded-full bg-emerald-500" />;
      case 'medium': return <div className="w-2 h-2 rounded-full bg-amber-500" />;
      case 'hard': return <div className="w-2 h-2 rounded-full bg-rose-500" />;
      default: return <div className="w-2 h-2 rounded-full bg-base-content/40" />;
    }
  };

  const leftTabs = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'editorial', label: 'Editorial', icon: BookOpen },
    { id: 'solutions', label: 'Solutions', icon: Lightbulb },
    { id: 'submissions', label: 'Submissions', icon: History },
    { id: 'chatAI', label: 'Chat AI', icon: MessageSquare },
  ];

  const rightTabs = [
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'testcase', label: 'Testcase', icon: Terminal },
    { id: 'result', label: 'Result', icon: BarChart3 },
  ];

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-base-content/60">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading problem...</span>
        </div>
      </div>
    );
  }

  return (
  <div>
    <div className="flex md:hidden min-h-screen bg-base-200 items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg">
          <Monitor className="w-10 h-10 text-white" />
        </div>
    
        {/* Heading */}
        <h2 className="text-3xl font-bold text-base-content mb-4">
          Desktop Required
        </h2>
    
        {/* Description */}
        <p className="text-base-content/60 text-lg mb-8">
          This coding environment is optimized for laptop and desktop screens.
          Please switch to desktop mode or use a larger device for the best
          experience.
        </p>
    
        {/* Info Card */}
        <div className="bg-base-100 border border-base-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Laptop className="w-6 h-6 text-indigo-600" />
            <span className="font-semibold text-base-content">
              Better Experience
            </span>
          </div>
    
          <p className="text-base-content/70">
            Our code editor, file explorer, and terminal are designed for larger
            screens to provide a smooth development experience.
          </p>
        </div>
      </div>
    </div>


    <div className="h-screen flex flex-col bg-gradient-to-br from-base-200 to-base-100">
      {/* DaisyUI Navbar */}
      <div className="navbar bg-base-100/80 backdrop-blur-sm border-b border-base-300 sticky top-0 z-50 px-6 h-14">
        <div className="navbar-start">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="btn btn-ghost btn-sm gap-2 hover:bg-base-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Problems</span>
            </button>
            
            <div className="divider divider-horizontal h-6 m-0"></div>
            
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-base-content">{problem?.title}</span>
              {problem && (
                <>
                  <div className={`badge badge-sm border px-3 py-1 font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    <span className="flex items-center gap-1.5">
                      {getDifficultyIcon(problem.difficulty)}
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                  </div>
                  <div className="badge badge-sm border-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 text-indigo-600 dark:text-indigo-400">
                    {problem.tags}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="navbar-end gap-2">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-ghost btn-sm btn-square"
            title="Home"
          >
            <Home className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="btn btn-ghost btn-sm btn-square"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-base-200 rounded-lg">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center">
                <span className="text-xs font-bold">{user?.firstName?.[0]?.toUpperCase()}</span>
              </div>
            </div>
            <span className="text-sm text-base-content font-medium">{user?.firstName}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col border-r border-base-300">
          {/* Left Tabs - DaisyUI Style */}
          <div className="tabs tabs-bordered bg-base-100 border-b border-base-300 px-4 gap-1">
            {leftTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeLeftTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveLeftTab(tab.id)}
                  className={`tab flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0'
                      : 'text-base-content/60 hover:text-base-content hover:bg-base-200 border-0'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto bg-base-100">
            <div className="p-6 max-w-3xl">
              {problem && (
                <>
                  {activeLeftTab === 'description' && (
                    <div className="space-y-6">
                      {/* Problem Header */}
                      <div>
                        <h1 className="text-2xl font-bold text-base-content mb-4">{problem.title}</h1>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`badge badge-sm border px-3 py-1 font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            <span className="flex items-center gap-2">
                              {getDifficultyIcon(problem.difficulty)}
                              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                            </span>
                          </div>
                          <div className="badge badge-sm border-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 text-indigo-600 dark:text-indigo-400">
                            {problem.tags}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="prose max-w-none">
                        <div className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
                          {problem.description}
                        </div>
                      </div>

                      {/* Examples */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-base-content">Examples</h3>
                        {problem.visibleTestCases.map((example, index) => (
                          <div key={index} className="card bg-base-200 border border-base-300 overflow-hidden">
                            <div className="card-body p-4">
                              <div className="px-3 py-2 bg-base-300 rounded-lg mb-3">
                                <span className="text-sm font-medium text-base-content/70">Example {index + 1}</span>
                              </div>
                              <div className="space-y-3 font-mono text-sm">
                                <div>
                                  <span className="text-base-content/60 font-sans font-medium">Input:</span>
                                  <div className="mt-1 text-base-content bg-base-100 border border-base-300 p-3 rounded-lg">
                                    {example.input}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-base-content/60 font-sans font-medium">Output:</span>
                                  <div className="mt-1 text-base-content bg-base-100 border border-base-300 p-3 rounded-lg">
                                    {example.output}
                                  </div>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <span className="text-base-content/60 font-sans font-medium">Explanation:</span>
                                    <div className="mt-1 text-base-content/70">{example.explanation}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Note */}
                      <div className="alert bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-500/5 dark:to-yellow-500/5 border border-amber-200 dark:border-amber-500/10">
                        <div className="text-sm text-amber-600 dark:text-amber-400">
                          <strong className="text-amber-700 dark:text-amber-300">Note:</strong> Read the problem carefully before submitting. 
                          Make sure to handle all edge cases.
                        </div>
                      </div>
                    </div>
                  )}

                  {activeLeftTab === 'editorial' && (
                    <div>
                      <h2 className="text-xl font-bold text-base-content mb-4">Video Editorial</h2>
                      <Editorial 
                        secureUrl={problem.secureUrl} 
                        thumbnailUrl={problem.thumbnailUrl} 
                        duration={problem.duration}
                      />
                    </div>
                  )}

                  {activeLeftTab === 'solutions' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-base-content">Reference Solutions</h2>
                      {problem.referenceSolution?.length > 0 ? (
                        problem.referenceSolution.map((solution, index) => (
                          <div key={index} className="card bg-base-200 border border-base-300 overflow-hidden">
                            <div className="card-body p-0">
                              <div className="flex items-center justify-between px-4 py-3 bg-base-300 border-b border-base-300">
                                <div className="flex items-center gap-2">
                                  <span className="badge badge-sm bg-base-100 text-base-content border border-base-300">
                                    {solution.language}
                                  </span>
                                </div>
                                <button 
                                  onClick={() => {
                                    const langKey = Object.keys(langMap).find(k => langMap[k] === solution.language);
                                    if (langKey) {
                                      setSelectedLanguage(langKey);
                                      setCode(solution.completeCode);
                                      setActiveRightTab('code');
                                    }
                                  }}
                                  className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                                >
                                  Use this solution →
                                </button>
                              </div>
                              <div className="p-4 bg-base-100">
                                <pre className="text-sm text-base-content font-mono overflow-x-auto">
                                  <code>{solution.completeCode}</code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="card bg-base-200 border border-base-300">
                          <div className="card-body p-12 text-center">
                            <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="text-base-content/60">Solutions will be available after you solve the problem.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeLeftTab === 'submissions' && (
                    <div>
                      <h2 className="text-xl font-bold text-base-content mb-4">Submission History</h2>
                      <SubmissionHistory problemId={problemId} />
                    </div>
                  )}

                  {activeLeftTab === 'chatAI' && (
                    <div>
                      <h2 className="text-xl font-bold text-base-content mb-4">AI Assistant</h2>
                      <ChatAi problem={problem} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col bg-base-100">
        {/* <div className="w-full md:w-1/2 flex flex-col bg-base-100"> */}
          {/* Right Tabs - DaisyUI Style */}
          <div className="flex items-center justify-between px-6 py-2 bg-base-100 border-b border-base-300">
            <div className="flex items-center gap-1">
              {rightTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeRightTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRightTab(tab.id)}
                    className={`btn btn-sm gap-2 border-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'btn-ghost text-base-content/60 hover:text-base-content hover:bg-base-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === 'testcase' && runResult && (
                      <span className={`w-2 h-2 rounded-full ${
                        runResult.success ? 'bg-emerald-400' : 'bg-rose-400'
                      }`} />
                    )}
                    {tab.id === 'result' && submitResult && (
                      <span className={`w-2 h-2 rounded-full ${
                        submitResult.accepted ? 'bg-emerald-400' : 'bg-rose-400'
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Language Selector */}
            <div className="join shadow-sm bg-base-200 rounded-lg">
              {['javascript', 'java', 'cpp'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`join-item btn btn-sm px-3 border-0 ${
                    selectedLanguage === lang
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'bg-transparent text-base-content/60 hover:text-base-content'
                  }`}
                >
                  {langIcons[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeRightTab === 'code' && (
              <>
                {/* Editor */}
                <div className="flex-1 relative bg-base-100">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      fontFamily: 'JetBrains Mono, Fira Code, monospace',
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                      mouseWheelZoom: true,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between px-6 py-3 bg-base-100 border-t border-base-300">
                  <button 
                    onClick={() => setActiveRightTab('testcase')}
                    className="btn btn-ghost btn-sm gap-2 hover:bg-base-200"
                  >
                    <Terminal className="w-4 h-4" />
                    Console
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRun}
                      disabled={loading}
                      className="btn btn-sm gap-2 bg-base-200 hover:bg-base-300 text-base-content border-0"
                    >
                      {loading && activeRightTab !== 'code' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      Run
                    </button>
                    <button
                      onClick={handleSubmitCode}
                      disabled={loading}
                      className="btn btn-sm gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg shadow-emerald-500/20"
                    >
                      {loading && activeRightTab !== 'code' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeRightTab === 'testcase' && (
              <div className="flex-1 overflow-y-auto p-6 bg-base-100">
                <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-base-content/60" />
                  Test Results
                </h3>
                
                {!runResult ? (
                  <div className="card bg-base-200 border border-base-300">
                    <div className="card-body p-12 text-center">
                      <Play className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="text-base-content/60">Click "Run" to execute your code</p>
                      <p className="text-sm text-base-content/40 mt-1">Test against sample test cases</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className={`card ${runResult.success ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10' : 'border-rose-200 bg-rose-50 dark:bg-rose-500/10'} border`}>
                      <div className="card-body">
                        <div className="flex items-center gap-3">
                          {runResult.success ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-rose-500" />
                          )}
                          <div>
                            <h4 className={`font-semibold ${runResult.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {runResult.success ? 'All test cases passed!' : 'Some test cases failed'}
                            </h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-base-content/60">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {runResult.runtime} sec
                              </span>
                              <span className="flex items-center gap-1">
                                <Cpu className="w-4 h-4" />
                                {runResult.memory} KB
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Test Cases */}
                    <div className="space-y-3">
                      {runResult.testCases?.map((tc, i) => (
                        <div 
                          key={i} 
                          className={`card ${tc.status_id === 3 ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-rose-200 bg-rose-50/50 dark:bg-rose-500/5'} border`}
                        >
                          <div className="card-body p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-base-content/70">Test Case {i + 1}</span>
                              <span className={`badge badge-sm gap-1.5 ${tc.status_id === 3 ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-rose-100 text-rose-600 border-rose-200'}`}>
                                {tc.status_id === 3 ? (
                                  <><CheckCircle2 className="w-3.5 h-3.5" /> Accepted</>
                                ) : (
                                  <><XCircle className="w-3.5 h-3.5" /> Failed</>
                                )}
                              </span>
                            </div>
                            <div className="space-y-2 font-mono text-xs">
                              <div className="grid grid-cols-[80px_1fr] gap-2">
                                <span className="text-base-content/60">Input:</span>
                                <span className="text-base-content bg-base-100 border border-base-300 p-2 rounded">
                                  {tc.stdin}
                                </span>
                              </div>
                              <div className="grid grid-cols-[80px_1fr] gap-2">
                                <span className="text-base-content/60">Expected:</span>
                                <span className="text-emerald-600 bg-base-100 border border-emerald-200 dark:border-emerald-500/20 p-2 rounded">
                                  {tc.expected_output}
                                </span>
                              </div>
                              <div className="grid grid-cols-[80px_1fr] gap-2">
                                <span className="text-base-content/60">Output:</span>
                                <span className={`p-2 rounded border ${
                                  tc.status_id === 3 
                                    ? 'text-emerald-600 bg-base-100 border-emerald-200' 
                                    : 'text-rose-600 bg-base-100 border-rose-200'
                                }`}>
                                  {tc.stdout || '(no output)'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeRightTab === 'result' && (
              <div className="flex-1 overflow-y-auto p-6 bg-base-100">
                <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-base-content/60" />
                  Submission Result
                </h3>

                {!submitResult ? (
                  <div className="card bg-base-200 border border-base-300">
                    <div className="card-body p-12 text-center">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="text-base-content/60">Submit your solution to see results</p>
                      <p className="text-sm text-base-content/40 mt-1">All test cases will be evaluated</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Main Result */}
                    <div className={`card ${submitResult.accepted ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10' : 'border-rose-200 bg-rose-50 dark:bg-rose-500/10'} border`}>
                      <div className="card-body">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            submitResult.accepted ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-rose-100 dark:bg-rose-500/20'
                          }`}>
                            {submitResult.accepted ? (
                              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                            )}
                          </div>
                          <div>
                            <h4 className={`text-2xl font-bold ${submitResult.accepted ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {submitResult.accepted ? 'Accepted' : submitResult.error || 'Wrong Answer'}
                            </h4>
                            <p className="text-base-content/60 mt-1">
                              {submitResult.passedTestCases} / {submitResult.totalTestCases} test cases passed
                            </p>
                          </div>
                        </div>

                        {submitResult.accepted && (
                          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-emerald-200 dark:border-emerald-500/10">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-base-content/60" />
                              </div>
                              <div>
                                <p className="text-xs text-base-content/50">Runtime</p>
                                <p className="text-lg font-semibold text-base-content">
                                  {submitResult.runtime} <span className="text-sm font-normal text-base-content/40">sec</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-base-content/60" />
                              </div>
                              <div>
                                <p className="text-xs text-base-content/50">Memory</p>
                                <p className="text-lg font-semibold text-base-content">
                                  {submitResult.memory} <span className="text-sm font-normal text-base-content/40">KB</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Next Steps */}
                    {submitResult.accepted && (
                      <div className="alert bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/5 dark:to-purple-500/5 border border-indigo-200 dark:border-indigo-500/10">
                        <div className="text-sm text-indigo-600 dark:text-indigo-400">
                          🎉 Congratulations! Try the next problem or check the discussion for alternative solutions.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

</div>
  );
};

export default ProblemPage;