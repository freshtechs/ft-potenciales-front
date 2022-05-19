import React, { Component } from 'react'
import { styled } from '@mui/material/styles';
import { Container, Typography, Stack } from '@mui/material';
import ClientConfirmation from './ClientConfirmation'
import ClientForm from './ClientForm'
import Page from '../../../components/Page';
import MyGoogleMap from './MyGoogleMap';


const ContentStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    minHeight: '75vh',
    maxWidth: '200vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(1, 0),
}));

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));


class ClientsParent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            step: 1,
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            latitud: null,
            longitud: null,
            tipoDeVivienda: '',
            nombreDeVivienda: '',
            numeroDeVivienda: '',
            rangoMinimoDePago: '',
            rangoMaximoDePago: '',
            esPotencial: '',
            yaTieneServicio: '',
            calificacion: '',
            calificacionCalidadPrecio: '',
            loRemplazaria: '',
            loAdquiriria: '',
            loRecomendaria: '',
            vendedor: localStorage.getItem('vendedor'),
        };
    }

    prevStep = () => {
        const { step } = this.state;
        this.setState({ step: step - 1 });
    }

    nextStep = () => {
        const { step } = this.state;
        this.setState({ step: step + 1 });
    }

    startOver = () => {
        this.setState({
            step: 1,
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            latitud: null,
            longitud: null,
            tipoDeVivienda: '',
            nombreDeVivienda: '',
            numeroDeVivienda: '',
            rangoMinimoDePago: '',
            rangoMaximoDePago: '',
            esPotencial: '',
            yaTieneServicio: '',
            calificacion: '',
            calificacionCalidadPrecio: '',
            loRemplazaria: '',
            loAdquiriria: '',
            loRecomendaria: '',
            vendedor: localStorage.getItem('vendedor'),
        });
    }

    handleChange = (values) => {
        const { nombre, apellido, email, telefono, nombreDeVivienda, numeroDeVivienda, tipoDeVivienda, latitud, longitud, rangoMinimoDePago, rangoMaximoDePago, esPotencial, yaTieneServicio, calificacion, calificacionCalidadPrecio, loRemplazaria, loAdquiriria, loRecomendaria } = values
        this.setState({
            nombre,
            apellido,
            email,
            telefono,
            latitud,
            longitud,
            tipoDeVivienda,
            nombreDeVivienda, numeroDeVivienda,
            rangoMinimoDePago,
            rangoMaximoDePago,
            esPotencial,
            yaTieneServicio, calificacion, calificacionCalidadPrecio, loRemplazaria, loAdquiriria, loRecomendaria
        })
    }

    handleLatLng = (lat, lng) => {
        this.setState({ latitud: lat, longitud: lng })
    }

    renderStep = (step, values) => {
        switch (step) {
            case 1:
                return (
                    <ClientForm
                        prevStep={this.prevStep}
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                        inputValues={values}
                    />
                )
            case 2:
                return (
                    <MyGoogleMap
                        prevStep={this.prevStep}
                        nextStep={this.nextStep}
                        handleLatLng={this.handleLatLng}
                    />
                )
            case 3:
                return (
                    <ClientConfirmation
                        prevStep={this.prevStep}
                        values={values}
                        startOver={this.startOver}
                    />
                )
            default:
                return (
                    <Typography>Test</Typography>
                )
        }
    }


    render() {
        const { step } = this.state;
        const {
            nombre,
            apellido,
            email,
            telefono,
            latitud,
            longitud,
            tipoDeVivienda,
            nombreDeVivienda,
            rangoMinimoDePago,
            rangoMaximoDePago,
            esPotencial, numeroDeVivienda,
            yaTieneServicio,
            calificacion,
            calificacionCalidadPrecio,
            loRemplazaria,
            loAdquiriria,
            loRecomendaria,
            vendedor
        } = this.state;
        const values = {
            email, nombre, apellido, telefono, latitud, longitud, tipoDeVivienda, nombreDeVivienda,
            rangoMinimoDePago, rangoMaximoDePago, esPotencial, vendedor, numeroDeVivienda, yaTieneServicio, calificacion, calificacionCalidadPrecio, loRemplazaria, loAdquiriria, loRecomendaria
        }
        return (
            < Page title="NewClient" >
                <RootStyle>
                    <Container>
                        <Typography variant="h4" align='center' gutterBottom>
                            Registro cliente potencial
                        </Typography>
                        <ContentStyle>
                            <Stack spacing={3}>
                                {this.renderStep(step, values)}
                            </Stack>
                        </ContentStyle>
                    </Container>
                </RootStyle>
            </Page >
        )
    }
}


export default ClientsParent
