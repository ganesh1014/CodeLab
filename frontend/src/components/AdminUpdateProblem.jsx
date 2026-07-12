import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Code, 
  Terminal, 
  FileText, 
  Tag,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useSelector } from "react-redux";

const AdminUpdateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: [],
    visibleTestCases: [],
    hiddenTestCases: [],
    startCode: [],
    referenceSolution: []
  });

  // Redirect if not admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!id) return;

    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/problem/problemById/${id}`);
        const data = res.data.problem || res.data;
        
        console.log("Raw data from API:", data);
        
        // Ensure tags is always an array
        let processedTags = [];
        if (Array.isArray(data.tags)) {
          processedTags = data.tags;
        } else if (typeof data.tags === 'string') {
          processedTags = data.tags.split(',').map(t => t.trim());
        }

        // Ensure all arrays are properly initialized
        setForm({
          title: data.title || "",
          description: data.description || "",
          difficulty: data.difficulty || "easy",
          tags: processedTags,
          visibleTestCases: data.visibleTestCases || [],
          hiddenTestCases: data.hiddenTestCases || [],
          startCode: data.startCode || [],
          referenceSolution: data.referenceSolution || []
        });
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load problem");
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(",").map(tag => tag.trim()).filter(tag => tag);
    setForm(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  // Handle visible test cases
  const handleVisibleTestCaseChange = (index, field, value) => {
    const newTestCases = [...form.visibleTestCases];
    newTestCases[index][field] = value;
    setForm(prev => ({ ...prev, visibleTestCases: newTestCases }));
  };

  const addVisibleTestCase = () => {
    setForm(prev => ({
      ...prev,
      visibleTestCases: [...prev.visibleTestCases, { input: "", output: "", explanation: "" }]
    }));
  };

  const removeVisibleTestCase = (index) => {
    setForm(prev => ({
      ...prev,
      visibleTestCases: prev.visibleTestCases.filter((_, i) => i !== index)
    }));
  };

  // Handle hidden test cases
  const handleHiddenTestCaseChange = (index, field, value) => {
    const newTestCases = [...form.hiddenTestCases];
    newTestCases[index][field] = value;
    setForm(prev => ({ ...prev, hiddenTestCases: newTestCases }));
  };

  const addHiddenTestCase = () => {
    setForm(prev => ({
      ...prev,
      hiddenTestCases: [...prev.hiddenTestCases, { input: "", output: "" }]
    }));
  };

  const removeHiddenTestCase = (index) => {
    setForm(prev => ({
      ...prev,
      hiddenTestCases: prev.hiddenTestCases.filter((_, i) => i !== index)
    }));
  };

  // Handle starter code
  const handleStartCodeChange = (index, field, value) => {
    const newStartCode = [...form.startCode];
    newStartCode[index][field] = value;
    setForm(prev => ({ ...prev, startCode: newStartCode }));
  };

  const addStartCode = () => {
    setForm(prev => ({
      ...prev,
      startCode: [...prev.startCode, { language: "Javascript", initialCode: "" }]
    }));
  };

  const removeStartCode = (index) => {
    setForm(prev => ({
      ...prev,
      startCode: prev.startCode.filter((_, i) => i !== index)
    }));
  };

  // Handle reference solution
  const handleReferenceSolutionChange = (index, field, value) => {
    const newRefSolution = [...form.referenceSolution];
    newRefSolution[index][field] = value;
    setForm(prev => ({ ...prev, referenceSolution: newRefSolution }));
  };

  const addReferenceSolution = () => {
    setForm(prev => ({
      ...prev,
      referenceSolution: [...prev.referenceSolution, { language: "Javascript", completeCode: "" }]
    }));
  };

  const removeReferenceSolution = (index) => {
    setForm(prev => ({
      ...prev,
      referenceSolution: prev.referenceSolution.filter((_, i) => i !== index)
    }));
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!form.title || !form.description) {
        alert("Title and description are required");
        setSaving(false);
        return;
      }

      if (form.visibleTestCases.length === 0) {
        alert("At least one visible test case is required");
        setSaving(false);
        return;
      }

      if (form.referenceSolution.length === 0) {
        alert("At least one reference solution is required");
        setSaving(false);
        return;
      }

      await axiosClient.put(`/problem/update/${id}`, form);
      alert("Problem updated successfully!");
      navigate("/admin/update");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading problem data...</p>
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
            onClick={() => navigate(-1)}              //  onClick={() => navigate('/admin/update')}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Update Problem</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Edit problem details and test cases</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Title
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Problem title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 h-40"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Detailed problem description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                  >
                    <option value="easy" className="text-emerald-600 dark:text-emerald-400">Easy</option>
                    <option value="medium" className="text-amber-600 dark:text-amber-400">Medium</option>
                    <option value="hard" className="text-rose-600 dark:text-rose-400">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    value={Array.isArray(form.tags) ? form.tags.join(", ") : ""}
                    onChange={handleTagsChange}
                    placeholder="e.g., array, linked-list, dynamic-programming"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Array.isArray(form.tags) && form.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 text-indigo-700 dark:text-indigo-400 rounded border border-indigo-200 dark:border-indigo-500/20">
                        <Tag className="w-3 h-3 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visible Test Cases */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Visible Test Cases
                </h2>
                <button
                  type="button"
                  onClick={addVisibleTestCase}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-sm font-medium transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Test Case
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {form.visibleTestCases.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No visible test cases added yet</p>
                  <p className="text-sm mt-1">Add at least one test case that users can see</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {form.visibleTestCases.map((tc, i) => (
                    <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 bg-slate-50 dark:bg-slate-900/30">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Test Case {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeVisibleTestCase(i)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Input</label>
                        <textarea
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          rows={2}
                          value={tc.input}
                          onChange={(e) => handleVisibleTestCaseChange(i, "input", e.target.value)}
                          placeholder="Test case input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Expected Output</label>
                        <textarea
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          rows={2}
                          value={tc.output}
                          onChange={(e) => handleVisibleTestCaseChange(i, "output", e.target.value)}
                          placeholder="Expected output"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Explanation</label>
                        <textarea
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          rows={2}
                          value={tc.explanation || ""}
                          onChange={(e) => handleVisibleTestCaseChange(i, "explanation", e.target.value)}
                          placeholder="Explanation of the test case"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Hidden Test Cases
                </h2>
                <button
                  type="button"
                  onClick={addHiddenTestCase}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Hidden Case
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {form.hiddenTestCases.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No hidden test cases added yet</p>
                  <p className="text-sm mt-1">Add test cases that will be used for evaluation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {form.hiddenTestCases.map((tc, i) => (
                    <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 bg-slate-50 dark:bg-slate-900/30">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hidden Test Case {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeHiddenTestCase(i)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Input</label>
                        <textarea
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          rows={2}
                          value={tc.input}
                          onChange={(e) => handleHiddenTestCaseChange(i, "input", e.target.value)}
                          placeholder="Hidden test case input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Expected Output</label>
                        <textarea
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          rows={2}
                          value={tc.output}
                          onChange={(e) => handleHiddenTestCaseChange(i, "output", e.target.value)}
                          placeholder="Expected output"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Code Templates */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Code className="w-5 h-5" />
                Code Templates & Solutions
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Starter Code */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Starter Code</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Initial code templates for different languages</p>
                  </div>
                  <button
                    type="button"
                    onClick={addStartCode}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Starter Code
                  </button>
                </div>
                
                {form.startCode.length === 0 ? (
                  <div className="text-center py-4 text-slate-500 dark:text-slate-500">
                    <p>No starter code templates added yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.startCode.map((sc, i) => (
                      <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 bg-slate-50 dark:bg-slate-900/30">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Language: {sc.language}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeStartCode(i)}
                            className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Initial Code</label>
                          <textarea
                            className="w-full px-3 py-2 font-mono text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            rows={6}
                            value={sc.initialCode}
                            onChange={(e) => handleStartCodeChange(i, "initialCode", e.target.value)}
                            placeholder="Starter code template"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reference Solution */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Reference Solution</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Complete solutions for different languages</p>
                  </div>
                  <button
                    type="button"
                    onClick={addReferenceSolution}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Solution
                  </button>
                </div>
                
                {form.referenceSolution.length === 0 ? (
                  <div className="text-center py-4 text-slate-500 dark:text-slate-500">
                    <p>No reference solutions added yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.referenceSolution.map((rs, i) => (
                      <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 bg-slate-50 dark:bg-slate-900/30">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Language: {rs.language}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeReferenceSolution(i)}
                            className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Complete Solution</label>
                          <textarea
                            className="w-full px-3 py-2 font-mono text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            rows={8}
                            value={rs.completeCode}
                            onChange={(e) => handleReferenceSolutionChange(i, "completeCode", e.target.value)}
                            placeholder="Complete solution code"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Review all changes before updating the problem.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/admin/update')}
                    className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Update Problem
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateProblem;









































































// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router";
// import axiosClient from "../utils/axiosClient";

// // Only supported languages
// const SUPPORTED_LANGUAGES = ["javascript", "java", "cpp"];

// const AdminUpdateProblem = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     difficulty: "easy",
//     tags: [],
//     visibleTestCases: [],
//     hiddenTestCases: [],
//     startCode: [],
//     referenceSolution: []
//   });

//   useEffect(() => {
//     if (!id) {
//       setError("No problem ID provided");
//       setLoading(false);
//       return;
//     }

//     const fetchProblem = async () => {
//       try {
//         const res = await axiosClient.get(`/problem/problemById/${id}`);
//         const data = res.data.problem || res.data;
        
//         console.log("Raw data from API:", data);

//         // Process tags
//         let processedTags = [];
//         if (Array.isArray(data.tags)) {
//           processedTags = data.tags;
//         } else if (typeof data.tags === 'string') {
//           processedTags = data.tags.split(',').map(t => t.trim()).filter(t => t);
//         }

//         // ✅ CRITICAL: Use actual language from backend, not default "javascript"
//         const processedStartCode = (data.startCode || []).map(sc => ({
//           language: sc.language || "javascript", // Use actual language
//           code: sc.code || ""
//         }));

//         const processedReferenceSolution = (data.referenceSolution || []).map(rs => ({
//           language: rs.language || "javascript", // Use actual language
//           completeCode: rs.completeCode || ""
//         }));

//         setForm({
//           title: data.title || "",
//           description: data.description || "",
//           difficulty: data.difficulty || "easy",
//           tags: processedTags,
//           visibleTestCases: data.visibleTestCases || [],
//           hiddenTestCases: data.hiddenTestCases || [],
//           startCode: processedStartCode,
//           referenceSolution: processedReferenceSolution
//         });
        
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load problem");
//         setLoading(false);
//       }
//     };

//     fetchProblem();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleTagsChange = (e) => {
//     const tagsArray = e.target.value.split(",").map(t => t.trim()).filter(t => t);
//     setForm(prev => ({ ...prev, tags: tagsArray }));
//   };

//   // Handle visible test cases
//   const handleVisibleTestCaseChange = (index, field, value) => {
//     const newTestCases = [...form.visibleTestCases];
//     newTestCases[index][field] = value;
//     setForm(prev => ({ ...prev, visibleTestCases: newTestCases }));
//   };

//   const addVisibleTestCase = () => {
//     setForm(prev => ({
//       ...prev,
//       visibleTestCases: [...prev.visibleTestCases, { input: "", output: "" }]
//     }));
//   };

//   const removeVisibleTestCase = (index) => {
//     setForm(prev => ({
//       ...prev,
//       visibleTestCases: prev.visibleTestCases.filter((_, i) => i !== index)
//     }));
//   };

//   // Handle hidden test cases
//   const handleHiddenTestCaseChange = (index, field, value) => {
//     const newTestCases = [...form.hiddenTestCases];
//     newTestCases[index][field] = value;
//     setForm(prev => ({ ...prev, hiddenTestCases: newTestCases }));
//   };

//   const addHiddenTestCase = () => {
//     setForm(prev => ({
//       ...prev,
//       hiddenTestCases: [...prev.hiddenTestCases, { input: "", output: "" }]
//     }));
//   };

//   const removeHiddenTestCase = (index) => {
//     setForm(prev => ({
//       ...prev,
//       hiddenTestCases: prev.hiddenTestCases.filter((_, i) => i !== index)
//     }));
//   };

//   // Handle starter code
//   const handleStartCodeChange = (index, field, value) => {
//     const newStartCode = [...form.startCode];
//     newStartCode[index][field] = value;
//     setForm(prev => ({ ...prev, startCode: newStartCode }));
//   };

//   const addStartCode = () => {
//     setForm(prev => ({
//       ...prev,
//       startCode: [...prev.startCode, { language: "javascript", code: "" }]
//     }));
//   };

//   const removeStartCode = (index) => {
//     setForm(prev => ({
//       ...prev,
//       startCode: prev.startCode.filter((_, i) => i !== index)
//     }));
//   };

//   // Handle reference solution
//   const handleReferenceSolutionChange = (index, field, value) => {
//     const newRefSolution = [...form.referenceSolution];
//     newRefSolution[index][field] = value;
//     setForm(prev => ({ ...prev, referenceSolution: newRefSolution }));
//   };

//   const addReferenceSolution = () => {
//     setForm(prev => ({
//       ...prev,
//       referenceSolution: [...prev.referenceSolution, { language: "javascript", completeCode: "" }]
//     }));
//   };

//   const removeReferenceSolution = (index) => {
//     setForm(prev => ({
//       ...prev,
//       referenceSolution: prev.referenceSolution.filter((_, i) => i !== index)
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       // Validation
//       if (!form.title || !form.description) {
//         alert("Title and description are required");
//         return;
//       }

//       if (form.visibleTestCases.length === 0) {
//         alert("At least one visible test case is required");
//         return;
//       }

//       if (form.referenceSolution.length === 0) {
//         alert("At least one reference solution is required");
//         return;
//       }

//       // Prepare data - ensure tags is string if backend expects string
//       const updateData = {
//         ...form,
//         tags: Array.isArray(form.tags) ? form.tags.join(", ") : form.tags
//       };

//       console.log("Sending update:", updateData);

//       await axiosClient.put(`/problem/update/${id}`, updateData);
//       alert("Problem updated successfully");
//       navigate("/admin/update");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Update failed");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 flex items-center justify-center">
//         <span className="loading loading-spinner loading-lg"></span>
//         <span className="ml-4">Loading...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="alert alert-error">{error}</div>
//         <button className="btn btn-outline mt-4" onClick={() => navigate("/admin/update")}>
//           Back to List
//         </button>
//       </div>
//     );
//   }

//   // Language display name mapper
//   const getLanguageDisplay = (lang) => {
//     const map = { javascript: "JavaScript", java: "Java", cpp: "C++", python: "Python" };
//     return map[lang] || lang;
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">Update Problem</h2>

//       {/* Basic Info */}
//       <div className="mb-4">
//         <label className="label">Title</label>
//         <input
//           className="input input-bordered w-full"
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//         />
//       </div>

//       <div className="mb-4">
//         <label className="label">Description</label>
//         <textarea
//           className="textarea textarea-bordered w-full h-32"
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//         />
//       </div>

//       <div className="mb-4">
//         <label className="label">Difficulty</label>
//         <select
//           className="select select-bordered w-full"
//           name="difficulty"
//           value={form.difficulty}
//           onChange={handleChange}
//         >
//           <option value="easy">Easy</option>
//           <option value="medium">Medium</option>
//           <option value="hard">Hard</option>
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="label">Tags (comma-separated)</label>
//         <input
//           className="input input-bordered w-full"
//           value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
//           onChange={handleTagsChange}
//         />
//       </div>

//       {/* Visible Test Cases */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Visible Test Cases</h3>
//         {form.visibleTestCases.map((tc, i) => (
//           <div key={i} className="border p-4 mb-3 rounded">
//             <div className="mb-2">
//               <label className="label">Input</label>
//               <textarea
//                 className="textarea textarea-bordered w-full"
//                 value={tc.input}
//                 onChange={(e) => handleVisibleTestCaseChange(i, "input", e.target.value)}
//               />
//             </div>
//             <div className="mb-2">
//               <label className="label">Output</label>
//               <textarea
//                 className="textarea textarea-bordered w-full"
//                 value={tc.output}
//                 onChange={(e) => handleVisibleTestCaseChange(i, "output", e.target.value)}
//               />
//             </div>
//             <button className="btn btn-sm btn-error" onClick={() => removeVisibleTestCase(i)}>
//               Remove
//             </button>
//           </div>
//         ))}
//         <button className="btn btn-sm btn-primary" onClick={addVisibleTestCase}>
//           + Add Visible Test Case
//         </button>
//       </div>

//       {/* Hidden Test Cases */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Hidden Test Cases</h3>
//         {form.hiddenTestCases.map((tc, i) => (
//           <div key={i} className="border p-4 mb-3 rounded">
//             <div className="mb-2">
//               <label className="label">Input</label>
//               <textarea
//                 className="textarea textarea-bordered w-full"
//                 value={tc.input}
//                 onChange={(e) => handleHiddenTestCaseChange(i, "input", e.target.value)}
//               />
//             </div>
//             <div className="mb-2">
//               <label className="label">Output</label>
//               <textarea
//                 className="textarea textarea-bordered w-full"
//                 value={tc.output}
//                 onChange={(e) => handleHiddenTestCaseChange(i, "output", e.target.value)}
//               />
//             </div>
//             <button className="btn btn-sm btn-error" onClick={() => removeHiddenTestCase(i)}>
//               Remove
//             </button>
//           </div>
//         ))}
//         <button className="btn btn-sm btn-primary" onClick={addHiddenTestCase}>
//           + Add Hidden Test Case
//         </button>
//       </div>

//       {/* Starter Code */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Starter Code</h3>
//         {form.startCode.map((sc, i) => (
//           <div key={i} className="border p-4 mb-3 rounded">
//             <div className="mb-2">
//               <label className="label">Language: <strong>{getLanguageDisplay(sc.language)}</strong></label>
//               <select
//                 className="select select-bordered w-full"
//                 value={sc.language}
//                 onChange={(e) => handleStartCodeChange(i, "language", e.target.value)}
//               >
//                 {/* ✅ Only supported languages */}
//                 <option value="javascript">JavaScript</option>
//                 <option value="java">Java</option>
//                 <option value="cpp">C++</option>
//               </select>
//             </div>
//             <div className="mb-2">
//               <label className="label">Code</label>
//               <textarea
//                 className="textarea textarea-bordered w-full font-mono h-32"
//                 value={sc.code}
//                 onChange={(e) => handleStartCodeChange(i, "code", e.target.value)}
//               />
//             </div>
//             <button className="btn btn-sm btn-error" onClick={() => removeStartCode(i)}>
//               Remove
//             </button>
//           </div>
//         ))}
//         <button className="btn btn-sm btn-primary" onClick={addStartCode}>
//           + Add Starter Code
//         </button>
//       </div>

//       {/* Reference Solution */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Reference Solution</h3>
//         {form.referenceSolution.map((rs, i) => (
//           <div key={i} className="border p-4 mb-3 rounded">
//             <div className="mb-2">
//               <label className="label">Language: <strong>{getLanguageDisplay(rs.language)}</strong></label>
//               <select
//                 className="select select-bordered w-full"
//                 value={rs.language}
//                 onChange={(e) => handleReferenceSolutionChange(i, "language", e.target.value)}
//               >
//                 {/* ✅ Only supported languages */}
//                 <option value="javascript">JavaScript</option>
//                 <option value="java">Java</option>
//                 <option value="cpp">C++</option>
//               </select>
//             </div>
//             <div className="mb-2">
//               <label className="label">Complete Code</label>
//               <textarea
//                 className="textarea textarea-bordered w-full font-mono h-48"
//                 value={rs.completeCode}
//                 onChange={(e) => handleReferenceSolutionChange(i, "completeCode", e.target.value)}
//               />
//             </div>
//             <button className="btn btn-sm btn-error" onClick={() => removeReferenceSolution(i)}>
//               Remove
//             </button>
//           </div>
//         ))}
//         <button className="btn btn-sm btn-primary" onClick={addReferenceSolution}>
//           + Add Reference Solution
//         </button>
//       </div>

//       <button className="btn btn-warning w-full" onClick={handleUpdate}>
//         Update Problem
//       </button>
//     </div>
//   );
// };

// export default AdminUpdateProblem;


























