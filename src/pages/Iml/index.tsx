import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { TableGrid } from "../../components/TableGrid";
import { title, toolbar1 } from "../../styles";
import { columns } from "./columns";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useEffect, useState } from "react";
import { findImlData, findManyIml } from "../../service/iml";
import { Search } from "../../components/Search";
import { toast } from "react-toastify";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export function Iml() {
  const [rows, setRows] = useState([]);

  const column = [{
    sexo: 'Sexo',
    idade: 'Idade',
  }]


  useEffect(() => {
    findManyIml()
    findImlData()
      .then((res) => setRows(res.data))
      .catch((error) => console.error("Erro ao obter dados:", error));
  }, []);


  const [search, setSearch] = useState({ column: '', value: '' });
  const [rowsFiltered, setRowsFiltered] = useState([])



  const handleValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(state => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const handleColumn = (event: SelectChangeEvent) => {
    setSearch(state => ({
      ...state,
      [event.target.name]: event.target.value.trim(),
    }));
  };

  const handleSearch = () => {
    if (search.column === '' || search.value === '') {
      toast.error('Campo coluna e pesquisa não pode ser vazio');
    } else {
      console.log(search.column, search.value)
      //setCount(prevCount => prevCount + 1);
      const findRows = rows.filter((item) => (String(item[search.column]).toLowerCase()).includes(String(search.value).toLowerCase()))
      if (findRows.length == 0) {
        toast.error('Nenhum resultado encontrado para esta pesquisa.')
      }
      setRowsFiltered(findRows)
    }
  };

  const handleClear = () => {
    setSearch({ column: '', value: '' });
    setRowsFiltered([])
    //setCount(prevCount => prevCount + 1);
  };

  const filtered = rowsFiltered.length > 0


  return (
    <>
      <Box sx={toolbar1}>
        <Typography style={title}>Relatório IML</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: '0.3125rem' }}>
              <Box>
                <FormControl sx={{ minWidth: 140 }} size="small">
                  <InputLabel id="demo-select-small">Coluna</InputLabel>
                  <Select
                    name="column"
                    value={search.column}
                    labelId="demo-select-small"
                    id="demo-select-small"
                    label="coluna"
                    onChange={handleColumn}>
                    <MenuItem value={"dataEntrada"}>Data de entrada</MenuItem>
                    <MenuItem value={"horaEntrada"}>Hora de entrada</MenuItem>
                    <MenuItem value={"sexo"}>Sexo</MenuItem>
                    <MenuItem value={"idade"}>Idade</MenuItem>
                    <MenuItem value={"bairroDaRemocao"}>Bairro da remoção</MenuItem>
                    <MenuItem value={"causaMorte"}>Causa da morte</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormControl size="small">
                  <TextField
                    name="value"
                    color="secondary"
                    variant="outlined"
                    label="Pesquisar"
                    value={search.value}
                    onChange={handleValue}
                    onKeyDown={({ key }) => key === 'Enter' && handleSearch()}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="submit"
                            onClick={() => {
                              handleSearch();
                            }}
                            aria-label="search">
                            <SearchIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              handleClear();
                            }}
                            aria-label="delete">
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Box>
            </Box>
          </Box>
          {/* <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Importar arquivo
            <VisuallyHiddenInput type="file" />
          </Button> */}
        </Box>
      </Box>
      <TableGrid rows={filtered ? rowsFiltered : rows} columns={columns} />
    </>
  );
}
