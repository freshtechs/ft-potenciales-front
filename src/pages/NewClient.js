import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
import { setIn } from 'formik';
import NewMyGoogleMap from '../sections/@dashboard/client/NewMyGoogleMap';
// components
import Page from '../components/Page';
// sections
import NewClientForm from '../sections/@dashboard/client/NewClientForm';
import NewClientConfirmation from '../backup/NewClientConfirmation';



// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
    top: 0,
    zIndex: 9,
    lineHeight: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
        alignItems: 'flex-start',
        padding: theme.spacing(7, 5, 0, 7),
    },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function NewClient() {

    const [inputValues, setInputValues] = useState({
        step: 1,
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        latitud: null,
        longitud: null,
        tipoDeVivienda: '',
        nombreDeVivienda: '',
        rangoMinimoDePago: '',
        rangoMaximoDePago: '',
        esPotencial: '',
        vendedor: localStorage.getItem('vendedor'),
    });

    const prevStep = () => {
        const { step } = inputValues;
        setInputValues({ step: step - 1 });
    }

    const nextStep = () => {
        const { step } = inputValues;
        setInputValues({ step: step + 1 });
    }

    const handleChange = (values) => {
        setInputValues({
            nombre: values.nombre,
            apellido: values.apellido,
            email: values.email,
            telefono: values.telefono,
            latitud: values.latitud,
            longitud: values.longitud,
            tipoDeVivienda: values.tipoDeVivienda,
            nombreDeVivienda: values.nombreDeVivienda,
            rangoMinimoDePago: values.rangoMinimoDePago,
            rangoMaximoDePago: values.rangoMaximoDePago,
            esPotencial: values.esPotencial
        })
    }

    const handleLatLng = (lat, lng) => {
        setInputValues({ latitud: lat, longitud: lng })
    }

    const renderSwitch = (step) => {
        switch (step) {
            case 1:
                return <NewClientForm
                    nextStep={nextStep}
                    prevStep={prevStep}
                    handleChange={handleChange}
                    inputValues={inputValues}
                />
            case 2:
                return <NewMyGoogleMap
                    nextStep={nextStep}
                    prevStep={prevStep}
                    handleLatLng={handleLatLng}
                    inputValues={inputValues}
                />
            case 3:
                return <NewClientConfirmation
                    nextStep={nextStep}
                    prevStep={prevStep}
                    handleChange={handleChange}
                    inputValues={inputValues}
                />
            default:
                return <NewClientConfirmation
                    nextStep={nextStep}
                    prevStep={prevStep}
                    handleChange={handleChange}
                    inputValues={inputValues}
                />
        }
    }


    return (
        < Page title="NewClient" >
            <RootStyle>
                <Container>
                    <Typography variant="h4" align='center' gutterBottom>
                        Registro cliente potencial
                    </Typography>
                    <ContentStyle>
                        {renderSwitch(inputValues.step)}
                    </ContentStyle>
                </Container>
            </RootStyle>
        </Page >
    );
}
