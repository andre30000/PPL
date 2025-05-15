import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/workout-tracker")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Workout schema and model
const workoutSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  workout: { type: String, required: true },
  exercise: { type: String, required: true },
  weight: { type: Number, required: true },
  reps: { type: Number }
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);

// API Routes
// Create routes directly on app instead of using a router
// This avoids potential issues with path-to-regexp

// Get all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error('Error fetching workouts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new workout
app.post('/api/workouts', async (req, res) => {
  try {
    const { date, workout, exercise, weight, reps } = req.body;
    
    const newWorkout = new Workout({
      date,
      workout,
      exercise,
      weight,
      reps
    });
    
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (err) {
    console.error('Error saving workout:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete workout
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (err) {
    console.error('Error deleting workout:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));