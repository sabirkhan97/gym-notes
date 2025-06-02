import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Workout {
  id: number;
  exercise_name: string;
  sets: number;
  reps: number;
  weight?: number;
  exercise_date: string;
  workout_type?: string;
  muscle_group?: string;
  set_type?: string;
  additional_exercises?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function WorkoutSummary() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const { data: workouts = [], isLoading, error } = useQuery<Workout[], Error>({
    queryKey: ['workouts'],
    queryFn: async () => {
      if (!token) throw new Error('No authentication token found');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/exercises`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Process data for charts and recent workouts
  const processWorkoutData = () => {
    // Weekly data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, 'yyyy-MM-dd');
    });

    const weeklyData = last7Days.map(date => {
      const dayWorkouts = workouts.filter(w => format(new Date(w.exercise_date), 'yyyy-MM-dd') === date);
      const totalVolume = dayWorkouts.reduce((sum, w) => sum + (w.sets * w.reps * (w.weight || 1)), 0);

      return {
        date: format(new Date(date), 'EEE'),
        volume: totalVolume,
        workouts: dayWorkouts.length
      };
    });

    // Workout type distribution
    const typeCount = workouts.reduce((acc: Record<string, number>, w) => {
      const type = w.workout_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const typeData = Object.entries(typeCount).map(([name, value]) => ({
      name,
      value
    }));

    // Muscle group distribution
    const muscleCount = workouts.reduce((acc: Record<string, number>, w) => {
      if (!w.muscle_group) return acc;
      acc[w.muscle_group] = (acc[w.muscle_group] || 0) + 1;
      return acc;
    }, {});

    const muscleData = Object.entries(muscleCount).map(([name, value]) => ({
      name,
      value
    }));

    // Recent workouts (grouped by date)
    const groupedByDate = workouts.reduce((acc: Record<string, Workout[]>, workout) => {
      const date = format(new Date(workout.exercise_date), 'yyyy-MM-dd');
      if (!acc[date]) acc[date] = [];
      acc[date].push(workout);
      return acc;
    }, {});

    const recentWorkouts = Object.entries(groupedByDate)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .slice(0, 5);

    return { weeklyData, typeData, muscleData, recentWorkouts };
  };

  const { weeklyData, typeData, muscleData, recentWorkouts } = processWorkoutData();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
          <Icons.warning className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold">Failed to load workout data</h2>
          <p className="text-muted-foreground max-w-md text-center">{error.message}</p>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/gym-notes')}>
              <Icons.arrowLeft className="mr-2 h-4 w-4" />
              Back to Workouts
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <Icons.refresh className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Workout Dashboard</h1>
          <p className="text-muted-foreground">
            Track your fitness progress and workout history
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/gym-notes')}>
          <Icons.plus className="mr-2 h-4 w-4" />
          Add Workout
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Workouts"
              value={workouts.length}
              icon={<Icons.dumbbell />}
              description="All time exercises"
            />
            <StatCard
              title="Total Volume"
              value={workouts.reduce((sum, w) => sum + (w.sets * w.reps * (w.weight || 1)), 0).toLocaleString() + " kg"}
              icon={<Icons.weight className="h-4 w-4" />}
              description="Total weight lifted"
            />
            <StatCard
              title="Avg. Intensity"
              value={Math.round(workouts.reduce((sum, w) => sum + (w.sets * w.reps), 0) / workouts.length) || 0}
              icon={<Icons.activity className="h-4 w-4" />}
              description="Avg. reps per workout"
            />
            <StatCard
              title="Favorite Type"
              value={typeData[0]?.name || 'N/A'}
              icon={<Icons.star className="h-4 w-4" />}
              description="Most frequent workout"
            />
          </div>

          {/* Charts Section */}
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Weekly Workout Volume">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="volume" name="Volume (kg)" fill="#8884d8" />
                    <Bar dataKey="workouts" name="Exercises" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Workout Type Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </TabsContent>
            <TabsContent value="progress">
              <ChartCard title="Strength Progress Over Time">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="volume" name="Volume (kg)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </TabsContent>
            <TabsContent value="distribution">
              <ChartCard title="Muscle Group Focus">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    layout="vertical"
                    data={muscleData.sort((a, b) => b.value - a.value).slice(0, 8)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Exercises" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </TabsContent>
          </Tabs>

          {/* Recent Workouts Accordion */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Workout Sessions</CardTitle>
              <CardDescription>Your most recent workout days</CardDescription>
            </CardHeader>
            <CardContent>
              {recentWorkouts.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {recentWorkouts.map(([date, exercises]) => {
                    const workoutDate = new Date(date);
                    const dayName = format(workoutDate, 'EEEE');
                    const formattedDate = format(workoutDate, 'MMMM d, yyyy');
                    const totalExercises = exercises.length;
                    const totalVolume = exercises.reduce(
                      (sum, ex) => sum + (ex.sets * ex.reps * (ex.weight || 1)),
                      0
                    ).toLocaleString();

                    return (
                      <AccordionItem key={date} value={date}>
                        <AccordionTrigger className="hover:no-underline px-4 py-3">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex flex-col items-center bg-secondary rounded-lg p-2 min-w-[60px]">
                                <span className="text-sm font-medium">
                                  {format(workoutDate, 'EEE')}
                                </span>
                                <span className="text-lg font-bold">
                                  {format(workoutDate, 'd')}
                                </span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold">{formattedDate}</h3>
                                <p className="text-sm text-muted-foreground flex gap-1.5">
                                  <span>

                                  {exercises[0]?.workout_type || 'Mixed workout'}
                                  </span>
                                  <span className='font-semibold'>

                                    {exercises[0]?.muscle_group}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="text-right">
                                <p className="text-sm font-medium">{totalExercises} exercises</p>
                                <p className="text-xs text-muted-foreground">
                                  {totalVolume} kg total
                                </p>
                              </div>
                              <Icons.chevronDown />
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Exercise</TableHead>
                                  <TableHead>Sets</TableHead>
                                  <TableHead>Reps</TableHead>
                                  <TableHead>Weight</TableHead>
                                  <TableHead>Volume</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {exercises.map((exercise) => (
                                  <TableRow key={exercise.id}>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center">
                                        {exercise.exercise_name}
                                        {exercise.set_type && (
                                          <Badge variant="secondary" className="ml-2">
                                            {exercise.set_type}
                                          </Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>{exercise.sets}</TableCell>
                                    <TableCell>{exercise.reps}</TableCell>
                                    <TableCell>
                                      {exercise.weight ? `${exercise.weight} kg` : 'Bodyweight'}
                                    </TableCell>
                                    <TableCell>
                                      {(exercise.sets * exercise.reps * (exercise.weight || 1)).toLocaleString()} kg
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/gym-notes?date=${date}`)}
                            >
                              <Icons.plus className="mr-2 h-4 w-4" />
                              Add to this workout
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Icons.dumbbell />
                  <p className="text-muted-foreground text-center">
                    No workouts recorded yet. Start your fitness journey today!
                  </p>
                  <Button className="mt-4" onClick={() => navigate('/gym-notes')}>
                    Add Your First Workout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Exercises Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Exercises</CardTitle>
              <CardDescription>Complete history of your workouts</CardDescription>
            </CardHeader>
            <CardContent>
              {workouts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Exercise</TableHead>
                        <TableHead>Sets × Reps</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Muscle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workouts
                        .sort((a, b) => new Date(b.exercise_date).getTime() - new Date(a.exercise_date).getTime())
                        .map((exercise) => (
                          <TableRow key={exercise.id}>
                            <TableCell>
                              {format(new Date(exercise.exercise_date), 'MMM d')}
                            </TableCell>
                            <TableCell className="font-medium">
                              {exercise.exercise_name}
                            </TableCell>
                            <TableCell>
                              {exercise.sets} × {exercise.reps}
                            </TableCell>
                            <TableCell>
                              {(exercise.sets * exercise.reps * (exercise.weight || 1)).toLocaleString()} kg
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {exercise.workout_type || 'Mixed'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {exercise.muscle_group || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No exercises recorded yet. Add your first workout in Gym Notes!
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// Helper components
function StatCard({ title, value, icon, description }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children }: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {children}
      </CardContent>
    </Card>
  );
}