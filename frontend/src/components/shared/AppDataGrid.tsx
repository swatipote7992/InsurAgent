import { DataGrid, type GridColDef, type GridSortModel, type GridValidRowModel } from "@mui/x-data-grid";

interface AppDataGridProps<Row extends GridValidRowModel> {
  rows: readonly Row[];
  columns: GridColDef<Row>[];
  /** Unique id of a row, e.g. a reference number. */
  getRowId: (row: Row) => string | number;
  loading?: boolean;
  pageSize?: number;
  /** Page sizes the user can pick from. */
  pageSizeOptions?: number[];
  /** Order applied when the grid first shows, e.g. newest first. */
  initialSort?: GridSortModel;
}

/** App-wide data grid: the MUI DataGrid with this project's defaults. */
export default function AppDataGrid<Row extends GridValidRowModel>({
  rows,
  columns,
  getRowId,
  loading = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25],
  initialSort = [],
}: AppDataGridProps<Row>) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      loading={loading}
      disableRowSelectionOnClick
      autoHeight
      pageSizeOptions={pageSizeOptions}
      initialState={{
        pagination: { paginationModel: { pageSize } },
        sorting: { sortModel: initialSort },
      }}
    />
  );
}
