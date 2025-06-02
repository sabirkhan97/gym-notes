import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ModeToggle } from '@/context/ModeToggle';

export function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <Icons.dumbbell  />
            <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              FitTrack
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/gym-notes"
              className="transition-colors hover:text-foreground/80 text-foreground/90"
            >
              Workouts
            </Link>
            <Link
              to="/workout-summary"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Summary
            </Link>
            <Link
              to="/progress"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Progress
            </Link>
            <Link
              to="/exercises"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Exercises
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          {token ? (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex"
              >
                <Icons.logout className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="sm:hidden"
              >
                <Icons.logout className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
