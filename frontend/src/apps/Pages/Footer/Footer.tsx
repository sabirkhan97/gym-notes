import { Link } from 'react-router-dom'
import { Icons } from "@/components/icons"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Icons.dumbbell
              //  className="h-6 w-6 text-primary"
                />
              <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                FitTrack
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your personal fitness companion. Track workouts, monitor progress, and achieve your goals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icons.twitter
                //  className="h-5 w-5"
                  />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icons.instagram 
                // className="h-5 w-5"
                 />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icons.facebook
                //  className="h-5 w-5"
                  />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/gym-notes"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Workouts
                </Link>
              </li>
              <li>
                <Link
                  to="/progress"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Progress
                </Link>
              </li>
              <li>
                <Link
                  to="/exercises"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Exercises
                </Link>
              </li>
              <li>
                <Link
                  to="/nutrition"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Nutrition
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Icons.mail 
                // className="h-4 w-4 text-muted-foreground" 
                />
                <a
                  href="mailto:hello@fittrack.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  hello@fittrack.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Icons.phone
                //  className="h-4 w-4 text-muted-foreground" 
                 />
                <a
                  href="tel:+1234567890"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Icons.mapPin 
                // className="h-4 w-4 text-muted-foreground"
                 />
                <span className="text-sm text-muted-foreground">
                  123 Fitness St, Health City
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} FitTrack. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}