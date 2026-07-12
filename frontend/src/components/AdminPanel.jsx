import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Trash2, FileText, Code, Terminal, Save } from 'lucide-react';
import { useSelector } from 'react-redux';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Redirect if not admin
  React.useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [
        { input: '', output: '', explanation: '' }
      ],
      hiddenTestCases: [
        { input: '', output: '' }
      ],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/admin');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const languageTemplates = {
    'C++': {
      initialCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    // Your code here
};`,
      referenceCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    // Complete solution here
};`
    },
    'Java': {
      initialCode: `class Solution {
    // Your code here
}`,
      referenceCode: `class Solution {
    // Complete solution here
}`
    },
    'JavaScript': {
      initialCode: `/**
 * @param {any} input
 * @return {any}
 */
function solution(input) {
    // Your code here
}`,
      referenceCode: `/**
 * @param {any} input
 * @return {any}
 */
function solution(input) {
    // Complete solution here
}`
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Create New Problem
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Add a new coding challenge to the platform</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Basic Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Title
                </label>
                <input
                  {...register('title')}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.title 
                      ? 'border-rose-500 dark:border-rose-500 text-rose-700 dark:text-rose-300 focus:border-rose-500' 
                      : 'border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 focus:border-indigo-500'
                  }`}
                  placeholder="Enter problem title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.description 
                      ? 'border-rose-500 dark:border-rose-500 text-rose-700 dark:text-rose-300 focus:border-rose-500' 
                      : 'border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 focus:border-indigo-500'
                  }`}
                  placeholder="Provide a detailed description of the problem..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    {...register('difficulty')}
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.difficulty 
                        ? 'border-rose-500 dark:border-rose-500 text-rose-700 dark:text-rose-300 focus:border-rose-500' 
                        : 'border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 focus:border-indigo-500'
                    }`}
                  >
                    <option value="easy" className="text-emerald-600 dark:text-emerald-400">Easy</option>
                    <option value="medium" className="text-amber-600 dark:text-amber-400">Medium</option>
                    <option value="hard" className="text-rose-600 dark:text-rose-400">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tag
                  </label>
                  <select
                    {...register('tags')}
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.tags 
                        ? 'border-rose-500 dark:border-rose-500 text-rose-700 dark:text-rose-300 focus:border-rose-500' 
                        : 'border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 focus:border-indigo-500'
                    }`}
                  >
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">Dynamic Programming</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Test Cases
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Visible Test Cases */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Visible Test Cases</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">These will be shown to users as examples</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Visible Case
                  </button>
                </div>
                {/* from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 */}
                <div className="space-y-4">
                  {visibleFields.map((field, index) => (
                    <div key={field.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 bg-slate-50 dark:bg-slate-900/30">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Visible Test Case {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeVisible(index)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Input</label>
                        <textarea
                          {...register(`visibleTestCases.${index}.input`)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="Input for test case"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Expected Output</label>
                        <textarea
                          {...register(`visibleTestCases.${index}.output`)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="Expected output"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Explanation</label>
                        <textarea
                          {...register(`visibleTestCases.${index}.explanation`)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="Explanation of the test case"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Test Cases */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Hidden Test Cases</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">These will be used for evaluation but not shown to users</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendHidden({ input: '', output: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Hidden Case
                  </button>
                </div>
                {/* from-indigo-500 to-purple-600 */}
                <div className="space-y-4">
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 bg-slate-50 dark:bg-slate-900/30">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hidden Test Case {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeHidden(index)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Input</label>
                        <textarea
                          {...register(`hiddenTestCases.${index}.input`)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="Input for hidden test case"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Expected Output</label>
                        <textarea
                          {...register(`hiddenTestCases.${index}.output`)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="Expected output"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Code Templates */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Code className="w-5 h-5" />
                Code Templates
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Define starter code and reference solutions for all languages</p>
            </div>
            
            <div className="p-6 space-y-6">
              {['C++', 'Java', 'JavaScript'].map((language, index) => (
                <div key={language} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                      language === 'C++' 
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' 
                        : language === 'Java' 
                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                        : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20'
                    }`}>
                      {language}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Initial Code (Starter Template)
                      </label>
                      <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-600 text-xs font-mono text-slate-600 dark:text-slate-400">
                          {language} starter code
                        </div>
                        <textarea
                          {...register(`startCode.${index}.initialCode`)}
                          rows={8}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          placeholder={`Enter ${language} starter code...`}
                          defaultValue={languageTemplates[language]?.initialCode}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Reference Solution (Complete Code)
                      </label>
                      <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-600 text-xs font-mono text-slate-600 dark:text-slate-400">
                          {language} solution
                        </div>
                        <textarea
                          {...register(`referenceSolution.${index}.completeCode`)}
                          rows={8}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          placeholder={`Enter ${language} complete solution...`}
                          defaultValue={languageTemplates[language]?.referenceCode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Make sure all fields are filled correctly before creating the problem.
                  </p>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create Problem
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;