import { Link } from "react-router";
import QuotesGrid from "../components/QuotesGrid";

export default function Home() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold">InsurAgent</h1>
      <p className="mt-4 text-lg text-gray-700">
        InsurAgent is a demonstration of AI-assisted car insurance. An agent helps gather and
        check an application, while a human underwriter reviews anything high risk and
        deterministic code sets every price.
      </p>
      <p className="mt-2 text-gray-600">This is a demonstration. No real customer data is used.</p>
      <Link
        to="/quote"
        className="mt-8 inline-block rounded bg-brand-active px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
      >
        Get a quote
      </Link>

      <QuotesGrid />
    </div>
  );
}
