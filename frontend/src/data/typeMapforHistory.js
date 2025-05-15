import { workoutData } from './workoutData.js'; 

export const exerciseTypeMap = {
  push: {
    color: 'bg-red-500',
    textColor: 'text-red-700',
    borderColor: 'border-red-500',
    lightBg: 'bg-red-100',
    icon: '🏋️',  // weight lifter icon
    label: 'PUSH'
  },
  pull: {
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-500',
    lightBg: 'bg-blue-100',
    icon: '💪',  // bicep flex icon
    label: 'PULL'
  },
  legs: {
    color: 'bg-green-500',
    textColor: 'text-green-700',
    borderColor: 'border-green-500',
    lightBg: 'bg-green-100',
    icon: '🦵',  // leg icon
    label: 'LEGS'
  }
};

// Function to determine workout type based on exercise name
export function getWorkoutType(exercise, workoutData) {
  for (const type in workoutData) {
    for (const section of workoutData[type].sections) {
      if (section.exercises.includes(exercise)) {
        return type;
      }
    }
  }
  return 'unknown'; // Default if not found
}

// Function to determine workout type from workout name
export function getWorkoutTypeFromName(workoutName) {
  const lowerName = workoutName.toLowerCase();
  if (lowerName.includes('push')) return 'push';
  if (lowerName.includes('pull')) return 'pull';
  if (lowerName.includes('leg')) return 'legs';
  return 'unknown';
}