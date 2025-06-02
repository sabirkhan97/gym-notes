import { useNavigate } from 'react-router-dom';
import { ExerciseSelector } from './ExerciseSelector';

interface Exercise {
  name: string;
  muscle_group: string;
}

export function Exercises() {
  const navigate = useNavigate();

  const handleSelectExercise = (exercise: Exercise) => {
    // Redirect to GymNotes with selected exercise
    navigate('/gym-notes', { state: { selectedExercise: exercise } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ExerciseSelector onSelect={handleSelectExercise} />
    </div>
  );
}

export default Exercises