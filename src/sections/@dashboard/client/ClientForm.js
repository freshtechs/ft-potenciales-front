import * as Yup from 'yup';
import { Form, FormikProvider, useFormik, useFormikContext } from 'formik';
// material
import { Button, Stack, TextField, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';



// ----------------------------------------------------------------------
const theSameChoices = [
    'Extremadamente probable',
    'Muy probable',
    'Algo Probable',
    'No tan probable',
    'Nada probable'
]
const questions = [
    {
        question: '¿Actualmente posee un servicio de internet?',
        choices: ['Si', 'No']
    },
    {
        question: '¿Cómo calificaría la calidad del servicio?',
        choices: [
            'Muy alta calidad',
            'Alta calidad',
            'Ni alta ni baja calidad',
            'Baja calidad',
            'Muy baja calidad',
        ]
    },
    {
        question: '¿Cómo calificaría la relación calidad precio del servicio?',
        choices: [
            'Excelente',
            'Por encima del promedio',
            'Por debajo del promedio',
            'Mala',
        ]
    },
    {
        question: '¿Qué tan probable es que reemplace su actual servicio?',
        choices: theSameChoices
    },
    {
        question: 'Si el servicio estuviera disponible hoy, ¿qué tan probable seria que usted adquiriera el servicio?',
        choices: theSameChoices
    },
    {
        question: '¿Qué tan probable es que le recomiende este servicio a sus amigos?',
        choices: theSameChoices
    },

]

// ----------------------------------------------------------------------

function ClientForm({ nextStep, handleChange, inputValues }) {

    const [selecciono, SetSelecciono] = useState(false)

    const [siTieneServicio, SetSiTieneServicio] = useState(false)

    const RegisterSchema = Yup.object().shape({
        nombre: Yup.string()
            .required('El nombre es obligatario')
            .trim()
            .max(50, 'Nombre muy largo')
            .min(3, 'El nombre ingresado debe tener mínimo 3 carácteres'),
        apellido: Yup.string()
            .required('El apellido es obligatario')
            .trim()
            .max(50, 'Apellido muy largo')
            .min(3, 'El apellido ingresado debe tener mínimo 3 carácteres'),
        email: Yup.string()
            .required('El campo email es obligatario')
            .email('El formato ingresado es incorrecto'),
        telefono: Yup.string()
            .required('El teléfono es obligatario')
            .matches('^(0414|0424|0412|0416|0426)[0-9]{7}$', 'El número de teléfono debe ser en formato 04146221214'),
        tipoDeVivienda: Yup.string()
            .required('El tipo de vivienda es obligatario'),
        nombreDeVivienda: Yup.string()
            .required('El nombre o número de vivienda es obligatario'),
        numeroDeVivienda: Yup.string()
            .required('El nombre o número de vivienda es obligatario'),
        yaTieneServicio: Yup.string()
            .required('Campo obligatario'),
        calificacion: Yup.string()
            .required('Campo obligatario'),
        calificacionCalidadPrecio: Yup.string()
            .required('Campo obligatario'),
        loRemplazaria: Yup.string()
            .required('Campo obligatario'),
        loAdquiriria: Yup.string()
            .required('Campo obligatario'),
        loRecomendaria: Yup.string()
            .required('Campo obligatario')
    });

    const { nombre, apellido, email, telefono, tipoDeVivienda, nombreDeVivienda, numeroDeVivienda, yaTieneServicio, calificacion, calificacionCalidadPrecio, loRemplazaria, loAdquiriria, loRecomendaria } = inputValues

    const formik = useFormik({
        initialValues: {
            nombre,
            apellido,
            email,
            telefono,
            tipoDeVivienda,
            nombreDeVivienda, numeroDeVivienda,
            yaTieneServicio, calificacion, calificacionCalidadPrecio, loRemplazaria, loAdquiriria, loRecomendaria
        },
        validationSchema: RegisterSchema,
        onSubmit: () => {
            handleChange(values)
            nextStep();
        },
    });

    const FormObserver = () => {
        const {
            values: { tipoDeVivienda, yaTieneServicio },
            touched,
        } = useFormikContext();

        useEffect(() => {
            switch (yaTieneServicio.trim()) {
                case 'true':
                    console.log(yaTieneServicio)
                    SetSiTieneServicio(true)
                    break
                case 'false':
                    SetSiTieneServicio(false)
                    break
                default:
                    break
            }
        }, [yaTieneServicio, touched.yaTieneServicio]);

        useEffect(() => {
            if (touched.tipoDeVivienda && tipoDeVivienda.trim() !== '') {
                switch (tipoDeVivienda) {
                    case 'edificio':
                        SetSelecciono(true)
                        break;
                    case 'villa':
                        SetSelecciono(true)
                        break;
                    default:
                        break;
                }
            }

        }, [tipoDeVivienda, touched.tipoDeVivienda,]);

        useEffect(() => {
            if (yaTieneServicio.trim() === 'true' && touched.yaTieneServicio) {
                console.log(yaTieneServicio)
                SetSiTieneServicio(true)
            } else if (yaTieneServicio.trim() === 'false' && touched.yaTieneServicio) {
                SetSiTieneServicio(false)
            }
        }, [touched.yaTieneServicio, yaTieneServicio]);
        return null;
    }


    const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate>
                <Stack spacing={3} direction={"column"}>
                    <Typography variant='subtitle1' > Ingrese los detalles del cliente </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            {...getFieldProps('nombre')}
                            error={Boolean(touched.nombre && errors.nombre)}
                            helperText={touched.nombre && errors.nombre}
                        />
                        <TextField
                            fullWidth
                            label="Apellido"
                            {...getFieldProps('apellido')}
                            error={Boolean(touched.apellido && errors.apellido)}
                            helperText={touched.apellido && errors.apellido}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            fullWidth
                            type="email"
                            label="Dirección de correo"
                            {...getFieldProps('email')}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                        />

                        <TextField
                            fullWidth
                            id='telefono'
                            label="Número de teléfono"
                            {...getFieldProps('telefono')}
                            error={Boolean(touched.telefono && errors.telefono)}
                            helperText={touched.telefono && errors.telefono}
                        />
                    </Stack>
                    {/* <Stack direction={{ md: 'column', lg: 'row' }} spacing={2}> */}

                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label">
                            <Typography>Tipo de Vivienda</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={tipoDeVivienda}

                            label='Tipo de Vivienda'
                            {...getFieldProps('tipoDeVivienda')}
                            error={Boolean(touched.tipoDeVivienda && errors.tipoDeVivienda)}

                        >
                            <MenuItem value={'casa'}>Casa Particular</MenuItem>
                            <MenuItem value={'villa'}>Villa</MenuItem>
                            <MenuItem value={'edificio'}>Edificio</MenuItem>
                        </Select>
                        <FormHelperText>{touched.tipoDeVivienda && errors.tipoDeVivienda}</FormHelperText>
                    </FormControl>

                    {selecciono && (
                        <TextField
                            fullWidth
                            id='nombreDeVivienda'
                            label={"Nombre del edificio o villa"}
                            {...getFieldProps('nombreDeVivienda')}
                            error={Boolean(touched.nombreDeVivienda && errors.nombreDeVivienda)}
                            helperText={touched.nombreDeVivienda && errors.nombreDeVivienda}
                        />
                    )}

                    <TextField
                        fullWidth
                        id='numeroDeVivienda'
                        label={"Número de la casa o apartamento"}
                        {...getFieldProps('numeroDeVivienda')}
                        error={Boolean(touched.numeroDeVivienda && errors.numeroDeVivienda)}
                        helperText={touched.numeroDeVivienda && errors.numeroDeVivienda}
                    />

                    {/* pregunta1 */}
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label">
                            <Typography>{questions[0].question}</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={yaTieneServicio}
                            autoWidth
                            label={questions[0].question}
                            {...getFieldProps('yaTieneServicio')}
                            error={Boolean(touched.yaTieneServicio && errors.yaTieneServicio)}
                        >
                            <MenuItem value={'true'}>Si</MenuItem>
                            <MenuItem value={'false'}>No</MenuItem>
                        </Select>
                        <FormHelperText>{touched.yaTieneServicio && errors.yaTieneServicio}</FormHelperText>
                    </FormControl>

                    {siTieneServicio && (
                        <Stack direction={"column"} spacing={2}>
                            {/* pregunta 2 */}
                            < FormControl sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">
                                    <Typography>{questions[1].question}</Typography>
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={calificacion}
                                    autoWidth
                                    label={<Typography>{questions[1].question}</Typography>}
                                    {...getFieldProps('calificacion')}
                                    error={Boolean(touched.calificacion && errors.calificacion)}
                                >
                                    {questions[1].choices.map((choice, index) => {
                                        const key = index
                                        return (
                                            <MenuItem key={key} value={choice}>{choice}</MenuItem>
                                        )

                                    })}
                                </Select>
                                <FormHelperText>{touched.calificacion && errors.calificacion}</FormHelperText>
                            </FormControl>

                            {/* pregunta 3 */}
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">
                                    <Typography>{questions[2].question}</Typography>
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={calificacionCalidadPrecio}
                                    autoWidth
                                    label={<Typography>{questions[2].question}</Typography>}
                                    {...getFieldProps('calificacionCalidadPrecio')}
                                    error={Boolean(touched.calificacionCalidadPrecio && errors.calificacionCalidadPrecio)}
                                >
                                    {questions[2].choices.map((choice, index) => {
                                        const key = index
                                        return (
                                            <MenuItem key={key} value={choice}>{choice}</MenuItem>
                                        )

                                    })}
                                </Select>
                                <FormHelperText>{touched.calificacionCalidadPrecio && errors.calificacionCalidadPrecio}</FormHelperText>
                            </FormControl>

                            {/* pregunta 4 */}
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-helper-label">
                                    <Typography>{questions[3].question}</Typography>
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={loRemplazaria}
                                    autoWidth
                                    label={<Typography>{questions[3].question}</Typography>}
                                    {...getFieldProps('loRemplazaria')}
                                    error={Boolean(touched.loRemplazaria && errors.loRemplazaria)}
                                >
                                    {theSameChoices.map((choice, index) => {
                                        const key = index
                                        return (
                                            <MenuItem key={key} value={choice}>{choice}</MenuItem>
                                        )

                                    })}
                                </Select>
                                <FormHelperText>{touched.loRemplazaria && errors.loRemplazaria}</FormHelperText>
                            </FormControl>
                        </Stack>
                    )

                    }


                    {/* pregunta 5 */}
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label">
                            <Typography>{questions[4].question}</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={loAdquiriria}
                            autoWidth
                            label={<Typography>{questions[4].question}</Typography>}
                            {...getFieldProps('loAdquiriria')}
                            error={Boolean(touched.loAdquiriria && errors.loAdquiriria)}
                        >
                            {theSameChoices.map((choice, index) => {
                                const key = index
                                return (
                                    <MenuItem key={key} value={choice}>{choice}</MenuItem>
                                )

                            })}
                        </Select>
                        <FormHelperText>{touched.loAdquiriria && errors.loAdquiriria}</FormHelperText>
                    </FormControl>

                    {/* pregunta 6 */}
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label">
                            <Typography>{questions[5].question}</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={loRecomendaria}
                            autoWidth
                            label={<Typography>{questions[3].question}</Typography>}
                            {...getFieldProps('loRecomendaria')}
                            error={Boolean(touched.loRecomendaria && errors.loRecomendaria)}
                        >
                            {theSameChoices.map((choice, index) => {
                                const key = index
                                return (
                                    <MenuItem key={key} value={choice}>{choice}</MenuItem>
                                )

                            })}
                        </Select>
                        <FormHelperText>{touched.loRecomendaria && errors.loRecomendaria}</FormHelperText>
                    </FormControl>

                    {/* </Stack> */}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            onClick={handleSubmit}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}>
                            <Typography variant='button'>SIGUIENTE</Typography>
                        </Button>
                    </Stack>
                </Stack>
                <FormObserver />
            </Form>
        </FormikProvider >
    );
}

ClientForm.propTypes = {
    prevStep: PropTypes.func,
    nextStep: PropTypes.func,
    handleChange: PropTypes.func,
    inputValues: PropTypes.object
};


export default ClientForm;