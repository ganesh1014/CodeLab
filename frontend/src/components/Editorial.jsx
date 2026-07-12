import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
   SkipBack,
  SkipForward,
  Loader,
  VideoOff // Add this icon
} from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  // Add a check for video URL at the beginning
  const hasVideo = !!secureUrl; // Check if secureUrl exists
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  
  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  
  const controlsTimeoutRef = useRef(null);

  const formatTime = (seconds = 0) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // If no video, return the "Video not available" UI
  if (!hasVideo) {
    return (
      <div className="relative group w-full max-w-4xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl select-none">
        {/* Video Not Available Placeholder */}
        <div className="w-full aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <VideoOff className="w-20 h-20 text-gray-500 mb-4" />
          <p className="text-gray-400 text-xl font-medium mb-2">Video is not available</p>
          <p className="text-gray-500 text-sm">The video for this problem hasn't been uploaded by Admin.</p>
        </div>
      </div>
    );
  }

  // Hide controls after inactivity (like YouTube)
  const hideControls = useCallback(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && !showVolumeSlider) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, showVolumeSlider]);

  const resetControls = () => {
    setShowControls(true);
    hideControls();
  };

  // Play/Pause toggle
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, []);

  // Seek with keyboard or buttons
  const seekBy = useCallback((seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), duration);
    resetControls();
  }, [duration]);

  // Progress bar click/hover handler
  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressHover = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setHoverTime(pos * duration);
  };

  // Volume handling
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    videoRef.current.volume = newVol;
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume || 1;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  // Playback speed
  const changePlaybackRate = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  // Fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // Double click to fullscreen (YouTube behavior)
  const handleVideoDoubleClick = (e) => {
    e.stopPropagation();
    toggleFullscreen();
  };

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onLoadedMetadata = () => setIsLoading(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("progress", onProgress);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT") return;
      
      switch(e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlayPause();
          break;
        case "arrowright":
        case "l":
          seekBy(10);
          break;
        case "arrowleft":
        case "j":
          seekBy(-10);
          break;
        case "f":
          toggleFullscreen();
          break;
        case "m":
          toggleMute();
          break;
        case "0":
        case "home":
          videoRef.current.currentTime = 0;
          break;
        default:
          // Number keys for seeking (1 = 10%, 2 = 20%, etc.)
          if (e.key >= "1" && e.key <= "9") {
            const percent = parseInt(e.key) * 10;
            videoRef.current.currentTime = (duration * percent) / 100;
          }
      }
      resetControls();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlayPause, seekBy, duration]);

  // Auto-hide controls
  useEffect(() => {
    hideControls();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [hideControls]);

  const progressPercent = (currentTime / duration) * 100;
  const bufferedPercent = (buffered / duration) * 100;

  return (
    <div
      ref={containerRef}
      className="relative group w-full max-w-4xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl select-none"
      onMouseMove={resetControls}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        onDoubleClick={handleVideoDoubleClick}
        className="w-full aspect-video cursor-pointer"
        playsInline
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {/* Big Play Button (when paused) */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-4 pt-12 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar Container */}
        <div 
          className="relative h-1 group/progress mb-4 cursor-pointer"
          onClick={handleProgressClick}
          onMouseMove={handleProgressHover}
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
          ref={progressRef}
        >
          {/* Background */}
          <div className="absolute w-full h-full bg-gray-600 rounded-full" />
          
          {/* Buffered */}
          <div 
            className="absolute h-full bg-gray-400 rounded-full"
            style={{ width: `${bufferedPercent}%` }}
          />
          
          {/* Progress */}
          <div 
            className="absolute h-full bg-red-600 rounded-full relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Scrubber Handle (visible on hover) */}
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-lg`} />
          </div>

          {/* Hover Time Tooltip */}
          {isHoveringProgress && (
            <div 
              className="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded transform -translate-x-1/2 pointer-events-none"
              style={{ left: `${(hoverTime / duration) * 100}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button 
              onClick={togglePlayPause}
              className="hover:scale-110 transition-transform p-1"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white ml-0.5" />
              )}
            </button>

            {/* Skip Backward */}
            <button 
              onClick={() => seekBy(-10)}
              className="flex items-center gap-1 hover:scale-110 transition-transform p-1"
              title="Rewind 10s (←)"
            >
              <span className="text-xs text-gray-300">(10s)</span>
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Skip Forward */}
            <button 
              onClick={() => seekBy(10)}
              className="flex items-center gap-1 hover:scale-110 transition-transform p-1"
              title="Forward 10s (→)"
            >
              <SkipForward className="w-5 h-5" />
              <span className="text-xs text-gray-300">(10s)</span>
            </button>

            {/* Volume Control */}
            <div 
              className="flex items-center gap-2 group/volume"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button onClick={toggleMute} className="p-1">
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              
              {/* Volume Slider (appears on hover) */}
              <div className={`w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300`}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="text-sm font-medium font-mono ml-2">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Playback Speed (Simple Dropdown) */}
            <div className="relative group/speed">
              <button className="text-sm font-semibold hover:bg-white/20 px-2 py-1 rounded transition-colors flex items-center gap-1">
                {playbackRate}x
                <Settings className="w-3 h-3" />
              </button>
              
              {/* Speed Menu */}
              <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden hidden group-hover/speed:block min-w-[100px]">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={`w-full px-4 py-2 text-sm hover:bg-white/20 text-left ${
                      playbackRate === rate ? "text-red-500 font-bold" : "text-white"
                    }`}
                  >
                    {rate === 1 ? "Normal" : `${rate}x`}
                  </button>
                ))}
              </div>
            </div>

            {/* Fullscreen */}
            <button 
              onClick={toggleFullscreen}
              className="hover:scale-110 transition-transform p-1"
              title="Fullscreen (f)"
            >
              {isFullscreen ? (
                <Minimize className="w-6 h-6" />
              ) : (
                <Maximize className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint (fades out) */}
      <div className={`absolute top-4 left-4 text-white/70 text-xs transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm">
          <p>Space: Play/Pause • ←/→: Seek • F: Fullscreen • M: Mute</p>
        </div>
      </div>
    </div>
  );
};

export default Editorial;