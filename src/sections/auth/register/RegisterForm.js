import axios from 'axios';
import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [serverError, setServerError] = useState(false);

  const [serverErrorMessage, setServerErrorMessage] = useState('')

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
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      registerUser();
    },
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;

  const registerUser = async () => {
    const user = {
      email: values.email.toLowerCase(),
      password: values.password,
      nombre: values.nombre,
      apellido: values.apellido,
      telefono: values.telefono,
      esAdmin: false
    }
    try {
      const response = await axios.post("https://potenciales.herokuapp.com/api/auth/register", user, {
        withCredentials: true
      });
      if (response.data.token) {
        localStorage.setItem("vendedor", values.email)
        localStorage.setItem("token", response.token)
        navigate('/dashboard/app', { replace: true })
      }
    } catch (err) {
      formik.setSubmitting(false)
      if (err.response.status === 409) {
        formik.setErrors({ email: 'Este usuario ya existe' })
      }
      else if (err?.code === "ERR_NETWORK") {
        setServerErrorMessage(err.message);
        setServerError(true)
      }
      else {
        setServerErrorMessage("Los datos ingresados no son válidos");
        setServerError(true)
      }
    }
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {serverError && (
            <Typography sx={{ color: 'red', mb: 0.1 }}>
              {serverErrorMessage}
            </Typography>
          )}
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

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Contraseña"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Registrarse
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
