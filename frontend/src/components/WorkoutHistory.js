export default function WorkoutHistory({ history, onBack, onFilterChange, filter, formatDate }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Workout History</h2>
      <input type="text" value={filter} onChange={onFilterChange} className="w-full p-2 border rounded mb-4" placeholder="Filter by exercise..." />
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((entry, idx) => (
            <div key={entry._id || idx} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{entry.exercise}</h3>
                  <p className="text-sm text-gray-600">{formatDate(entry.date)}</p>
                  <p>{entry.weight} lbs{entry.reps ? ` × ${entry.reps} reps` : ''}</p>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{entry.workout.split(' ')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500 text-center py-8">No workout history found.</p>}
      <button onClick={onBack} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">Back to Home</button>
    </div>
  );
}
