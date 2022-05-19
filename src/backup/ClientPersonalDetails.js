import React from 'react'
import { Container, Checkbox, FormControlLabel, Typography, Grid, TextField, Button } from '@mui/material'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const ClientPersonalDetails = ({ nextStep, prevStep, handleChange, values }) => {

    const validationSchema = Yup.object().shape({
        nombre: Yup.string()
            .required('El nombre es obligatario')
            .trim()
            .min(3, 'El nombre ingresado debe tener mínimo 3 carácteres'),
        apellido: Yup.string()
            .required('El apellido es obligatario')
            .trim()
            .min(3, 'El apellido ingresado debe tener mínimo 3 carácteres'),
        telefono: Yup.string()
            .required('El teléfono es obligatario')
            .matches('^(0414|0424|0412|0416|0426)[0-9]{7}$', 'El número de teléfono debe ser en formato 04146221214'),
        email: Yup.string()
            .required('El campo email es obligatario')
            .email('El formato ingresado es incorrecto'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const Continue = e => {
        nextStep();
    }

    const Previous = e => {
        prevStep();
    }

    return (
        <Container component="main" maxWidth="xs">
            <div>
                <Typography component="h1" variant="h5">
                    Bienvenido a Fresh Techs
                </Typography>
                <form>
                    <Grid container spacing={2}>

                        {/* first name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                placeholder="Nombre"
                                id="nombre"
                                name="nombre"
                                label="Nombre"
                                defaultValue={values.nombre}
                                {...register('nombre')}
                                onChange={handleChange('nombre')}
                                error={!!errors.nombre}
                            />
                            <br />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.nombre?.message}
                            </Typography>
                        </Grid>
                        {/* last name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                placeholder="Apellido"
                                id="apellido"
                                name="apellido"
                                label="Apellido"
                                defaultValue={values.apellido}
                                {...register('apellido')}
                                onChange={handleChange('apellido')}
                                error={!!errors.apellido}
                            />
                            <br />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.apellido?.message}
                            </Typography>
                        </Grid>

                        {/* numero de telefono */}
                        <Grid item xs={12}>
                            <TextField
                                placeholder="04146121314"
                                name='telefono'
                                id='telefono'
                                label="Número de Teléfono"
                                defaultValue={values.telefono}
                                fullWidth
                                {...register('telefono')}
                                onChange={handleChange('telefono')}
                                error={!!errors.telefono}
                            />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.telefono?.message}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="email"
                                name="email"
                                label="Email"
                                defaultValue={values.email}
                                fullWidth
                                margin="dense"
                                {...register('email')}
                                onChange={handleChange('email')}
                                error={!!errors.email}
                            />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.email?.message}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={values.esAdmin}
                                    onChange={handleChange('esAdmin')}
                                    color="primary"
                                />}
                                label="Administrador"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                onClick={Previous}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Atras
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                onClick={handleSubmit(Continue)}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Siguiente
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}

export default ClientPersonalDetails  