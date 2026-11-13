import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { type Quote } from "../models/quote";
import AppDataGrid from "./shared/AppDataGrid";
import { quoteColumns } from "./utility/QuoteGridColDef";

export default function QuotesGrid() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/quotes`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => setQuotes(data.quotes))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <p className="mt-8 text-red-700">Quotes could not be loaded.</p>;

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xl font-semibold">Recent quotes</h2>
      <AppDataGrid
        rows={quotes}
        columns={quoteColumns}
        getRowId={(q) => q.reference}
        loading={loading}
        pageSize={5}
        pageSizeOptions={[5]}
        initialSort={[{ field: "created_on", sort: "desc" }]}
      />
    </section>
  );
}
