import { Link } from "react-router";

export default function NotFound() {
  return (
    <>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-4 text-gray-600">There is no area at this address.</p>
      <Link to="/" className="mt-4 inline-block text-brand-active underline">
        Go to Home
      </Link>
    </>
  );
}
