export default function ExerciseList({ workout, onSelectExercise, onBack }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{workout.title}</h2>
      {workout.sections.map((section, idx) => (
        <div key={idx} className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-medium mb-2">{section.title}</h3>
          <ul className="space-y-2">
            {section.exercises.map((exercise, i) => (
              <li key={i}>
                <button onClick={() => onSelectExercise(exercise)} className="w-full text-left p-2 hover:bg-gray-100 rounded">
                  {exercise}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={onBack} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded shadow">Back to Home</button>
    </div>
  );
}
