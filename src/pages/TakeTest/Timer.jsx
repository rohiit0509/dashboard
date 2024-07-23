import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Timer = ({ initialTime, onTimeUp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('remainingTime');
    return savedTime ? parseInt(savedTime, 10) : initialTime;
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      localStorage.removeItem('remainingTime'); // Clear saved time when time is up
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        localStorage.setItem('remainingTime', newTime); // Save the remaining time
        return newTime;
      });
    }, 1000);

    // Save the remaining time to localStorage on refresh
    const handleBeforeUnload = (event) => {
      localStorage.setItem('remainingTime', timeLeft);
      // For older browsers, the following line might be needed
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    // Cleanup on route change
    return () => {
      localStorage.removeItem('remainingTime');
    };
  }, [location.pathname]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}s`;
  };

  return (
    <div className="timer">
      <span className="text-[14px] flex gap-[4px] px-[18px] py-[11px] border-[1px] border-[#A4A4A4] rounded-md">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4.375 2.5H16.0417M4.375 17.5H16.0417M14.5833 2.5V4.70602C14.5833 5.28118 14.385 5.83875 14.0218 6.28473L11.6259 9.22664C11.2018 9.74739 11.2119 10.4829 11.6501 10.9926L13.9791 13.7019C14.369 14.1554 14.5833 14.7336 14.5833 15.3316V17.5M5.83333 2.5V4.70602C5.83333 5.28118 6.03165 5.83875 6.39486 6.28473L8.79076 9.22664C9.21486 9.74739 9.20478 10.4829 8.76657 10.9926L6.43754 13.7019C6.0477 14.1554 5.83333 14.7336 5.83333 15.3316V17.5" stroke="#E0557D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default Timer;
