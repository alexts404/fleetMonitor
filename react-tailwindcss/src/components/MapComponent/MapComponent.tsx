import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
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
  let map: google.maps.Map;
  return (
    <div className="md:px-20 py-8 w-full">
      <div className="shadow overflow-hidden rounded border-b border-gray-200">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_API_MAPS}>
          <GoogleMap
            onLoad={(loadedMap) => {
              map = loadedMap;
              console.log(map);
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
                onClick={(e) => {
                  console.log(map);
                  map.panTo(e.latLng);
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default React.memo(MapComponent);
