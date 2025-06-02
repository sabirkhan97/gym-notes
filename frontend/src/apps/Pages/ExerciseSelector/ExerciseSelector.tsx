import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from '@google/generative-ai';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface Exercise {
  name: string;
  muscle_group: string;
  category: string;
}

interface AIExercise {
  name: string;
  sets: number;
  reps: number;
  equipment: string;
  difficulty: string;
  instructions: string;
  rest: number;
}

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
}

export function ExerciseSelector({ onSelect }: ExerciseSelectorProps) {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [aiWorkout, setAIWorkout] = useState<AIExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastRequestTime, setLastRequestTime] = useState(0);

  // Initialize Gemini AI
  const apiKey = "AIzaSyAMflG8Nr-fiuYoI4V4gbYHKNHEth_HUgA";
  useEffect(() => {
    if (!apiKey) {
      console.error('VITE_GEMINI_API_KEY is not set in .env');
      setError('API configuration error. Please contact support.');
    }
  }, [apiKey]);
  
  const genAI = new GoogleGenerativeAI(apiKey || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Hardcoded options
  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Push', 'Pull', 'Upper Body', 'Lower Body', 'Full Body'];
  const genders = ['Male', 'Female', 'Other'];
  const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'];

  // Throttle API calls (30s interval)
  const MIN_REQUEST_INTERVAL = 30000;

  // Handle form submission
  const handleGenerateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !height || !weight || !gender || !fitnessLevel || !muscleGroup) {
      setError('Please fill in all fields.');
      return;
    }
    if (parseInt(age) < 10 || parseInt(age) > 100 || parseFloat(height) < 100 || parseFloat(height) > 250 || parseFloat(weight) < 20 || parseFloat(weight) > 300) {
      setError('Please enter valid values (Age: 10-100, Height: 100-250cm, Weight: 20-300kg).');
      return;
    }

    const currentTime = Date.now();
    if (currentTime - lastRequestTime < MIN_REQUEST_INTERVAL) {
      setError(`Please wait ${Math.round((MIN_REQUEST_INTERVAL - (currentTime - lastRequestTime)) / 1000)} seconds before generating workout.`);
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    const prompt = `
    You are a fitness AI. Generate a JSON array of 3 personalized workout exercises based on the user's profile:
    
    - Age: ${age}
    - Gender: ${gender}
    - Height: ${height} cm
    - Weight: ${weight} kg
    - Fitness Level: ${fitnessLevel}
    - Target Muscle Group: ${muscleGroup}
    
    Each object in the array should include:
    - name: string (specific exercise name)
    - sets: number (2–4)
    - reps: number (a single integer between 10–15, no ranges)
    - equipment: string (e.g., Bodyweight, Barbell, Dumbbell)
    - difficulty: string ("Beginner", "Intermediate", or "Advanced")
    - instructions: string (20–30 words, clear and actionable)
    - rest: number (seconds, between 30–90)
    
    Only return raw JSON. Do not include explanations, markdown, or comments. Example of one object:
    
    [
      {
        "name": "Push-Up",
        "sets": 3,
        "reps": 15,
        "equipment": "Bodyweight",
        "difficulty": "Beginner",
        "instructions": "Start in plank position, lower your chest to the floor, then push back up. Keep your body straight.",
        "rest": 30
      }
    ]
    `;
    

    try {
      console.log('Sending API request:', { promptLength: prompt.length });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      console.log('Raw response:', text);

      // Clean response
      text = text.replace(/^```json\n|\n```$/g, '').replace(/,\s*\n*\s*]$/, ']').replace(/,\s*}/g, '}');

      // Preprocess to fix reps (e.g., "10-12" -> 12)
      text = text.replace(/"reps":\s*"(\d+)-(\d+)"/g, (match, min1, max) => {
        return `"reps": ${parseInt(max)}`;
      });
      // Convert rest to number if string
      text = text.replace(/"rest":\s*"(\d+)"/g, (_match, num) => `"rest": ${parseInt(num)}`);

      console.log('Cleaned text:', text);

      let exercises: AIExercise[];
      try {
        exercises = JSON.parse(text);
      } catch (parseErr) {
        console.error('JSON Parse Error:', parseErr, 'Cleaned Text:', text);
        // Fallback response
        exercises = [
          {
            name: 'Push-Up',
            sets: 3,
            reps: 15,
            equipment: 'Bodyweight',
            difficulty: 'Beginner',
            instructions: 'Start in plank, lower chest to floor, push up. Keep body straight.',
            rest: 30
          }
        ];
        setError('Invalid response format. Using fallback workout.');
      }

      if (!Array.isArray(exercises) || exercises.length === 0) {
        throw new Error('No exercises returned.');
      }

      setAIWorkout(exercises);
      setSuccess('Workout generated successfully!');
      setLastRequestTime(Date.now());
    } catch (err: any) {
      let errorMessage = 'Failed to generate workout. Try again later.';
      if (err.message?.includes('429')) {
        errorMessage = 'API quota exceeded. Wait 30 seconds or upgrade to a paid plan.';
      } else if (err.message.includes('API key')) {
        errorMessage = 'Invalid API key. Check configuration.';
      } else if (err.message.includes('network')) {
        errorMessage = 'Network error. Check your connection.';
      }
      console.error('Error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSuccess('');
    setError('');
    setHeight('');
    setWeight('');
    setGender('');
    setFitnessLevel('');
    setMuscleGroup('');
    setAIWorkout([]);
    setError('');
    setSuccess('');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">AI Workout Generator</CardTitle>
        <CardDescription>
          Enter your details to receive a personalized workout plan tailored to your goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleGenerateWorkout} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age (10-100)</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="height">Height (cm, 100-250)</Label>
              <Input
                id="height"
                type="number"
                placeholder="e.g., 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg, 20-300)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="fitnessLevel">Fitness Level</Label>
              <Select value={fitnessLevel} onValueChange={setFitnessLevel} required>
                <SelectTrigger id="fitnessLevel">
                  <SelectValue placeholder="Select fitness level" />
                </SelectTrigger>
                <SelectContent>
                  {fitnessLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="muscleGroup">Target Muscle Group</Label>
              <Select value={muscleGroup} onValueChange={setMuscleGroup} required>
                <SelectTrigger id="muscleGroup">
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent>
                  {muscleGroups.map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Workout'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
              Reset
            </Button>
          </div>
        </form>

        {aiWorkout.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Icons.checkCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Your Personalized Workout</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiWorkout.map((exercise, index) => (
                <ExerciseCard
                  key={index}
                  exercise={exercise}
                  onClick={() => onSelect({
                    name: exercise.name,
                    muscle_group: muscleGroup,
                    category: 'AI Workout'
                  })}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ExerciseCard({ exercise, onClick }: { exercise: AIExercise, onClick: () => void }) {
  return (
    <div
      className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer bg-card"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Icons.dumbbell  />
          <h4 className="font-medium">{exercise.name}</h4>
        </div>
        <Badge variant="outline" className="ml-2">
          {exercise.difficulty}
        </Badge>
      </div>
      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
        <p><span className="font-medium">Equipment:</span> {exercise.equipment}</p>
        <p><span className="font-medium">Sets x Reps:</span> {exercise.sets} x {exercise.reps}</p>
        <p><span className="font-medium">Rest:</span> {exercise.rest} seconds</p>
      </div>
      <div className="mt-2 text-sm">
        <p className="font-medium">Instructions:</p>
        <p className="text-muted-foreground line-clamp-3">{exercise.instructions}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full"
      >
        Select Exercise
        <Icons.chevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}