import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";

export function Dashboard() {
  const [loadingMetabase, setLoadingMetabase] = useState(true);

  // Função para lidar com o evento de carregamento do Metabase
  const handleMetabaseLoad = () => {
    // Quando o Metabase estiver carregado, definimos o estado de loading como falso
    setLoadingMetabase(false);
  };

  return (
    <>
      {loadingMetabase && (
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
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
        <iframe
          src="https://graph.monitorafeminicidio.com/public/dashboard/7be29569-672f-4959-809e-612a67f86bcd"
          title="Dashboards"
          frameBorder="0"
          width="1650"
          height="670"
          onLoad={handleMetabaseLoad}
        />
      </Box>
    </>
  );
}
