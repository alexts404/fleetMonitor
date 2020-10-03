import React, { useState } from 'react';
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import shipIcon from './icons8-cargo-ship-100.png';
import { Ship } from '../../types/ShipInterface';

const containerStyle = {
  width: '100%',
  height: '600px',
};

type Center = {
  lat: number;
  lng: number;
};

type Row = {
  index: number;
  original: Ship;
};

interface MapComponentProps {
  rows: Row[];
  center: Center;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  rows,
  center,
}: MapComponentProps) => {

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [infoOpen, setInfoOpen] = useState(false);

  const markerLoadHandler = (marker, ship) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [ship.id]: marker };
    });
  };

  const markerClickHandler = (event, ship) => {
    setSelectedMarker(ship);
    if (infoOpen) {
      setInfoOpen(false);
    }
    setInfoOpen(true);
  };

  let map: google.maps.Map;
  return (
    <div className="md:px-20 py-8 w-full">
      <div className="shadow overflow-hidden rounded border-b border-gray-200">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_API_MAPS}>
          <GoogleMap
            onLoad={(loadedMap) => {
              map = loadedMap;
            }}
            mapContainerStyle={containerStyle}
            center={center}
            zoom={3}
          >
            {rows.map((ship) => (
              <Marker
                key={ship.index}
                icon={shipIcon}
                label={ship.original.shipName}
                position={{ lat: ship.original.lat, lng: ship.original.lng }}

                onLoad={(marker) => markerLoadHandler(marker, ship)}
                onClick={(event) => markerClickHandler(event, ship)}

              />
            ))}
            {infoOpen && selectedMarker && (
              <InfoWindow
                anchor={markerMap[selectedMarker.id]}
                onCloseClick={() => setInfoOpen(false)}
              >
                <div>
                  <h1>{selectedMarker.original.shipName}</h1>
                  <p>Owner: {selectedMarker.original.owner}</p>
                  <p>Type: {selectedMarker.original.type}</p>
                  <p>MMSI: {selectedMarker.original.mmsi}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default React.memo(MapComponent);
