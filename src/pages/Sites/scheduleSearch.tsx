import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { createProgramSearch, findManyProgramSearch } from "../../service/site";
import { toast } from "react-toastify";
import { load } from "../../styles";

const schema = Yup.object()
  .shape({
    dias: Yup.number()
      .typeError("Dias é obrigatório!")
      .positive("Deve ser um número positivo"),
  })
  .required();
type FormData = Yup.InferType<typeof schema>;

export function CreateProgram() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [periodoPesquisa, setPeriodoPesquisa] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    handleCreateProgramSearch(data);
  };

  const handleCreateProgramSearch = async (
    data: Yup.InferType<typeof schema>
  ) => {
    try {
      setLoading(true);
      await createProgramSearch(data).then((res) => {
        findManyProgramSearch().then((res) => {
          setPeriodoPesquisa(res.data[0].dias);
        });
      });
      setLoading(false);
      toast.success("Cadastrado com sucesso");
      reset();
      handleClose();
    } catch (error: any) {
      toast.error(error?.response.data.detail);
    }
  };

  React.useEffect(() => {
    findManyProgramSearch().then((res) => {
      setPeriodoPesquisa(res.data[0]?.dias ?? 1);
    });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<AccessTimeFilledIcon />}
        onClick={handleClickOpen}
      >
        Programar
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" sx={{ fontWeight: 600 }}>
          {"Programar pesquisas"}
        </DialogTitle>
        <Typography
          sx={{
            marginLeft: 3,
            marginRight: 3,
            marginBottom: 3,
          }}
        >
          {
            "Defina o intervalo de dias em que o robô irá realizar as pesquisas."
          }
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", paddingLeft: 3 }}>
          <Typography>
            Atualmente o bot está fazendo uma pesquisa a cada{" "}
            <strong>{periodoPesquisa ?? "2"} dias</strong>
          </Typography>
        </Box>
        <Divider sx={{ marginBottom: 2 }} />
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: "grid", gap: 2 }}>
            <TextField
              type="number"
              fullWidth
              label={errors.dias?.message ?? "Dias"}
              {...register("dias")}
              error={!!errors.dias?.message}
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 0 }}
            />
          </DialogContent>
          {loading ? (
            <>
              <Box sx={load}>
                <CircularProgress />
              </Box>
            </>
          ) : (
            <DialogActions sx={{ marginBottom: 3, marginRight: "20px" }}>
              <Button autoFocus onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                autoFocus
              >
                Salvar
              </Button>
            </DialogActions>
          )}
        </Box>
      </Dialog>
    </>
  );
}
