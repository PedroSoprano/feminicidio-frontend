import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { findById, updateUser } from "../../service/users";
import { IUser } from "../../models/users";
import { useRefresh } from "../../shared/hooks/useRefresh";

const schema = Yup.object()
  .shape({
    nome: Yup.string().optional(),
    email: Yup.string().optional(),
    telefone: Yup.string().optional(),
    perfil: Yup.string().optional(),
    senha: Yup.string().optional(),
  })
  .required();
type FormData = Yup.InferType<typeof schema>;

export function EditUser({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [userData, setUserData] = useState<IUser | null>(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true)
  const { addCount } = useRefresh();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await handleUpadateUser(data);
  };

  const handleUpadateUser = async (data: Yup.InferType<typeof schema>) => {
    setLoading(true);
    try {
      await updateUser(id, data);
      toast.success("Informações do usuário atualizadas com sucesso");
      addCount();
      handleClose();
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response.data.detail || "Erro ao atualizar usuário");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchUserData = () => {
    findById(id)
      .then((response) => {
        if (response && response.data) {
          setUserData(response.data);
          setValue("nome", response.data.nome);
          setValue("email", response.data.email);
          setValue("perfil", response.data.perfil);
          setValue("telefone", response.data.telefone);
          setLoading(false);
        } else {
          console.error(
            "Erro ao buscar os dados do usuário: Resposta inválida"
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Erro ao buscar os dados do usuário:", error);
      });
  };

  const handleEditButtonClick = () => {
    setLoading(true);
    fetchUserData();
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <EditIcon onClick={handleEditButtonClick} />
      </IconButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {userData && (  // Verifica se os dados do usuário estão definidos
          <>
            <DialogTitle id="responsive-dialog-title" sx={{ fontWeight: 600 }}>
              {"Editar informações do usuário"}
            </DialogTitle>
            <Typography
              sx={{
                marginLeft: 3,
                marginRight: 3,
                marginBottom: 3,
              }}
            >
              {"Personalize as informações do usuário conforme desejado."}
            </Typography>
            <Divider />
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <DialogContent sx={{ display: "grid", gap: 2 }}>
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
                <FormControl variant="filled">
                  <InputLabel>Perfil</InputLabel>
                  <Select
                    label={errors.perfil?.message ?? "Perfil"}
                    {...register("perfil")}
                    error={!!errors.perfil?.message}
                    defaultValue={userData.perfil}
                  >
                    <MenuItem value={"Administrador"}>Administrador</MenuItem>
                    <MenuItem value={"Digitador"}>Digitador</MenuItem>
                    <MenuItem value={"Editor"}>Editor</MenuItem>
                    <MenuItem value={"Visualizador"}>Visualizador</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions sx={{ marginRight: "20px", marginBottom: 3 }}>
                <Button autoFocus onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" autoFocus>
                  Editar
                </Button>
              </DialogActions>
            </Box>
          </>
        )}
      </Dialog>
    </>
  );
  
}
