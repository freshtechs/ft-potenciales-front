import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, Stack, Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import Marker from './NewMarker';


const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;

class NewMyGoogleMap extends Component {

    constructor(props) {
        super(props)
        this.setCurrentLocation();
        this.state = {
            mapApiLoaded: false,
            locationLoaded: false,
            center: {
                lat: 10.6684,
                lng: -71.6343
            },
            zoom: 19,
            draggable: true,
            lat: 10.6684,
            lng: -71.6343
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

    apiHasLoaded = (map, maps) => {
        this.setState({
            mapApiLoaded: true,
        });

    };

    nextStep = () => {
        this.props.handleLatLng(this.state.lat, this.state.lng)
        this.props.nextStep();
    }

    prevStep = () => {
        this.props.prevStep();
    }


    render() {
        const { mapApiLoaded, locationLoaded } = this.state;

        function createMapOptions() {
            // estas opciones se encuentran aqui
            // https://developers.google.com/maps/documentation/javascript/maptypes.
            // tambien se edita en la web se pasa un id y los estilos son usados por defecto!
            // https://console.cloud.google.com/google/maps-apis/studio/maps/e282a8dbe593e939?authuser=1&project=unms-223803
            return {
                // el de prueba que tenia era 
                // mapId: "e282a8dbe593e939"
                mapId: "a4f08934312c9fc1",
                minZoom: 15
            };
        }

        return (
            <div className='main-wrapper'>
                <Wrapper>
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
                            key: 'AIzaSyCc-DG9F1KmffrlHzLqqOwV3Rmaav5IITg',
                            libraries: ['places', 'geometry'],
                        }}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
                    >
                        {locationLoaded && (
                            <Marker
                                text=''
                                lat={this.state.lat}
                                lng={this.state.lng}
                            />
                        )}

                    </GoogleMapReact>

                    <br />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            onClick={this.nextStep}
                            fullWidth
                            size="medium"
                            type="submit"
                            variant="contained">
                            Next
                        </Button>
                        <Button
                            onClick={this.prevStep}
                            fullWidth
                            size="medium"
                            variant="contained">
                            Back
                        </Button>
                    </Stack>
                </Wrapper >
            </div >
        );
    }
}

export default NewMyGoogleMap;