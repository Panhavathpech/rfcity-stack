import React, { useRef, useState } from 'react';
import videoSource from '../assets/videos/rfvideo.mp4';

const VideoSection = () => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    const handleMuteToggle = () => {
        const video = videoRef.current;
        if (!video) return;

        const nextState = !isMuted;
        video.muted = nextState;
        setIsMuted(nextState);
    };

    return (
        <section id="VideoSection" className="relative bg-black">
            <video
                ref={videoRef}
                src={videoSource}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-[70vh] md:h-[80vh] object-cover"
            />

            <button
                type="button"
                onClick={handleMuteToggle}
                aria-pressed={!isMuted}
                aria-label={isMuted ? 'Unmute background video' : 'Mute background video'}
                className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-widest rounded-full bg-white/90 text-slate-900 shadow-xl backdrop-blur hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
                {isMuted ? 'UNMUTE' : 'MUTE'}
            </button>
        </section>
    );
};

export default VideoSection;

