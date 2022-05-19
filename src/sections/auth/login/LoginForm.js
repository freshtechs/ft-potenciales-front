import axios from 'axios';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [serverError, setServerError] = useState(false);

  const [serverErrorMessage, setServerErrorMessage] = useState('')

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required('El campo email es obligatario')
      .email('El formato ingresado es incorrecto'),
    password: Yup.string()
      .required('El campo contraseña es obligatario')
      .min(6, 'La contraseña ingresada debe tener mínimo 6 carácteres')
      .max(40, 'La contraseña ingresada debe tener máximo 40 carácteres'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      login();
    },
  });

  const login = async () => {
    const body = {
      email: values.email.toLowerCase(),
      password: values.password,
    }
    try {
      const response = await axios.post("https://potenciales.herokuapp.com/api/auth/login", body, { withCredentials: true });
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("vendedor", values.email.toLowerCase())
      navigate('/dashboard/user', { replace: true })
    } catch (err) {
      formik.setSubmitting(false)
      setServerError(true)
      if (err?.code === "ERR_NETWORK") {
        setServerErrorMessage(err.message);
      } else {
        setServerErrorMessage("Los datos ingresados no son válidos");
      }
    }
  }

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mb: 4 }}>
          {serverError && (
            <Typography sx={{ color: 'red', mb: 0.1 }}>
              {serverErrorMessage}
            </Typography>
          )}
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
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Contraseña"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Iniciar Sesión
        </LoadingButton>
      </Form>
    </FormikProvider >
  );
}
