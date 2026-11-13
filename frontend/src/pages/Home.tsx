import { Link } from "react-router";
import QuotesGrid from "../components/QuotesGrid";

export default function Home() {
  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold">InsurAgent</h1>
        <p className="mt-4 text-lg text-gray-700">
          InsurAgent is a demonstration of AI-assisted car insurance. An agent helps gather and
          check an application, while a human underwriter reviews anything high risk and
          deterministic code sets every price.
        </p>
        <p className="mt-2 text-gray-600">This is a demonstration. No real customer data is used.</p>
        <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-5">
          <div>
            <h2 className="text-xl font-semibold">Ready to insure a car?</h2>
            <p className="mt-1 text-gray-700">Get an estimated price in a few minutes.</p>
          </div>
          <Link
            to="/quote"
            className="inline-block rounded bg-brand-active px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          >
            Get a quote
          </Link>
        </section>
      </div>

      <QuotesGrid />
    </div>
  );
}
