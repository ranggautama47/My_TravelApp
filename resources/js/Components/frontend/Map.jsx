import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
    LayersControl,
    Polyline,
        } from "react-leaflet";
import MapPopup from "./MapPopup";
import { useEffect, useRef,  useState, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";

// Component to recenter the map when coordinates change
const Recenter =({ lat, lng, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], zoom);
    }, [lat, lng, zoom]);

    return null;
};

const NavigationRoute = ({ userLocation, destination }) => {
    const map = useMap();
    const [routePoints, setRoutePoints] = useState([]);
    const [directions, setDirections] = useState([]);
    const [routeLoading, setRouteLoading] = useState(false);
    const [routeError, setRouteError] = useState(null);

     const [showDirections, setShowDirections] = useState(true);
     const directionsRef = useRef(null);

     useEffect(() => {
        setRoutePoints([]);
        setDirections([]);
        setRouteError(null);
     }, [destination]);

     useEffect(() => {
        if (directionsRef.current) {
            L.DomEvent.disableScrollPropagation(directionsRef.current);
        }
     }, [directionsRef, showDirections]);

     useEffect(() => {
        if (!userLocation) return;

        const fetchRoute = async () => {
            setRouteLoading(true);
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=true`;
;

                const response = await fetch(url);
                const data = await response.json();

                if (data.code === "Ok" && data.routes?.length > 0) {
                    const route = data.routes[0];
                    setRoutePoints(
                        route.geometry.coordinates.map((coord) => [
                            coord[1],
                            coord[0],
                        ]),
                    );

                    const stepList = route.legs[0].steps.map((step, index) => ({
                        distance: step.distance,
                        duration: step.duration,
                        instruction:
                            step.maneuver.instruction || step.maneuver.type,
                        name: step.name,
                        index,
                    }));

                    setDirections(stepList);

                    const bounds = L.latLngBounds([
                        [userLocation.lat, userLocation.lng],
                        [destination.lat, destination.lng],
                    ]);
                    map.fitBounds(bounds, { padding: [50, 50] });
                } else {
                    setRouteError("Could not calculate route");
                }
            } catch (error) {
                setRouteError(`Error calculating route: ${error.message}`);
            } finally {
                setRouteLoading(false);
            }
        };

            fetchRoute();
        },  [userLocation, destination, map]);

        if (routeLoading)
            return <div className="route-loading">Calculating route...</div>;
        if (routeError) return <div className="route-error">{routeError}</div>;

        return (
            <>
                 {routePoints.length > 0 && (
                    <Polyline
                        positions={routePoints}
                        pathOptions={{ color: "blue", weight: 5, opacity: 0.7 }}
                    />
                 )}

                 {directions.length > 0 && (
                    <div
                        ref={directionsRef}
                        className="absolute bottom-0 left-0 z-[1000] bg-white bg-opacity-90 rounded-md m-4 shadow-md w-[300px] text-sm"
                    >
                        <button
                            onClick={() => setShowDirections(!showDirections)}
                            className="w-full bg-blue-100 flex justify-between text-blue-800 hover:cursor-pointer px-3 py-2 font-semibold text-left rounded-t-md"
                        >
                            {showDirections ? (
                                <>
                                        <span>Hide directions</span>
                                        <i className="bi bi-chevron-down"></i>
                                </>
                            ) : (
                                <>
                                    <span>Show directions</span>
                                    <i className="bi bi-chevron-up"></i>
                                </>
                            )}
                        </button>

                        {showDirections && (
                            <div className="max-h-[40vh] overflow-auto p-3">
                                <h3 className="text-base font-semibold mb-2">
                                    Directions
                                </h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    {directions.map((step) => (
                                        <li key={step.index}>
                                            <span className="font-medium">
                                                {step.instruction}
                                            </span>
                                            {step.name && ` onto ${step.name}`}
                                            <div className="text-xs text-gray-500">
                                                {(step.distance / 1000).toFixed(2)}{" "}
                                                km, ~
                                                {Math.round(step.duration / 60)} min
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                 )}
            </>
        );
     };

const Map = forwardRef(function Map(
    { lat, long, location, onMarkerDragEnd, customMarker, isNavigation = true },
    ref,
) {
    const zoom = 16;
    const destination = {lat, lng: long};
    const markerRef = useRef(null);

    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [navigationStarted, setNavigationStarted] = useState(false)

    const handleDragEnd = () => {
        const marker = markerRef.current;
        if (marker != null) {
            const { lat, lng } = marker.getLatLng();
            if (onMarkerDragEnd) {
                onMarkerDragEnd(lat, lng);
            }
        }
    };

    const startNavigation = () => {
    setLocationError(null);
    setLocationLoading(true);
    setNavigationStarted(true);

    if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        setLocationLoading(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
            setLocationLoading(false);
            setLocationError(null);
        },
        (error) => {
            setLocationError(`Error getting location: ${error.message}`);
            setLocationLoading(false);
        },
        { enableHighAccuracy: true }
    );
};



 useImperativeHandle(ref, () => ({
    startNavigation,
 }));

    useEffect(() => {
        if (navigationStarted) {
            startNavigation();
        }
    }, [lat, long, location]);

    const centerPosition =
        navigationStarted && userLocation
            ? [userLocation.lat, userLocation.lng]
            : [lat, long];
    const initialZoom = navigationStarted && userLocation ? 12 : zoom;



    return (
        <div className="relative">
            {locationLoading && (
                <div className="absolute bottom-0 left-0 z-[1000] bg-white bg-opacity-90 p-4 rounded-md m-4 shadow-md">
                    <div className="flex items-center">
                        <svg
                            className="animate-spin h-5 w-5 mr-3 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                            Getting Your Location...
                    </div>
                </div>
            )}
            {locationError && (
                <div className="absolute bottom-0 left-0 z-[1000] bg-white bg-opacity-90 p-4 rounded-md m-4 shadow-md text-red-500 flex items-start justify-between gap-4">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                 fillRule="evenodd"
                                 d="m18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0v6a1 1 0 00-1-1z"
                                 clipRule="evenodd"
                            />
                        </svg>
                         {locationError}
                    </div>
                    <button
                        onClick={() => setLocationError(null)}
                        className="text-sm font-bold px-2 py-1 rounded hover:bg-gray-100"
                    >
                        &times;
                    </button>
                </div>
            )}

            {isNavigation && navigationStarted && userLocation && (
                <div className="absolute bottom-0 right-0 z-[1000] bg-opacity-90 rounded-md m-4 shadow-md">
                    <button
                        onClick={() => {
                            const map = markerRef.current?._map;
                            if (map && userLocation) {
                                map.flyTo(
                                    [userLocation.lat, userLocation.lng],
                                    16,
                                );
                            }
                        }}
                        className="bg-white hover:bg-gray-100 hover:cursor-pointer text-gray-500 w-12 h-12 grid place-content-center rounded-md">
                            <i className="bi bi-crosshair text-2xl"/>
                    </button>
                </div>
            )}

            <MapContainer
                center={centerPosition}
                zoom={initialZoom}
                scrollWheelZoom={true}
            >
                <Recenter
                    lat={centerPosition[0]}
                    lng={centerPosition[1]}
                    zoom={initialZoom}
                />
                 <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Satellite">
                        <TileLayer
                            attribution="Tiles &copy; Esri"
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                <Marker
                    position={[lat, long]}
                    draggable={!!onMarkerDragEnd}
                    eventHandlers={{ dragend: handleDragEnd }}
                    ref={markerRef}
                >
                    <Popup minWidth={400} maxWidth={400}>
                        {customMarker || <MapPopup location={location} />}
                    </Popup>
                </Marker>

                {navigationStarted && userLocation && (
                    <>
                    <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={L.divIcon({
                            className: "current-location-marker",
                            html: '<div class="pulse"></div>',
                            iconSize: [20, 20],
                            iconAnchor: [10, 10],
                        })}
                    >
                        <Popup>Your current location</Popup>
                    </Marker>

                    <NavigationRoute
                        key={`${destination.lat}-${destination.lng}`}
                        userLocation={userLocation}
                        destination={destination}
                    />
                </>
            )}
            </MapContainer>
        </div>
    );
});

export default Map;
