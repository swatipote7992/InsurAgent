import type { GridColDef } from "@mui/x-data-grid";
import { QUOTE_STATUS_CLASSES, type Quote, type QuoteStatus } from "../../models/quote";

export const quoteColumns: GridColDef<Quote>[] = [
  { field: "reference", headerName: "Reference", width: 150 },
  {
    field: "created_on",
    headerName: "Created",
    type: "date",
    width: 120,
    valueGetter: (_value, row) => new Date(row.created_on),
    valueFormatter: (value: Date) => value.toLocaleDateString("en-GB"),
  },
  {
    field: "policyholder",
    headerName: "Policyholder",
    flex: 1,
    minWidth: 150,
    valueGetter: (_value, row) => row.policyholder.full_name,
  },
  {
    field: "car",
    headerName: "Car",
    flex: 1,
    minWidth: 140,
    valueGetter: (_value, row) => `${row.vehicle.make} ${row.vehicle.model}`,
  },
  {
    field: "cover",
    headerName: "Cover",
    flex: 1,
    minWidth: 160,
    valueGetter: (_value, row) => row.cover.cover_level.replaceAll("_", " "),
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: ({ value }) => (
      <span className={`status-badge ${QUOTE_STATUS_CLASSES[value as QuoteStatus] ?? ""}`}>{value}</span>
    ),
  },
  {
    field: "estimatedPremium",
    headerName: "EstimatedPremium",
    type: "number",
    width: 170,
    valueGetter: (_value, row) => row.premium?.estimated_total_gbp ?? null,
    valueFormatter: (value: number | null) => (value == null ? "-" : `£${value.toFixed(2)}`),
  },
];