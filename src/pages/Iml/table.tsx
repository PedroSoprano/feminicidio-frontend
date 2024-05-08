import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { colors } from "../../shared/theme";

export interface Row {
  id: number;
  dataEntrada: string;
  horaEntrada: string;
  sexo: string;
  idade: number;
  bairroDaRemocao: string;
  causaMorte: string;
}

interface rowProps {
  rows: Row[];
}

export const SimpleTableIml = (props: rowProps) => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "calc(100vh - 248px)" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead sx={{ position: "sticky", top: 0 }}>
            <TableRow>
              <TableCell sx={{ background: colors.primary_lightest }}>
                Data
              </TableCell>
              <TableCell sx={{ background: colors.primary_lightest }}>
                Hora
              </TableCell>
              <TableCell sx={{ background: colors.primary_lightest }}>
                Sexo
              </TableCell>
              <TableCell sx={{ background: colors.primary_lightest }}>
                Idade
              </TableCell>
              <TableCell sx={{ background: colors.primary_lightest }}>
                Bairro da remoção
              </TableCell>
              <TableCell sx={{ background: colors.primary_lightest }}>
                Causa da morte
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.dataEntrada}</TableCell>
                  <TableCell>{row.horaEntrada}</TableCell>
                  <TableCell>{row.sexo}</TableCell>
                  <TableCell>{row.idade}</TableCell>
                  <TableCell>{row.bairroDaRemocao}</TableCell>
                  <TableCell>{row.causaMorte}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={props.rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ position: "sticky", bottom: 0, background: colors.background_base }}
        />
      </TableContainer>
    </Paper>
  );
};
