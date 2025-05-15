import { exerciseTypeMap, getWorkoutTypeFromName } from '../data/typeMapforHistory.js';

export default function WorkoutHistory({ history, onBack, onFilterChange, filter, formatDate }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Workout History</h2>
      
      <input 
        type="text" 
        value={filter} 
        onChange={onFilterChange} 
        className="w-full p-2 border rounded mb-4" 
        placeholder="Filter by exercise..." 
      />
      
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((entry, idx) => {
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
                    <span className={`text-lg mb-1`}>
                      {typeInfo.icon}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full ${typeInfo.color} text-white font-semibold`}>
                      {typeInfo.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No workout history found.</p>
      )}
      
      <button 
        onClick={onBack} 
        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
      >
        Back to Home
      </button>
    </div>
  );
}