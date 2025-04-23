'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  onTimerComplete?: () => void;
}

export default function StudyTimer({
  initialMinutes = 25,
  initialSeconds = 0,
  onTimerComplete
}: TimerProps) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [totalFocusTime, setTotalFocusTime] = useState(0); // In seconds

  // Effect to handle the timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval as NodeJS.Timeout);
            setIsActive(false);
            
            // Handle timer completion
            if (onTimerComplete) {
              onTimerComplete();
            }
            
            // Switch modes
            if (mode === 'focus') {
              setMode('break');
              setMinutes(5); // 5-minute break
              setSeconds(0);
            } else {
              setMode('focus');
              setMinutes(25); // 25-minute focus session
              setSeconds(0);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
        
        // Track total focus time
        if (mode === 'focus' && isActive) {
          setTotalFocusTime(prev => prev + 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode, onTimerComplete]);

  // Format time as MM:SS
  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format total time in HH:MM:SS
  const formatTotalTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Study Timer</h2>
      
      <div className="flex justify-center items-center mb-8">
        <div className={`text-6xl font-mono ${mode === 'focus' ? 'text-indigo-600' : 'text-green-600'}`}>
          {formatTime(minutes, seconds)}
        </div>
      </div>
      
      <div className="flex justify-center mb-6 space-x-2">
        <button 
          onClick={toggleTimer}
          className={`px-6 py-2 rounded-md transition ${
            isActive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isActive ? (
            <><i className="fas fa-pause mr-2" aria-hidden="true"></i>Pause</>
          ) : (
            <><i className="fas fa-play mr-2" aria-hidden="true"></i>Start</>
          )}
        </button>
        
        <button 
          onClick={resetTimer}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
        >
          <i className="fas fa-redo-alt mr-2" aria-hidden="true"></i>Reset
        </button>
      </div>
      
      <div className="flex justify-between items-center px-4 py-3 bg-gray-100 rounded-md">
        <div>
          <span className="text-sm font-medium text-gray-700">Mode:</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
            mode === 'focus' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
          }`}>
            {mode === 'focus' ? 'Focus' : 'Break'}
          </span>
        </div>
        
        <div>
          <span className="text-sm font-medium text-gray-700">Total Focus Time:</span>
          <span className="ml-2 text-sm text-indigo-700">{formatTotalTime(totalFocusTime)}</span>
        </div>
      </div>
    </div>
  );
} 