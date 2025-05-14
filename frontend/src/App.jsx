import { useState, useEffect, useMemo } from 'react';
import { workoutData } from './data/workoutData.js';
import './index.css'; // Or the path to your CSS file


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function WorkoutTracker() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [exerciseFilter, setExerciseFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');

  const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0]; // e.g., "2025-05-14"
  };

  useEffect(() => {
    fetchWorkoutHistory();
  }, []);

const todayExercises = useMemo(() => {
  const today = getTodayDateString();
  return workoutHistory
    .filter(entry => entry.date.startsWith(today))
    .map(entry => entry.exercise);
}, [workoutHistory]);


  useEffect(() => {
    if (exerciseFilter) {
      setFilteredHistory(workoutHistory.filter(entry => 
        entry.exercise.toLowerCase().includes(exerciseFilter.toLowerCase())
      ));
    } else {
      setFilteredHistory(workoutHistory);
    }
  }, [exerciseFilter, workoutHistory]);

  const fetchWorkoutHistory = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(`${API_URL}/workouts`);
    if (!response.ok) throw new Error('Failed to fetch workout history');

    const data = await response.json();

    if (Array.isArray(data) && data.length === 0) {
      setError('Connected to API, but no workout history found.');
    }

    setWorkoutHistory(data);
    setFilteredHistory(data);
  } catch (err) {
    console.error('API fetch error:', err);
    setError('Failed to contact the API. Using local data if available.');

    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      try {
        const data = JSON.parse(savedHistory);
        setWorkoutHistory(data);
        setFilteredHistory(data);
      } catch (parseError) {
        console.error("LocalStorage parse error:", parseError);
      }
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleWorkoutSelect = (workoutType) => {
    setSelectedWorkout(workoutType);
    setSelectedExercise(null);
    setActiveTab('workout');
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setWeight('');
    setReps('');
  };

  const handleWeightChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setWeight(value);
  };

  const handleRepsChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setReps(value);
  };

  const handleLogWorkout = async () => {
    if (!selectedExercise || !weight) {
      alert('Please select an exercise and enter weight');
      return;
    }

    const newEntry = {
      date: new Date().toISOString(),
      workout: workoutData[selectedWorkout].title,
      exercise: selectedExercise,
      weight: parseFloat(weight),
      reps: reps ? parseInt(reps) : null
    };

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) throw new Error('Failed to save workout');
      const savedWorkout = await response.json();
      setWorkoutHistory([savedWorkout, ...workoutHistory]);
      localStorage.setItem('workoutHistory', JSON.stringify([savedWorkout, ...workoutHistory]));
      setWeight('');
      setReps('');
      setNotification('Workout logged successfully!');
      setTimeout(() => setNotification(''), 3000);

    } catch (err) {
      console.error('Log error:', err);
      setError('Failed to save workout to server. Saving locally instead.');
      const updatedHistory = [newEntry, ...workoutHistory];
      setWorkoutHistory(updatedHistory);
      localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
      setWeight('');
      setReps('');
      setNotification('Workout saved locally (offline mode).');
      setTimeout(() => setNotification(''), 3000);

    } finally {
      setIsLoading(false);
    }
  };


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Workout Tracker</h1>
        {error && (
          <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
      </header>

      {notification && (
  <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50 animate-fade-in-out">
    {notification}
  </div>
)}

      <main className="flex-grow p-4">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p className="text-gray-800">Loading...</p>
            </div>
          </div>
        )}

        {activeTab !== 'home' && (
    <div className="mb-4">
      <button
        onClick={() => {
          setActiveTab('home');
          setShowHistory(false);
        }}
        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded font-semibold"
      >
        ← Back to Home
      </button>
    </div>
  )}

        {activeTab === 'home' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-6">Select Workout Type</h2>

            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => handleWorkoutSelect('push')} className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg shadow-md text-lg font-semibold">
                Push Day
              </button>
              <button onClick={() => handleWorkoutSelect('pull')} className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg shadow-md text-lg font-semibold">
                Pull Day
              </button>
              <button onClick={() => handleWorkoutSelect('legs')} className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg shadow-md text-lg font-semibold">
                Leg Day
              </button>
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  setActiveTab('history');
                  setShowHistory(true);
                }}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white p-4 rounded-lg shadow-md text-lg font-semibold"
              >
                View Workout History
              </button>
            </div>
          </div>
        )}

        {activeTab === 'workout' && selectedWorkout && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{workoutData[selectedWorkout].title}</h2>

            {workoutData[selectedWorkout].sections.map((section, sectionIdx) => (
  <div key={sectionIdx} className="mb-6">
    <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
    <div className="grid grid-cols-2 gap-2">
      {section.exercises.map((exercise, exIdx) => {
        // Check if the exercise was completed today
        const isCompletedToday = todayExercises.includes(exercise);

        return (
          <div key={exIdx} className="col-span-2 sm:col-span-1">
            <button
              onClick={() => handleExerciseSelect(exercise)}
              className={`w-full p-2 rounded border text-left 
                ${selectedExercise === exercise
                  ? 'bg-blue-200 border-blue-600' 
                  : isCompletedToday
                  ? 'bg-gray-300 border-gray-400 text-gray-700 hover:bg-gray-400' 
                  : 'bg-white border-gray-300 hover:bg-blue-100'
                }`}
            >
              {exercise}
            </button>

            {selectedExercise === exercise && (
              <div className="mt-2 bg-white p-3 rounded shadow space-y-2">
                <input
                  type="text"
                  value={weight}
                  onChange={handleWeightChange}
                  placeholder="Weight (lbs)"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  value={reps}
                  onChange={handleRepsChange}
                  placeholder="Reps (optional)"
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleLogWorkout}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-semibold"
                >
                  Log Workout
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
))}


            {selectedExercise && (
              <div className="mt-6 p-4 bg-white rounded-lg shadow-md space-y-4">
                <h3 className="text-lg font-semibold">Log: {selectedExercise}</h3>
                <input
                  type="text"
                  value={weight}
                  onChange={handleWeightChange}
                  placeholder="Weight (lbs)"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  value={reps}
                  onChange={handleRepsChange}
                  placeholder="Reps (optional)"
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleLogWorkout}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-semibold"
                >
                  Log Workout
                </button>
              </div>
            )}


          </div>
        )}

        {activeTab === 'history' && showHistory && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Workout History</h2>

    <input
      type="text"
      placeholder="Filter by exercise..."
      value={exerciseFilter}
      onChange={(e) => setExerciseFilter(e.target.value)}
      className="w-full mb-4 p-2 border border-gray-300 rounded"
    />

    {filteredHistory.length === 0 && !error && (
      <p className="text-gray-600 text-center mb-4">No workouts to display.</p>
    )}

    <ul className="space-y-2">
      {filteredHistory.map((entry, index) => (
        <li key={index} className="bg-white p-3 rounded shadow">
          <p><strong>{entry.exercise}</strong> - {entry.weight} lbs{entry.reps ? ` x ${entry.reps} reps` : ''}</p>
          <p className="text-sm text-gray-600">{formatDate(entry.date)}</p>
        </li>
      ))}
    </ul>


  </div>
)}
      </main>
    </div>
  );
}
