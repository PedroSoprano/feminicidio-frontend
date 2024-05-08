import Typography from "@mui/material/Typography";
import { title, toolbarWeb } from "../../styles";
import CollapsibleTable from "./collapseTable";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { findSearch, findSearchLinks } from "../../service/link";
import { toast } from "react-toastify";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export function Links() {
  const [lastUpdateTime, setLastUpdateTime] = React.useState("");
  const [search, setSearch] = useState({ column: "", value: "" });
  const [filterRows, setFilterRows] = useState([]);

  const handleValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const handleColumn = (event: SelectChangeEvent<string>) => {
    setSearch((state) => ({
      ...state,
      column: event.target.value as string,
    }));
  };

  const handleSearch = async () => {
    if (search.column === "" || search.value === "") {
      toast.error("Campo coluna e pesquisa não pode ser vazio");
      return;
    }
  
    let searchValue: string | boolean = search.value;
  
  
    // Convertendo "sim" ou "não" para true ou false se a coluna for "lido" ou "assassinato"
    if (search.column === "lido" || search.column === "feminicidio") {
      searchValue = search.value.toLowerCase() === "sim" ? "true" : "false";
    }
  
    try {
      const response = await findSearchLinks({ ...search, value: searchValue });
      setFilterRows(response.data);
    } catch (error: any) {
      toast.error("Erro ao pesquisar links: ");
    }
  };
  

  const handleClear = () => {
    setSearch({ column: "", value: "" });
    setFilterRows([]);
  };

  const fetchLastUpdateTime = async () => {
    try {
      const response = await findSearch();
      setLastUpdateTime(response.data.createdAt);
    } catch (error: any) {
      toast.error(
        "Erro ao obter a última vez da pesquisa de links:",
        error.response.data.detail
      );
    }
  };

  React.useEffect(() => {
    fetchLastUpdateTime();
  }, []);

  let formattedLastUpdateTime = "";

  if (lastUpdateTime) {
    try {
      // Ajuste para remover os microssegundos
      const withoutMicroseconds = lastUpdateTime.split(".")[0];
      const parsedDate = new Date(withoutMicroseconds);
      formattedLastUpdateTime = format(parsedDate, "dd/MM/yyyy HH:mm");
    } catch (error) {
      console.error("Erro ao formatar data:", error);
    }
  }

  return (
    <>
      <Box style={toolbarWeb}>
        <Typography style={title}>Links</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControl sx={{ minWidth: 140 }} size="small">
              <InputLabel id="demo-select-small">Coluna</InputLabel>
              <Select
                name="column"
                value={search.column}
                labelId="demo-select-small"
                id="demo-select-small"
                label="coluna"
                onChange={handleColumn}
              >
                <MenuItem value={"nome"}>Nome do site</MenuItem>
                <MenuItem value={"link"}>Link</MenuItem>
                <MenuItem value={"feminicidio"}>Assassinato</MenuItem>
                <MenuItem value={"lido"}>Lido</MenuItem>
                <MenuItem value={"created_date"}>Data</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              {search.column !== 'created_date'?  (<TextField
                name="value"
                color="secondary"
                variant="outlined"
                label="Pesquisar"
                value={search.value}
                onChange={handleValue}
                onKeyDown={({ key }) => key === "Enter" && handleSearch()}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        onClick={handleSearch}
                        aria-label="search"
                      >
                        <SearchIcon />
                      </IconButton>
                      <IconButton onClick={handleClear} aria-label="delete">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />):(<TextField
                name="value"
                type="date"
                color="secondary"
                variant="outlined"
                label="Pesquisar"
                value={search.value}
                InputLabelProps={{ shrink: true }}
                onChange={handleValue}
                onKeyDown={({ key }) => key === "Enter" && handleSearch()}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        onClick={handleSearch}
                        aria-label="search"
                      >
                        <SearchIcon />
                      </IconButton>
                      <IconButton onClick={handleClear} aria-label="delete">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />)}
            </FormControl>
          </Box>
          <Typography>
            Última pesquisa realizada em: {formattedLastUpdateTime}
          </Typography>
        </Box>
      </Box>
      <CollapsibleTable search={search} filterData={filterRows} />
    </>
  );
}
