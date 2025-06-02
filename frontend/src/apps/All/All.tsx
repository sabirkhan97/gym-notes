import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers';
import { Header } from '../Pages/Header/Header';
import { Footer } from '../Pages/Footer/Footer';
import { Suspense, lazy } from 'react';
import { Icons } from '@/components/icons';

// Lazy load pages
const Login = lazy(() => import('@/apps/Pages/Login/Login'));
const Signup = lazy(() => import('@/apps/Pages/SignUp/Signup'));
const GymNotes = lazy(() => import('@/apps/Pages/GymNotes/GymNotes'));
const WorkoutSummary = lazy(() => import('@/apps/Pages/WorkoutSummary/WorkoutSummary'));
const Exercises = lazy(() => import('@/apps/Pages/ExerciseSelector/Exercises'))

const All = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">

      <Router>
        <Header />
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/gym-notes" element={<GymNotes />} />
            <Route path="/exercises" element={<Exercises />} />

            <Route path="/workout-summary" element={<WorkoutSummary />} />
            <Route path="/" element={<Login />} />
          </Routes>
          <Footer />
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default All;
