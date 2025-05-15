import { useState, useEffect } from 'react';
import { exerciseTypeMap, getWorkoutTypeFromName } from '../data/typeMapforHistory.js';

export default function WorkoutHistory({ history, onBack, formatDate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateWorkouts, setDateWorkouts] = useState([]);
  
  // Generate calendar dates for current month view
  useEffect(() => {
    const dates = generateCalendarDates(currentMonth);
    setCalendarDates(dates);
  }, [currentMonth]);
  
  // Filter workouts for selected date
  useEffect(() => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const filteredWorkouts = history.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfDay && entryDate <= endOfDay;
    });
    
    setDateWorkouts(filteredWorkouts);
  }, [selectedDate, history]);
  
  // Generate the dates for the current month view
  const generateCalendarDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDay.getDay();
    
    // Calculate total days needed (previous month days + current month days)
    const totalDays = daysFromPrevMonth + lastDay.getDate();
    
    // Calculate rows needed (7 days per row)
    const rows = Math.ceil(totalDays / 7);
    
    // Generate dates array
    const dates = [];
    
    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      dates.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        currentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push({
        date: new Date(year, month, i),
        currentMonth: true
      });
    }
    
    // Add days from next month to fill the remaining cells
    const remainingDays = rows * 7 - dates.length;
    for (let i = 1; i <= remainingDays; i++) {
      dates.push({
        date: new Date(year, month + 1, i),
        currentMonth: false
      });
    }
    
    return dates;
  };
  
  // Get the predominant workout type for a date
  const getWorkoutTypeForDate = (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get all workouts for this date
    const dateWorkouts = history.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfDay && entryDate <= endOfDay;
    });
    
    if (dateWorkouts.length === 0) {
      return null; // No workouts on this date
    }
    
    // Count occurrences of each workout type
    const typeCounts = {
      'push': 0,
      'pull': 0,
      'legs': 0
    };
    
    dateWorkouts.forEach(entry => {
      const workoutType = getWorkoutTypeFromName(entry.workout);
      if (typeCounts[workoutType] !== undefined) {
        typeCounts[workoutType]++;
      }
    });
    
    // Find the most common workout type
    let maxCount = 0;
    let predominantType = null;
    
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        predominantType = type;
      }
    }
    
    return predominantType;
  };
  
  // Check if a date has workouts
  const hasWorkoutsOnDate = (date) => {
    return getWorkoutTypeForDate(date) !== null;
  };
  
  // Format date for display
  const formatCalendarDate = (date) => {
    return date.getDate();
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };
  
  // Format month name
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };
  
  // Check if date is same as selected date
  const isSelectedDate = (date) => {
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Workout History</h2>
      
      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth}
          className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
        >
          &lt;
        </button>
        <div className="text-lg font-medium">{formatMonthYear(currentMonth)}</div>
        <button 
          onClick={nextMonth}
          className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
        >
          &gt;
        </button>
      </div>
      
      {/* Today Button */}
      <button 
        onClick={goToToday}
        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded text-sm"
      >
        Today
      </button>
      
      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDates.map((dateObj, index) => {
            const hasWorkouts = hasWorkoutsOnDate(dateObj.date);
            return (
              <div 
                key={index}
                onClick={() => setSelectedDate(dateObj.date)}
                className={`
                  h-14 p-1 border-b border-r cursor-pointer relative
                  ${!dateObj.currentMonth ? 'bg-gray-100 text-gray-400' : 'hover:bg-blue-50'}
                  ${isSelectedDate(dateObj.date) ? 'bg-blue-100' : ''}
                `}
              >
                <div className="text-right p-1">
                  {formatCalendarDate(dateObj.date)}
                </div>
                {hasWorkouts && (
                  <div 
                    className={`absolute bottom-1 right-1 w-2 h-2 rounded-full
                    ${getWorkoutTypeForDate(dateObj.date) === 'push' ? 'bg-red-500' : 
                      getWorkoutTypeForDate(dateObj.date) === 'pull' ? 'bg-blue-500' : 
                      getWorkoutTypeForDate(dateObj.date) === 'legs' ? 'bg-green-500' : 'bg-gray-500'}`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Selected Date Info */}
      <div className="mt-4">
        <h3 className="font-medium">
          {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
      </div>
      
      {/* Workouts for Selected Date */}
      <div className="space-y-4">
        {dateWorkouts.length > 0 ? (
          dateWorkouts.map((entry, idx) => {
            // Determine workout type and get styling
            const workoutType = getWorkoutTypeFromName(entry.workout);
            const typeInfo = exerciseTypeMap[workoutType] || {
              lightBg: 'bg-gray-100',
              borderColor: 'border-gray-300',
              textColor: 'text-gray-700',
              icon: '🏋️‍♀️',
              label: entry.workout.split(' ')[0]
            };
            
            return (
              <div
                key={entry._id || idx}
                className={`${typeInfo.lightBg} p-4 rounded-lg shadow-md border-l-4 ${typeInfo.borderColor}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{entry.exercise}</h3>
                    <p className="text-sm text-gray-600">{formatDate(entry.date)}</p>
                    <p>{entry.weight} lbs{entry.reps ? ` × ${entry.reps} reps` : ''}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg mb-1">
                      {typeInfo.icon}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full ${typeInfo.color} text-white font-semibold`}>
                      {typeInfo.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-4">No workouts on this date.</p>
        )}
      </div>
      
      <button
        onClick={onBack}
        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
      >
        Back to Home
      </button>
    </div>
  );
}