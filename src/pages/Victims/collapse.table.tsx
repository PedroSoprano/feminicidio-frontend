import * as React from "react";
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
import { useRefresh } from "../../shared/hooks/useRefresh";
import { api } from "../../service/api";
import { toast } from "react-toastify";
import { colors } from "../../shared/theme";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { deleteVictims } from "../../service/victims";
import { formatarData } from "../../utils/formatDate";
import { EditVictims } from "./editVictims";
import { ModalDelete } from "../../components/ModalDelete/ModalDelete";

export interface IRowsPropsVictims {
  datadofato: string;
  diah: string;
  horario: string;
  turno: string;
  nome: string;
  idade: string;
  racacor1: string;
  estciv2: string;
  bairro: string;
  rua_beco_travessa_estrada_ramal: string;
  endcomplemento: string;
  tipoarma1: string;
  tipoarma2: string;
  loclesao1: string;
  loclesao2: string;
  loclesao3: string;
  hospitalizacao: string;
  violsexual: string;
  latrocinio: string;
  localdeocorrencia: string;
  presencafilhofamiliar: string;
  compexcomp: string;
  gestacao: string;
  filhosdescrever: number;
  lat: string;
  lng: string;
  lido: boolean;
  classificacao: number;
  zona: string;
  id: string;
  vitima: string;
  sites: string[];
}

function Row(props: IRowsPropsVictims) {
  const [open, setOpen] = React.useState(false);
  const { addCount } = useRefresh();

  const copyAllInfoToClipboard = (info: string) => {
    navigator.clipboard
      .writeText(info)
      .then(() => {
        toast.success("Informações copiadas para a área de transferência");
      })
      .catch((error) => {
        toast.error(
          "Erro ao copiar informações para a área de transferência",
          error
        );
      });
  };

  const copyAllInfo = () => {
    const allInfo = `
      Data do Fato: ${props.datadofato}
      Dia: ${props.diah}
      Horário: ${props.horario}
      Turno: ${props.turno}
      Nome: ${props.nome}
      Idade: ${props.idade}
      Raça/Cor: ${props.racacor1}
      Estado Civil: ${props.estciv2}
      
      Detalhes de Localização:
      Bairro: ${props.bairro}
      Rua/Beco/Travessa/Estrada/Ramal: ${props.rua_beco_travessa_estrada_ramal}
      Complemento: ${props.endcomplemento}
      Zona: ${props.zona}
      Latitude: ${props.lat}
      Longitude: ${props.lng}
      
      Detalhes do Incidente:
      Tipo de Arma 1: ${props.tipoarma1}
      Tipo de Arma 2: ${props.tipoarma2}
      Local de Lesão 1: ${props.loclesao1}
      Local de Lesão 2: ${props.loclesao2}
      Local de Lesão 3: ${props.loclesao3}
      Hospitalização: ${props.hospitalizacao}
      Violência Sexual: ${props.violsexual}
      Latrocínio: ${props.latrocinio}
      Local de Ocorrência: ${props.localdeocorrencia}
      
      Detalhes da Família:
      Presença de Filhos/Familiares: ${props.presencafilhofamiliar}
      Violência Doméstica: ${props.compexcomp}
      Gestação: ${props.gestacao}
      Número de Filhos: ${props.filhosdescrever}
    `;

    copyAllInfoToClipboard(allInfo);
  };

  const DeleteVictims = (vitimaId: string) => {
    deleteVictims(vitimaId)
      .then((response: any) => {
        if (response.status === 200) {
          toast.success("Dados da vítima excluídos com sucesso");
          addCount();
        }
      })
      .catch((error: any) => {
        toast.error(error?.response.data.datail);
      });
  };

  const dataFormatada = formatarData(props.datadofato);

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
        <TableCell align="left">{props.idade}</TableCell>
        <TableCell align="left">{dataFormatada}</TableCell>
        <TableCell align="left">{props.violsexual}</TableCell>
        <TableCell align="right">
          <IconButton onClick={copyAllInfo}>
            <FileCopyIcon />
          </IconButton>
          <ModalDelete
            onDelete={() => DeleteVictims(props.id)}
            title="Excluir vítima"
            subtitle="Realmente deseja excluir esta vítima?"
          />
          <EditVictims vitimaId={props.id} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead sx={{ background: colors.primary_lightest }}>
                  <TableRow>
                    <TableCell>Informações Básicas</TableCell>
                    <TableCell>Detalhes da Localização</TableCell>
                    <TableCell>Detalhes da Morte</TableCell>
                    <TableCell>Detalhes da Família</TableCell>
                    <TableCell>Link de referência</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {/* Informações Básicas */}
                    <TableCell>
                      <Typography variant="subtitle1" gutterBottom>
                        diah: {props.diah}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        horario: {props.horario}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        turno: {props.turno}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        racacor1: {props.racacor1}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        estciv2: {props.estciv2}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        compexcomp: {props.compexcomp}
                      </Typography>
                    </TableCell>
                    {/* Detalhes da Localização */}
                    <TableCell>
                      <Typography variant="subtitle1" gutterBottom>
                        bairro: {props.bairro}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        rua: {props.rua_beco_travessa_estrada_ramal}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        endcomplemento: {props.endcomplemento}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        zona: {props.zona}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        X_Lati: {props.lat}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        Y_Long: {props.lng}
                      </Typography>
                    </TableCell>

                    {/* Detalhes do Incidente */}
                    <TableCell>
                      <Typography variant="subtitle1" gutterBottom>
                        tipoarma1: {props.tipoarma1}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        tipoarma2: {props.tipoarma2}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        loclesao1: {props.loclesao1}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        loclesao2: {props.loclesao2}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        loclesao3: {props.loclesao3}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        hospitalizacao: {props.hospitalizacao}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        latrocinio: {props.latrocinio}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        localdeocorrencia: {props.localdeocorrencia}
                      </Typography>
                    </TableCell>

                    {/* Detalhes da Família */}
                    <TableCell>
                      <Typography variant="subtitle1" gutterBottom>
                        presencafilhofamiliar: {props.presencafilhofamiliar}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        gestacao: {props.gestacao}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        filhosdescrever: {props.filhosdescrever}
                      </Typography>
                    </TableCell>

                    {/* Sites */}
                    <TableCell>
                      {props.sites && props.sites.length > 0 && (
                        <ul>
                          {props.sites.map((site: any, index: number) => (
                            <li key={index}>
                              <a
                                href={site.link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {site.link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface ITableVctims {
  rows: any;
}

export function TableVictims(props: ITableVctims) {
  const [rows, setRows] = React.useState<IRowsPropsVictims[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { count } = useRefresh();

  React.useEffect(() => {
    listAll();
  }, [count]);

  const listAll = () => {
    setLoading(true);
    api
      .get<IRowsPropsVictims[]>("/api/vitimas/")
      .then((res) => {
        setLoading(false);
        setRows(res.data);
      })
      .catch((error) => {
        toast.error(error?.response.data.detail);
        setLoading(false);
      });
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead sx={{ background: colors.primary_lightest }}>
          <TableRow>
            <TableCell />
            <TableCell align="left">nome</TableCell>
            <TableCell align="left">idade</TableCell>
            <TableCell align="left">datadofato</TableCell>
            <TableCell align="left">violsexual</TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row: any, index: number) => (
            <Row key={index} {...row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
