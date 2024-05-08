import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { findById, updateUser } from "../../service/users";
import Cookies from "universal-cookie";
import { ButtonStyled } from "../../components/AppContainer/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const schema = Yup.object()
  .shape({
    nome: Yup.string()
      .trim()
      .matches(/^[a-zA-Z\s]*$/, 'Nome deve conter apenas letras')
      .optional(),
    email: Yup.string()
      .email("E-mail deve ter um formato válido: exemplo@mail.com.br")
      .optional(),
    telefone: Yup.string()
      .matches(/^[0-9]+$/, 'Telefone deve conter apenas números')
      .optional(),
    perfil: Yup.string().optional(),
    senha: Yup.string().optional(),
  })
  .required();

type FormData = Yup.InferType<typeof schema>;

export function EditUser() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [userData, setUserData] = useState({});
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();

  const onSubmit = async (data: any) => {
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        delete data[key];
      }
    });
    await handleUpadateUser(data);
  };

  const id = cookies.get("idf");

  const handleUpadateUser = async (data: any) => {
    setLoading(true);
    try {
      const response = await updateUser(id, data);
      toast.success("Informações do usuário atualizadas com sucesso");
      reset();
      cookies.set("usernamef", response.data.nome);
      handleClose();
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response.data.details || "Erro ao atualizar usuário");
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const username = cookies.get("usernamef");
  const matches = useMediaQuery("(max-width:480px)");

  useEffect(() => {
    setLoading(true);
    fetchUserData();
  }, [id]);

  const fetchUserData = () => {
    findById(id)
      .then((response?) => {
        if (response && response.data) {
          setUserData(response.data);
          setValue("nome", response.data.nome);
          setValue("email", response.data.email);
          setValue("telefone", response.data.telefone);
          setLoading(false);
        } else {
          console.error(
            "Erro ao buscar os dados do usuário: Resposta inválida"
          );
          setLoading(false);
        }
      })
      .catch((error: any) => {
        setLoading(false);
      });
  };

  return (
    <>
      <ButtonStyled
        sx={{
          ...(matches && { display: "none" }),
        }}
        startIcon={<AccountCircleIcon color="primary" />}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClickOpen}
      >
        {username}
      </ButtonStyled>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" sx={{ fontWeight: 600 }}>
          {"Configurações da conta"}
        </DialogTitle>
        <Divider />
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "300px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <DialogContent
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                label={errors.nome?.message ?? "Nome"}
                {...register("nome")}
                error={!!errors.nome?.message}
                variant="filled"
                fullWidth
              />
              <TextField
                label={errors.email?.message ?? "E-mail"}
                {...register("email")}
                error={!!errors.email?.message}
                variant="filled"
              />
              <TextField
                label={errors.telefone?.message ?? "Telefone"}
                {...register("telefone")}
                error={!!errors.telefone?.message}
                variant="filled"
              />
              <TextField
                label={errors.senha?.message ?? "Nova senha"}
                {...register("senha")}
                error={!!errors.senha?.message}
                variant="filled"
              />
            </DialogContent>
          )}
          <DialogActions sx={{ marginRight: "20px", marginBottom: 3 }}>
            <Button autoFocus onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              autoFocus
              disabled={loading}
            >
              Editar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
