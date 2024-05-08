import React, { useState, ChangeEvent, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import { caixaTag } from "../../styles";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { api } from "../../service/api";
import { toast } from "react-toastify";
import { colors } from "../../shared/theme";

export function CreateTag() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>(-1);
  const [editMode, setEditMode] = useState(false);

  const handleRemoverTag = (tagRemovida: string) => {
    setLoading(true);
    api
      .delete("/api/tag/" + tagRemovida)
      .then((response) => {
        if (response.status === 200) {
          const novasTags = tags.filter((tag) => tag !== tagRemovida);
          setTags(novasTags);
          setLoading(false);
          toast.success(`Tag ${tagRemovida} removida com sucesso!`);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error?.response.data.detail);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
    setEditMode(false); // Resetar o modo de edição ao abrir o modal
    setInputValue(""); // Limpar o campo de entrada ao abrir o modal
    setSelectedTagIndex(-1); // Resetar o índice da tag selecionada
  };

  const handleClose = () => {
    // Verificando se há pelo menos duas tags cadastradas antes de fechar o modal
    if (tags.length >= 2) {
      setOpen(false);
    } else {
      toast.warning("É necessário ter pelo menos duas tags cadastradas.");
    }
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAdicionarTag = () => {
    if (inputValue.trim() === "") {
      toast.error("Por favor, insira um valor para a tag.");
      return; // Se o input estiver vazio, interrompe a função
    }
    setLoading(true);
    api
      .post("/api/tag/", { nome: inputValue })
      .then(() => {
        toast.success("Tag criada com sucesso");
        setTags([...tags, inputValue]);
        setInputValue("");
        setLoading(false);
      })
      .catch((error: any) => {
        setLoading(false);
        toast.error(error.message);
      });
  };
  
  const handleEditarTag = () => {
    if (inputValue.trim() === "") {
      toast.error("Por favor, insira um valor para a tag.");
      return; // Se o input estiver vazio, interrompe a função
    }
    if (selectedTagIndex !== -1) {
      const tagEditada = inputValue;
      const tagAntiga = tags[selectedTagIndex];
      setLoading(true);
      api
        .patch(`/api/tag/${tagAntiga}`, { nome: tagEditada })
        .then(() => {
          const novasTags = [...tags];
          novasTags[selectedTagIndex] = inputValue;
          setTags(novasTags);
          setInputValue("");
          setLoading(false);
          toast.success(`Tag ${tagAntiga} editada para ${tagEditada}`);
          setEditMode(false);
        })
        .catch((error: any) => {
          setLoading(false);
          toast.error(error.message);
        });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (editMode) {
        handleEditarTag();
      } else {
        handleAdicionarTag();
      }
    }
  };

  const findTags = () => {
    setLoading(true);
    api
      .get("/api/tag/")
      .then((response) => {
        const tagNames = response.data.map((tag: { nome: string }) => tag.nome);
        setTags(tagNames);
        setLoading(false);
      })
      .catch((error: any) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    findTags();
  }, [open]);

  return (
    <>
      <Button
        variant="outlined"
        endIcon={editMode ? <EditIcon /> : <AddCircleIcon />}
        onClick={handleClickOpen}
        disabled={loading}
      >
        {editMode ? "Editar Tag" : "Adicionar Tags"}
      </Button>
      <Box component="form">
        <Dialog
          fullScreen={fullScreen}
          open={open}
          aria-labelledby="responsive-dialog-title"
        >
          <Box>
            <DialogTitle sx={{ fontWeight: 600 }}>
              {editMode ? "Editar Tag" : "Adicionar Tags"}
            </DialogTitle>
            <Typography
              sx={{
                marginLeft: 3,
                marginRight: 3,
                marginBottom: 3,
              }}
            >
              {editMode
                ? "Preencha a nova informação para editar a tag."
                : "Preencha as informações para cadastrar uma nova tag."}
            </Typography>
          </Box>
          <Divider sx={{ marginBottom: 1 }} />
          <DialogContent sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Tag"
              value={inputValue}
              onChange={handleChangeInput}
              onKeyDown={handleKeyDown}
              variant="filled"
              fullWidth
            />
            <IconButton
              onClick={editMode ? handleEditarTag : handleAdicionarTag}
            >
              {editMode ? <EditIcon /> : <AddCircleIcon />}
            </IconButton>
          </DialogContent>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...caixaTag,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={caixaTag}>
              {tags?.length > 0 ? (
                tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoverTag(tag)}
                    onClick={() => {
                      if (selectedTagIndex === index) {
                        // Se a mesma tag for clicada novamente, desativa o modo de edição
                        setEditMode(false);
                        setInputValue(""); // Limpa o valor do input
                        setSelectedTagIndex(-1); // Resetar o índice da tag selecionada
                      } else {
                        // Se for uma nova tag clicada, ativa o modo de edição e define a tag selecionada
                        setEditMode(true);
                        setInputValue(tag); // Define o valor da tag selecionada no input
                        setSelectedTagIndex(index); // Define o índice da tag selecionada
                      }
                    }}
                    sx={{
                      background: "#fff",
                      mt: 2,
                      mr: 1,
                      // Adicionando a classe 'tag-highlight' às duas primeiras tags
                      ...(index < 2 && {
                        "&.MuiChip-root": {
                          backgroundColor: colors.primary_base,
                          fontWeight: "bold",
                          color: colors.background_base,
                        },
                      }),
                    }}
                  />
                ))
              ) : (
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "130px",
                  }}
                >
                  Nenhuma tag cadastrada.
                </Typography>
              )}
            </Box>
          )}
          <DialogActions sx={{ marginRight: 2, marginBottom: 2 }}>
            <Button autoFocus onClick={handleClose}>
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
