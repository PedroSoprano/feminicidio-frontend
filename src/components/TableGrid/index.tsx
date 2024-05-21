import { useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { table, tableContainer } from "./styles";
import { ModalDelete } from "../ModalDelete/ModalDelete";
import { useToken } from "../../shared/hooks/auth";

interface TableGridProps {
  rows: any[];
  columns: GridColDef[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  titleDelete?: string;
  subtitleDelete?: string;
  setColaboradorId?: (id: string) => void;
  handleOpenModalEdit?: () => void;
  handleAttReq?: () => void;
}
export function TableGrid(props: TableGridProps) {
  const { perfil } = useToken();
  const actionColumn: GridColDef[] = [
    {
      field: "menu",
      headerName: " ",
      type: "string",
      align: "right",
      editable: false,
      renderCell: ({ row }) => (
        <>
          {perfil !== "Digitador" && (
            <ModalDelete
              title={props.titleDelete}
              subtitle={props.subtitleDelete}
              onDelete={() => (props.onDelete ? props.onDelete(row.id) : "")}
            ></ModalDelete>
          )}
        </>
      ),
    },
  ];

  const handleOnCellClick = (params: GridCellParams) => {
    if (params.field !== "menu" && props.onView) {
      props.onView(params.id.toString());
    }
  };

  const columns =
    props.onEdit || props.onDelete
      ? [...props.columns, ...actionColumn]
      : [...props.columns];
  const matches = useMediaQuery("(max-width:480px)");
  const telaVitimas = window.location.pathname.includes("victims");
  console.log(window.location.pathname.includes("victims"));

  return (
    <Box sx={tableContainer}>
      <DataGrid
        rows={props.rows}
        columns={columns.map((column: GridColDef) => ({
          ...column,
          ...(matches === false && telaVitimas === false
            ? {
                flex: 1,
              }
            : { width: 150 }),
          sortable: false,
          headerClassName: "super-app-theme--header",
        }))}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[25]}
        disableColumnMenu
        onCellClick={handleOnCellClick}
        sx={table}
      />
    </Box>
  );
}
