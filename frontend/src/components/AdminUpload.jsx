import { useParams, useNavigate } from 'react-router';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { 
  ArrowLeft, 
  Upload, 
  XCircle, 
  AlertTriangle, 
  CheckCircle, 
  FileVideo,
  Clock,
  Calendar,
  AlertCircle,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useSelector } from 'react-redux';

function AdminUpload() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [videoAlreadyExists, setVideoAlreadyExists] = useState(false);
  const [problemInfo, setProblemInfo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  // Redirect if not admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Check if video already exists and get problem info
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCheckingStatus(true);
        
        // Get problem info
        const problemRes = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblemInfo(problemRes.data.problem || problemRes.data);
        
        // Check existing video
        const videoRes = await axiosClient.get(`/video/check/${problemId}`);
        if (videoRes.data.hasVideo) {
          setVideoAlreadyExists(true);
        }
      } catch (err) {
        console.error('Error checking video status:', err);
      } finally {
        setCheckingStatus(false);
      }
    };
    
    fetchData();
  }, [problemId]);

  // Upload video to Cloudinary
  const onSubmit = async (data) => {
    const file = data.videoFile[0];

    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } =
        signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Upload directly to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      setVideoAlreadyExists(true);
      reset();
      alert('Video uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Upload failed. Please try again.';
      
      if (err.response?.status === 409) {
        setVideoAlreadyExists(true);
      }
      
      setError('root', {
        type: 'manual',
        message: message,
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (user?.role !== 'admin') {
    return null;
  }

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Checking video status...</p>
        </div>
      </div>
    );
  }

  // If video already exists, show a message
  if (videoAlreadyExists && !uploadedVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/admin/video')}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Video Already Exists</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Cannot upload new video</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-500/20 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-amber-200 dark:border-amber-500/20 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-500/5 dark:to-yellow-500/5">
              <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Video Solution Already Uploaded
              </h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 dark:from-amber-500/10 dark:to-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    A video solution has already been uploaded for this problem. 
                    Please delete the existing video from the video management panel before uploading a new one.
                  </p>
                  
                  {problemInfo && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                      <p className="font-medium text-slate-900 dark:text-white mb-2">Problem: {problemInfo.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Difficulty: <span className="font-medium capitalize">{problemInfo.difficulty}</span>
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => navigate('/admin/video')}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300"
                    >
                      Back to Video Management
                    </button>
                    <button
                      onClick={() => navigate('/admin')}
                      className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                    >
                      Back to Admin Panel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Video Solution</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {problemInfo ? `Problem: ${problemInfo.title}` : 'Upload video for problem'}
            </p>
          </div>
        </div>

        {/* Problem Info Card */}
        {problemInfo && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{problemInfo.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    problemInfo.difficulty === 'easy' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' :
                    problemInfo.difficulty === 'medium' ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' :
                    'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'
                  }`}>
                    {problemInfo.difficulty.charAt(0).toUpperCase() + problemInfo.difficulty.slice(1)}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 text-sm">
                    {problemInfo.tags}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Video File
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Choose Video File
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                  <FileVideo className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <input
                    type="file"
                    accept="video/*"
                    {...register('videoFile', {
                      required: 'Please select a video file',
                      validate: {
                        isVideo: (files) => {
                          if (!files || !files[0]) return 'Please select a video file';
                          const file = files[0];
                          return (
                            file.type.startsWith('video/') ||
                            'Please select a valid video file'
                          );
                        },
                        fileSize: (files) => {
                          if (!files || !files[0]) return true;
                          const file = files[0];
                          const maxSize = 100 * 1024 * 1024; // 100MB
                          return (
                            file.size <= maxSize || 'File size must be less than 100MB'
                          );
                        },
                      },
                    })}
                    className="hidden"
                    id="videoUpload"
                    disabled={uploading}
                  />
                  <label htmlFor="videoUpload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-700 dark:text-slate-300 mb-2">Click to select video file</span>
                      <span className="text-sm text-slate-500 dark:text-slate-500 mb-4">MP4, MOV, AVI, etc. (Max 100MB)</span>
                      <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium">
                        Browse Files
                      </span>
                    </div>
                  </label>
                </div>
                {errors.videoFile && (
                  <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.videoFile.message}
                  </p>
                )}
              </div>

              {/* Selected File Info */}
              {selectedFile && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/5 dark:to-teal-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <FileVideo className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    <div className="flex-1">
                      <h3 className="font-medium text-emerald-800 dark:text-emerald-400">Selected File</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-medium">Name:</span> {selectedFile.name}
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-medium">Type:</span> {selectedFile.type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Uploading...</span>
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.root && (
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-500/5 dark:to-pink-500/5 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-rose-700 dark:text-rose-400">Upload Error</h3>
                      <p className="text-sm text-rose-700/80 dark:text-rose-400/80 mt-1">{errors.root.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadedVideo && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/5 dark:to-teal-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-emerald-700 dark:text-emerald-400">Upload Successful!</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm text-emerald-700/80 dark:text-emerald-400/80">
                            Duration: {formatDuration(uploadedVideo.duration)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm text-emerald-700/80 dark:text-emerald-400/80">
                            {new Date(uploadedVideo.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => navigate('/admin/video')}
                  disabled={uploading}
                  className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Video
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/5 dark:to-purple-500/5 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-indigo-800 dark:text-indigo-400">Upload Guidelines</h3>
              <ul className="mt-2 text-sm text-indigo-700/80 dark:text-indigo-400/80 space-y-1">
                <li>• Supported formats: MP4, MOV, AVI, WMV, FLV, WebM</li>
                <li>• Maximum file size: 100MB</li>
                <li>• Recommended video length: 5-15 minutes</li>
                <li>• Ensure good audio and video quality</li>
                <li>• Videos will be processed and available in problem editorial sections</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;