import React, { useContext, useState } from "react";
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, TextField, CircularProgress, IconButton, InputAdornment, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import "./css/LoginForm.css";

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required")
  });

  return (
    <div className="login-form">
      <div className="form-container">
        <h1>Login Form</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await login(values);
              
              // Store the email in session storage
              sessionStorage.setItem('userEmail', values.email); 
              
              setSuccess('Login successful');
              console.log('yes success');
              setTimeout(() => navigate('/courses'), 1000);  // Redirect after success
            } catch (err) {
              setError('Login failed: ' + (err.response ? err.response.data.error : err.message));
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              <div>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  fullWidth
                  margin="normal"
                  autoComplete="off" // Hide autocomplete suggestions
                  helperText={<ErrorMessage name="email" />}
                  error={!!(<ErrorMessage name="email" />)}
                />
              </div>
              <div>
                <Field
                  name="password"
                  as={TextField}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="password" />}
                  error={!!(<ErrorMessage name="password" />)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                startIcon={isSubmitting && <CircularProgress size={24} style={{ color: "#ff5733" }} />}
                color="secondary"
                fullWidth
                style={{ position: "relative" }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/register")}
                variant="outlined"
                color="primary"
                fullWidth
                style={{ marginTop: "8px" }}
              >
                Back to Register
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
