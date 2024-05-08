import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { title, toolbarMobile, toolbarWeb } from "../../styles";
import { TableGrid } from "../../components/TableGrid";
import { columns } from "./columns";
import { ChangeEvent, useEffect, useState } from "react";
import { api } from "../../service/api";
import { toast } from "react-toastify";
import { CreateHoliday } from "./createHoliday";
import UpdateIcon from "@mui/icons-material/Update";
import React from "react";
import { useRefresh } from "../../shared/hooks/useRefresh";
import { deleteHoliday, findManyHoliday } from "../../service/calendar";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// Definindo o tipo dos feriados
interface Holiday {
  id: string;
  date: string;
  name: string;
  diaSemana: string;
  type:string;
  pontoFacultativo: boolean;
}

export function Calendar() {
  const [rows, setRows] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [anoAtual, setAnoAtual] = useState<number>(() => {
    const storedYear = localStorage.getItem("anoAtual");
    return storedYear ? parseInt(storedYear, 10) : new Date().getFullYear();
  });
  const [windowSize, setWindowSize] = React.useState(window?.innerWidth);
  const { count } = useRefresh();

  useEffect(() => {
    listAll();
  }, [count, anoAtual]);

  const listAll = () => {
    setLoading(true);
    Promise.all([fetchBackendHolidays(), fetchApiBrasilHolidays()])
      .then(([backendResponse, apiBrasilResponse]) => {
        const backendHolidays = transformBackendData(backendResponse.data);
        const apiBrasilHolidays = transformApiBrasilData(apiBrasilResponse.data);
        const mergedHolidays = mergeData(backendHolidays, apiBrasilHolidays);
        
        // Ordenar os feriados por data
        const sortedHolidays = mergedHolidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setRows(sortedHolidays);
        setLoading(false);
  
        // Atualizar o ano dos feriados do backend
        updateBackendHolidaysYear(backendResponse.data);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };
  
  const updateBackendHolidaysYear = (backendData: any[]) => {
    const updatedBackendHolidays = backendData.map((holiday) => {
      const newDate = new Date(holiday.ano, holiday.mes - 1, holiday.dia);
      newDate.setFullYear(anoAtual); // Definir o novo ano
      return {
        ...holiday,
        date: formatDate(`${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`),
      };
    });
  
    // Atualizar os feriados do backend na lista de feriados
    setRows((prevRows) => {
      const apiBrasilHolidays = prevRows.filter((holiday) => holiday.id.startsWith("api-"));
      return [...apiBrasilHolidays, ...transformBackendData(updatedBackendHolidays)];
    });
  };
  

  const fetchBackendHolidays = () => {
    return findManyHoliday();
  };

  const fetchApiBrasilHolidays = () => {
    return api.get(`https://brasilapi.com.br/api/feriados/v1/${anoAtual}`);
  };

  const transformBackendData = (data: any[]) => {
    // Transformar os dados do backend para o formato comum
    return data.map((holiday) => ({
      id: holiday.id,
      date: formatDate(`${holiday.dia}/${holiday.mes}/${holiday.ano}`),
      name: holiday.name,
      diaSemana: getDiaSemana(
        new Date(holiday.ano, holiday.mes - 1, holiday.dia)
      ),
      type: holiday.type,
      pontoFacultativo: holiday.pontoFacultativo
    }));
  };
  
  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const formattedDay = day.padStart(2, '0'); 
    const formattedMonth = month.padStart(2, '0');
    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const transformApiBrasilData = (data: any[]) => {
    // Transformar os dados da API Brasil para o formato comum
    return data.map((holiday, index) => ({
      id: `api-${index}`,
      date: holiday.date,
      name: holiday.name,
      diaSemana: getDiaSemana(new Date(holiday.date)),
      type: holiday.type,
      pontoFacultativo: holiday.pontoFacultativo
    }));
  };

  const mergeData = (backendData: Holiday[], apiBrasilData: Holiday[]) => {
    // Juntar os dados de ambos os endpoints
    return [...backendData, ...apiBrasilData];
  };

  const getDiaSemana = (holidayDate: Date) => {
    const diasDaSemana = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    return diasDaSemana[holidayDate.getUTCDay()];
  };

  const handleAnoAtualChange = () => {
    const anoAtualNovo = anoAtual + 1;
    setAnoAtual(anoAtualNovo);
    localStorage.setItem("anoAtual", anoAtualNovo.toString());
  };
  
  const handleVoltarParaAnoAtual = () => {
    const anoAtualReal = new Date().getFullYear();
    setAnoAtual(anoAtualReal);
    localStorage.setItem("anoAtual", anoAtualReal.toString());
  };

  const DeleteHoliday = (id: string) => {
    deleteHoliday(id)
      .then((response: any) => {
        if (response.status === 200) {
          listAll();
          toast.success("Feriado excluído com sucesso");
        }
      })
      .catch((error: any) => {
        toast.error(error?.response.data.detail);
      });
  };

  const [search, setSearch] = useState({ column: "", value: "" });
  const [rowsFiltered, setRowsFiltered] = useState<any>([]);

  const handleValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const handleColumn = (event: SelectChangeEvent) => {
    setSearch((state) => ({
      ...state,
      [event.target.name]: event.target.value.trim(),
    }));
  };

  const handleSearch = () => {
    if (search.column === "" || search.value === "") {
      toast.error("Campo coluna e pesquisa não pode ser vazio");
    } else {
      const findRows = rows.filter((item: any) =>
        String(item[search.column])
          .toLowerCase()
          .includes(String(search.value).toLowerCase())
      );
      if (findRows.length === 0) {
        toast.error("Nenhum resultado encontrado para esta pesquisa.");
      }
      setRowsFiltered(findRows);
    }
  };

  const handleClear = () => {
    setSearch({ column: "", value: "" });
    setRowsFiltered([]);
  };

  return (
    <>
      <Box style={windowSize < 800 ? toolbarMobile : toolbarWeb}>
        <Typography sx={title}>Calendário</Typography>
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
              <MenuItem value={"date"}>Data</MenuItem>
              <MenuItem value={"diaSemana"}>Dia da semana</MenuItem>
              <MenuItem value={"name"}>Feriado</MenuItem>
              <MenuItem value={"type"}>Tipo</MenuItem>
              <MenuItem value={"pontoFacultativo"}>Ponto facultativo</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <TextField
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
                      onClick={() => {
                        handleSearch();
                      }}
                      aria-label="search"
                    >
                      <SearchIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleClear();
                      }}
                      aria-label="delete"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <Button
            onClick={handleAnoAtualChange}
            variant="outlined"
            startIcon={<UpdateIcon />}
          >
            Atualizar Ano
          </Button>
          <Button
            onClick={handleVoltarParaAnoAtual}
            variant="outlined"
            startIcon={<UpdateIcon />}
          >
            Voltar para o Ano Atual
          </Button>
          <CreateHoliday />
        </Box>
      </Box>
      {!loading && (
      <>
        <TableGrid
          rows={rowsFiltered.length > 0 ? rowsFiltered : rows}
          columns={columns}
          onDelete={DeleteHoliday}
          titleDelete="Excluir feriado"
          subtitleDelete="Deseja mesmo excluir essa informação?"
        />
        <Typography sx={{ fontWeight: "lighter" }}>
          Ano Atual: {anoAtual}
        </Typography>
      </>
    )}
    </>
  );
}
