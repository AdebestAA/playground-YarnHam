import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl sm:text-9xl font-black text-navy-900 mb-4 leading-none">404</div>
        <h1 className="text-2xl font-bold text-navy-900 mb-2 tracking-tight">
          Page not found
        </h1>
        <p className="text-navy-500 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
