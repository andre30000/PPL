export default function WorkoutSelector({ onSelectWorkout, onViewHistory }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-6">Select Workout Type</h2>
      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => onSelectWorkout('push')} className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg shadow-md text-lg font-semibold">Push Day</button>
        <button onClick={() => onSelectWorkout('pull')} className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg shadow-md text-lg font-semibold">Pull Day</button>
        <button onClick={() => onSelectWorkout('legs')} className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg shadow-md text-lg font-semibold">Leg Day</button>
      </div>
      <div className="mt-8">
        <button onClick={onViewHistory} className="w-full bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg shadow-md text-lg font-semibold">View Workout History</button>
      </div>
    </div>
  );
}
