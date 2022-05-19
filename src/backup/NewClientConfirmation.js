import React from 'react'
import { Container, Grid, List, ListItem, ListItemText, Button } from '@mui/material'

const NewClientConfirmation = ({ prevStep, nextStep, inputValues }) => {

    const { nombre, apellido, email, telefono, nombreDeVivienda, tipoDeVivienda, latitud, longitud } = inputValues

    async function Continue(e) {
        e.preventDefault();

        try {
            const client = {
                email: email.toLowerCase(),
                nombre,
                apellido,
                telefono,
                latitud,
                longitud,
                tipoDeVivienda: 'Casa',
                nombreDeVivienda: '#58',
                vendedor: localStorage.getItem("vendedor")
            }
            const res = await fetch("/api/clients", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "x-access-token": localStorage.getItem("token")
                },
                body: JSON.stringify(client)
            })
            const data = await res.json()
            console.log(data)
        } catch (err) {
            // setErrorMessage(err)
            console.log(err.message)
        }
        nextStep();
    }

    const submitClient = async (e) => {
        e.preventDefault();
    }

    const Previous = e => {
        e.preventDefault();
        prevStep();
    }

    return (
        <Container component="main" maxWidth="xs">
            <div>
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
                        <ListItemText primary="latitud" secondary={latitud} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="longitud" secondary={longitud} />
                    </ListItem>
                </List>

                <br />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            onClick={Previous}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Previous
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            onClick={submitClient}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Confirmar
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Container>
    )
}

export default NewClientConfirmation