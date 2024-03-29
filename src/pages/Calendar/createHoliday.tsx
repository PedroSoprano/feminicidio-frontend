import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object().shape({
  dia: Yup.number().required("Dia é obrigatório").positive(),
  mes: Yup.number().required("Mês é obrigatório").positive(),
  ano: Yup.number().required("Ano é obrigatório").positive(),
  tipo: Yup.string().required("Tipo é obrigatório"),
  nome: Yup.string().required("Nome é obrigatório"),
});

export function CreateHoliday() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Cadastrar feriado
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" sx={{ fontWeight: 600 }}>
          {"Cadastrar feriado"}
        </DialogTitle>
        <Typography
          sx={{
            marginLeft: 3,
            marginRight: 3,
            marginBottom: 1,
          }}
        >
          {"Preencha as informações para cadastrar feriado."}
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <DialogContent
          sx={{ display: "grid", gap: 1 }}
        >
          <TextField
            label={errors.nome?.message ?? "Nome"}
            {...register("nome")}
            error={!!errors.nome?.message}
            variant="filled"
          />
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}>
            <TextField
              label={errors.dia?.message ?? "Dia"}
              {...register("dia")}
              error={!!errors.dia?.message}
              variant="filled"
              type="number"
            />
            <TextField
              label={errors.mes?.message ?? "Mês"}
              {...register("mes")}
              error={!!errors.mes?.message}
              variant="filled"
              type="number"
            />
            <TextField
              label={errors.ano?.message ?? "Ano"}
              {...register("ano")}
              error={!!errors.ano?.message}
              variant="filled"
              type="number"
            />
          </Box>
          <FormControl variant="filled">
            <InputLabel>{errors.tipo?.message ?? "Tipo"}</InputLabel>
            <Select
              label={errors.tipo?.message ?? "Tipo"}
              {...register("tipo")}
              error={!!errors.tipo?.message}
              defaultValue={""}
            >
              <MenuItem value={"0"}>Nacional</MenuItem>
              <MenuItem value={"1"}>Municipal</MenuItem>
              <MenuItem value={"2"}>Estadual</MenuItem>
              <MenuItem value={"3"}>Ponto facultativo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ marginBottom: 3, marginRight: "20px" }}>
          <Button autoFocus onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleClose} autoFocus>
            Cadastrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
