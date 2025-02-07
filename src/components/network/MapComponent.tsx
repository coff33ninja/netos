
import { LoadScript, GoogleMap } from '@react-google-maps/api';
import { useState } from 'react';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    zIndex: 0,
};

const defaultCenter = {
    lat: 0,
    lng: 0,
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [{ featureType: "all", elementType: "all", stylers: [{ saturation: -100 }] }]
};

interface MapComponentProps {
    mapsApiKey: string;
    mapDimensions: { width: number; height: number };
    onError: (error: Error) => void;
    onLoad: () => void;
}

export const MapComponent = ({ mapsApiKey, mapDimensions, onError, onLoad }: MapComponentProps) => {
    return (
        <LoadScript
            googleMapsApiKey={mapsApiKey}
            onError={(error) => onError(error)}
            onLoad={onLoad}
        >
            <GoogleMap
                mapContainerStyle={{
                    ...mapContainerStyle,
                    width: mapDimensions.width || '100%',
                    height: mapDimensions.height || '100%'
                }}
                center={defaultCenter}
                zoom={2}
                options={mapOptions}
                onLoad={onLoad}
            />
        </LoadScript>
    );
};
