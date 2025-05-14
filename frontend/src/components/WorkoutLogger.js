export default function WorkoutLogger({ exercise, weight, reps, onWeightChange, onRepsChange, onLog, onBack, isLoading }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Log {exercise}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Weight (lbs/kg):</label>
          <input type="text" value={weight} onChange={onWeightChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Reps (optional):</label>
          <input type="text" value={reps} onChange={onRepsChange} className="w-full p-2 border rounded" />
        </div>
        <div className="flex space-x-2 mt-4">
          <button onClick={onLog} disabled={isLoading} className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow ${isLoading ? 'opacity-50' : ''}`}>
            {isLoading ? 'Saving...' : 'Log Workout'}
          </button>
          <button onClick={onBack} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded shadow">Back</button>
        </div>
      </div>
    </div>
  );
}
