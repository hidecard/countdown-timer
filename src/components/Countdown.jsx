import React, { useState, useEffect } from "react";

function Countdown() {
    const [timers, setTimers] = useState([]);
    const [newTimerTitle, setNewTimerTitle] = useState("");
    const [newTimerCategory, setNewTimerCategory] = useState("");
    const [newTimerDateTime, setNewTimerDateTime] = useState("");

    const categoryStyles = {
        Meeting: "bg-blue-500",
        Birthday: "bg-red-500",
        Reminder: "bg-green-500",
    };

    useEffect(() => {
        const intervalIds = {};

        const updateTimers = () => {
            setTimers((prevTimers) =>
                prevTimers.map((timer) => {
                    const targetTime = new Date(timer.targetDateTime).getTime();
                    const currentTime = new Date().getTime();
                    const timeRemaining = Math.max(
                        Math.floor((targetTime - currentTime) / 1000),
                        0
                    );

                    if (timeRemaining === 0) {
                        clearInterval(intervalIds[timer.id]);
                        return { ...timer, isRunning: false, timeRemaining: 0 };
                    }

                    return { ...timer, timeRemaining };
                })
            );
        };

        timers.forEach((timer) => {
            if (timer.isRunning && timer.timeRemaining > 0) {
                intervalIds[timer.id] = setInterval(updateTimers, 1000);
            }
        });

        return () => {
            Object.values(intervalIds).forEach((intervalId) =>
                clearInterval(intervalId)
            );
        };
    }, [timers]);

    const removeTimer = (timerId) => {
        setTimers((prevTimers) =>
            prevTimers.filter((timer) => timer.id !== timerId)
        );
    };

    const calculateTimeRemaining = (targetTime) => {
        const currentTime = new Date().getTime();
        const timeDifference = targetTime - currentTime;
        const secondsRemaining = Math.max(Math.floor(timeDifference / 1000), 0);
        return secondsRemaining;
    };

    const formatTimeRemaining = (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return {
            days,
            hours,
            minutes,
            seconds: remainingSeconds,
        };
    };

    const addTimer = () => {
        if (!newTimerTitle || !newTimerCategory || !newTimerDateTime) return;

        const targetDateTime = new Date(newTimerDateTime).getTime();

        const newTimer = {
            id: timers.length + 1,
            category: newTimerCategory,
            targetDateTime,
            timeRemaining: calculateTimeRemaining(targetDateTime),
            isRunning: true,
            title: newTimerTitle,
            showTitleInput: false,
        };

        setTimers([...timers, newTimer]);

        setNewTimerTitle("");
        setNewTimerCategory("");
        setNewTimerDateTime("");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
                        Countdown Timer
                    </h1>
                    <div className="space-y-4">
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Timer Title"
                            value={newTimerTitle}
                            onChange={(e) => setNewTimerTitle(e.target.value)}
                        />
                        <select
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={newTimerCategory}
                            onChange={(e) => setNewTimerCategory(e.target.value)}
                        >
                            <option value="">Select a Category</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Reminder">Reminder</option>
                        </select>
                        <input
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="datetime-local"
                            value={newTimerDateTime}
                            onChange={(e) => setNewTimerDateTime(e.target.value)}
                        />
                        <button
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={addTimer}
                            disabled={!newTimerTitle || !newTimerCategory || !newTimerDateTime}
                        >
                            Add Timer
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {timers.map((timer) => {
                        const timeRemaining = formatTimeRemaining(timer.timeRemaining);
                        return (
                            <div
                                key={timer.id}
                                className={`rounded-lg shadow-lg p-4 ${categoryStyles[timer.category]} text-white`}
                            >
                                <h3 className="text-lg font-semibold">{timer.title}</h3>
                                <h4 className="text-md mb-4">{timer.category}</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {timeRemaining.days > 0 && (
                                        <div className="bg-white text-gray-800 rounded-md p-2 text-center">
                                            <div className="text-xl font-bold">{timeRemaining.days}</div>
                                            <div className="text-sm">days</div>
                                        </div>
                                    )}
                                    <div className="bg-white text-gray-800 rounded-md p-2 text-center">
                                        <div className="text-xl font-bold">{timeRemaining.hours}</div>
                                        <div className="text-sm">hours</div>
                                    </div>
                                    <div className="bg-white text-gray-800 rounded-md p-2 text-center">
                                        <div className="text-xl font-bold">{timeRemaining.minutes}</div>
                                        <div className="text-sm">minutes</div>
                                    </div>
                                    <div className="bg-white text-gray-800 rounded-md p-2 text-center">
                                        <div className="text-xl font-bold">{timeRemaining.seconds}</div>
                                        <div className="text-sm">seconds</div>
                                    </div>
                                </div>
                                <button
                                    className="mt-4 w-full bg-gray-800 text-white p-2 rounded-md hover:bg-gray-900 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    onClick={() => removeTimer(timer.id)}
                                    disabled={timer.timeRemaining <= 0}
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Countdown;