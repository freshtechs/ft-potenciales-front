import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText, Button, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const ClientConfirmation = ({ prevStep, values, startOver }) => {

    const navigate = useNavigate();

    const [serverError, setServerError] = useState(false);

    const [serverErrorMessage, setServerErrorMessage] = useState('')

    const { nombre, apellido, email, telefono, nombreDeVivienda, numeroDeVivienda, tipoDeVivienda, latitud, longitud, rangoMinimoDePago, rangoMaximoDePago, esPotencial, yaTieneServicio, calificacion, calificacionCalidadPrecio, loRemplazaria, loAdquiriria, loRecomendaria } = values

    const submitClient = async (e) => {
        e.preventDefault();
        const client = {
            nombre,
            apellido,
            email: email.toLowerCase(),
            telefono,
            latitud,
            longitud,
            tipoDeVivienda,
            nombreDeVivienda,
            numeroDeVivienda,
            rangoMinimoDePago,
            rangoMaximoDePago,
            esPotencial,
            yaTieneServicio, calificacion, calificacionCalidadPrecio, loRemplazaria, loAdquiriria, loRecomendaria,
            vendedor: localStorage.getItem("vendedor")
        }
        try {
            const response = await axios.post("https://potenciales.herokuapp.com/api/clients", client, {
                withCredentials: true,
                headers: {
                    "Content-type": "application/json",
                    "x-access-token": localStorage.getItem("token")
                }
            });
            if (response.status === 200) {
                navigate('/dashboard/user', { replace: true })
            }
        } catch (err) {
            setServerError(true)
            if (err.response.status === 400) {
                setServerErrorMessage(err.message);
            }
            else if (err?.code === "ERR_NETWORK") {
                setServerErrorMessage(err.message);
            }
            else {
                setServerErrorMessage("Los datos ingresados no son válidos");
            }
        }

    }

    const Previous = e => {
        e.preventDefault();
        prevStep();
    }

    return (
        <div>
            <Typography variant='subtitle1' > Confirmación de datos </Typography>
            <div>
                <Stack spacing={3}>
                    {serverError && (
                        <div>
                            <Typography sx={{ color: 'red', mb: 0.1 }}>
                                {serverErrorMessage}
                            </Typography>
                            <Button
                                onClick={startOver}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="secondary"
                                size="large"
                            >
                                <Typography variant='button'>INICIAR DE NUEVO</Typography>
                            </Button>
                        </div>
                    )}
                </Stack>
                <List>
                    <ListItem>
                        <ListItemText primary="Email" secondary={email} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Nombre" secondary={nombre} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Apellido" secondary={apellido} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Número de Teléfono" secondary={telefono} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Tipo de Vivienda" secondary={tipoDeVivienda} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Nombre de Vivienda" secondary={nombreDeVivienda} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Número de Vivienda" secondary={numeroDeVivienda} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="yaTieneServicio" secondary={yaTieneServicio} />
                    </ListItem>
                </List>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                        onClick={Previous}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Atrás
                    </Button>
                    <Button
                        onClick={submitClient}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Siguiente
                    </Button>
                </Stack>
            </div>
        </div>
    )
}


ClientConfirmation.propTypes = {
    values: PropTypes.object,
    prevStep: PropTypes.func,
    startOver: PropTypes.func
};

export default ClientConfirmation