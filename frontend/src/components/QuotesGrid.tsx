import { useEffect, useState } from "react";

interface Quote {
  reference: string;
  status: "quoted" | "expired" | "referred";
  policyholder: { full_name: string };
  vehicle: { make: string; model: string };
  cover: { cover_level: string };
  premium: { annual_total_gbp: number } | null;
}

export default function QuotesGrid() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/quotes")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => setQuotes(data.quotes))
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="mt-8 text-red-700">Quotes could not be loaded.</p>;

  return (
    <table className="mt-8 w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b font-semibold">
          <th className="p-2">Reference</th>
          <th className="p-2">Policyholder</th>
          <th className="p-2">Car</th>
          <th className="p-2">Cover</th>
          <th className="p-2">Status</th>
          <th className="p-2 text-right">Annual premium</th>
        </tr>
      </thead>
      <tbody>
        {quotes.map((q) => (
          <tr key={q.reference} className="border-b">
            <td className="p-2">{q.reference}</td>
            <td className="p-2">{q.policyholder.full_name}</td>
            <td className="p-2">{q.vehicle.make} {q.vehicle.model}</td>
            <td className="p-2">{q.cover.cover_level.replaceAll("_", " ")}</td>
            <td className="p-2">{q.status}</td>
            <td className="p-2 text-right">
              {q.premium ? `£${q.premium.annual_total_gbp.toFixed(2)}` : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
