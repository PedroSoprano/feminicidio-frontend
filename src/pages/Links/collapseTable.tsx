import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { colors } from "../../shared/theme";
import { api } from "../../service/api";
import { Form } from "./form";
import { Content } from "./content";
import Classification from "./classification";
import { CircularProgress, Switch } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteSite } from "../../service/site";
import { toast } from "react-toastify";
import { useRefresh } from "../../shared/hooks/useRefresh";
import { formatDate } from "../../utils/date";
export interface Row {
  nome: string;
  link: string;
  conteudo: string;
  feminicidio: boolean;
  lido: boolean;
  classificacao: number;
  id: string;
  vitima: any;
  tagsEncontradas: string;
  refreshList: () => void;
  createdAt: string
}
export interface Props {
  search: { column: string; value: string };
  filterData: Row[]
}

export function Row(props: Row) {
  const [open, setOpen] = React.useState(false);
  const { addCount } = useRefresh();

  const handleChangeLido = () => {
    api.patch(`/api/updateLido/${props.id}`).then((res) => {
      props.refreshList();
    });
  };

  const handleChangeAssassinato = () => {
    api.patch(`/api/updateAssasinato/${props.id}`).then((res) => {
      props.refreshList();
    });
  };

  const DeleteSite = (siteId: string) => {
    deleteSite(siteId)
      .then((response: any) => {
        if (response.status === 200) {
          addCount();
          toast.success("Link excluído com sucesso");
        }
      })
      .catch((error: any) => {
        toast.error(error?.response.data.detail);
      });
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {props.nome}
        </TableCell>
        <TableCell align="left">
          <a href={props.link} target="_blank">
            {props.link}
          </a>
        </TableCell>
        <TableCell align="left">
          <Content idSite={props.id} props={props.conteudo} />
        </TableCell>
        <TableCell align="left">
          {props.feminicidio}
          <Switch
            onChange={handleChangeAssassinato}
            checked={props.feminicidio}
          />
        </TableCell>
        <TableCell align="left">
          <Classification
            classification={props.classificacao}
            idLink={props.id}
          />
        </TableCell>
        <TableCell align="left">
          {props.lido}
          <Switch onChange={handleChangeLido} checked={props.lido} />
        </TableCell>
        <TableCell align="left">
        {formatDate(props.createdAt)}
        </TableCell>
        <TableCell>
          <IconButton onClick={() => DeleteSite(props.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Notícia
              </Typography>
              <Table
                size="small"
                aria-label="purchases"
                sx={{ display: "flex", gap: 3 }}
              >
                <TableBody sx={{ display: "flex", gap: 5 }}>
                  <iframe
                    style={{ width: "50vw", height: "900px" }}
                    src={props.link}
                  />
                  <Box>
                    <Form idSite={props.id} />
                    <Typography variant="body2" gutterBottom component="div">
                      <strong>Tags Encontradas:</strong> {props.tagsEncontradas}
                    </Typography>
                  </Box>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable({ search, filterData }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [findSitesFetched, setFindSitesFetched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    if (search.value.length > 0) {
      setRows(filterData);
      return;
    }
    refreshList();
  }, [filterData]);

  const refreshList = () => {
    setLoading(true);
    api
      .get("/api/site")
      .then((res) => {
        setRows(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
  /*   if (!findSitesFetched) {
      api.get("/api/findSites").then((res) => {
        setLoading(false);
        setFindSitesFetched(true);
      });
    } */
    api
      .get("/api/site")
      .then((res) => {
        setRows(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [findSitesFetched]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRowsPaginated = rows.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <TableContainer component={Paper} sx={{ marginTop: "30px" }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Table aria-label="collapsible table">
          <TableHead sx={{ background: colors.primary_lightest }}>
            <TableRow>
              <TableCell />
              <TableCell>Nome do Site</TableCell>
              <TableCell align="left">Link</TableCell>
              <TableCell align="left">Conteúdo</TableCell>
              <TableCell align="left">Assassinato?</TableCell>
              <TableCell align="left">Classificação</TableCell>
              <TableCell align="left">Lido</TableCell>
              <TableCell align="left">Data da captura</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRowsPaginated.map((row: Row) => (
              <Row key={row.id} {...row} refreshList={refreshList} />
            ))}
          </TableBody>
        </Table>
      )}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={rows.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </TableContainer>
  );
}

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  itemsPerPage,
  totalItems,
  currentPage,
  paginate,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              style={{
                padding: "5px 10px",
                cursor: "pointer",
                backgroundColor: currentPage === number ? "#4CAF50" : "",
                color: currentPage === number ? "#fff" : "",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
