
import { stylesMap } from "./map";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon, LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from "react-leaflet-cluster";
import { Box } from "@mui/material";

interface IProps {
  vitimas: any[]
}

export function MapPage({vitimas}: IProps) {
  const position = [-3.059943, -59.988359] as LatLngExpression

  const myIcon: any = new Icon({
    iconUrl: "https://www.irmasclarissas.org.br/wp-content/uploads/2015/08/Map-Marker-PNG-File.png",
    iconSize: [40, 40]
  })

  return (
    <Box style={stylesMap.container}>
      <MapContainer center={position} zoom={12} scrollWheelZoom={true} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={"https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />
        <MarkerClusterGroup>
          {vitimas.map((marker, index) => (
            <Marker icon={myIcon} key={index} position={{
              lat: Number(marker.lat),
              lng: Number(marker.lng)
            }} >
              <Popup>
                <h2>{marker.nome}</h2>
                <p>Bairro: {marker.bairro}</p>
                <p>Zona: {marker.zona ?? "Zona não cadastrada"}</p>
                <p>Idade: {marker.idade}</p>
                <MapContainer center={{
                  lat: Number(marker.lat),
                  lng: Number(marker.lng)
                }} zoom={20} scrollWheelZoom={false} zoomControl={false} style={{ height: "100px", width: "180px" }}>
                  <TileLayer
                    url={"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"}
                  />
                  <Marker icon={myIcon} position={{
                    lat: Number(marker.lat),
                    lng: Number(marker.lng)
                  }}>
                  </Marker>
                </MapContainer>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </Box>
  );
}
