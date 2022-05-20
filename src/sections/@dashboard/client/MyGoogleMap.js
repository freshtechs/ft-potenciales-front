import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { Button, Stack, Typography } from '@mui/material';
import Marker from './Marker';


class MyGoogleMap extends Component {

    constructor(props) {
        super(props)
        this.setCurrentLocation();
        this.state = {
            mapApiLoaded: false,
            center: {
                lat: 10.6684,
                lng: -71.6343
            },
            zoom: 19,
            draggable: true,
            lat: null,
            lng: null,
            locationLoaded: false
        };
    }

    onMarkerInteraction = (childKey, childProps, mouse) => {
        this.setState({
            draggable: false,
            lat: mouse.lat,
            lng: mouse.lng
        });
    }

    onMarkerInteractionMouseUp = () => {
        this.setState({ draggable: true });
    }

    setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    center: [position.coords.latitude, position.coords.longitude],
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    locationLoaded: true
                });
            });
        }
    }


    _onChange = ({ center, zoom }) => {
        this.setState({
            center,
            zoom,
        });

    }

    _onClick = (value) => {
        this.setState({
            lat: value.lat,
            lng: value.lng
        });
    }

    apiHasLoaded = () => {
        this.setState({
            mapApiLoaded: true,
        });

    };

    continue = () => {
        this.props.handleLatLng(this.state.lat, this.state.lng)
        this.props.nextStep();
    };

    previous = () => {
        this.props.prevStep();
    };

    render() {
        const {
            mapApiLoaded, locationLoaded
        } = this.state;

        function createMapOptions() {
            // estas opciones se encuentran aqui
            // https://developers.google.com/maps/documentation/javascript/maptypes.
            // tambien se edita en la web se pasa un id y los estilos son usados por defecto!
            // https://console.cloud.google.com/google/maps-apis/studio/maps/e282a8dbe593e939?authuser=1&project=unms-223803
            return {
                // el de prueba que tenia era 
                // mapId: "e282a8dbe593e939"
                mapId: "a4f08934312c9fc1",
                minZoom: 13
            };
        }

        return (
            <div>
                <Typography variant='subtitle1' > Toque en mapa la posición exacta del cliente </Typography>
                <div className='main-wrapper'>
                    {mapApiLoaded}
                    <GoogleMapReact
                        center={this.state.center}
                        // eslint-disable-next-line react/jsx-no-bind
                        options={createMapOptions}
                        zoom={this.state.zoom}
                        draggable={this.state.draggable}
                        onChange={this._onChange}
                        onChildMouseDown={this.onMarkerInteraction}
                        onChildMouseUp={this.onMarkerInteractionMouseUp}
                        onChildMouseMove={this.onMarkerInteraction}
                        onChildClick={() => console.log('child click')}
                        onClick={this._onClick}
                        bootstrapURLKeys={{
                            key: process.env.REACT_APP_GMAP_APIKEY,
                            libraries: ['places', 'geometry'],
                        }}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={() => this.apiHasLoaded()}
                    >
                        {locationLoaded && (
                            <Marker
                                text=''
                                lat={this.state.lat}
                                lng={this.state.lng}
                            />
                        )}

                    </GoogleMapReact>
                    <Stack marginTop={'10px'} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            onClick={this.previous}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            <Typography variant='button'>ANTERIOR</Typography>
                        </Button>
                        <Button
                            onClick={this.continue}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            <Typography variant='button'>SIGUIENTE</Typography>
                        </Button>
                    </Stack>
                </div >
            </div>
        );
    }
}

MyGoogleMap.propTypes = {
    handleLatLng: PropTypes.func,
    prevStep: PropTypes.func,
    nextStep: PropTypes.func
}

export default MyGoogleMap;