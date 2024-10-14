import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, TextField, CircularProgress, IconButton, InputAdornment, Alert } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/RegistrationForm.css";

// Validation Schema for Registration
const registrationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required")
});

function RegistrationForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="register-form">
      <div className="form-container">
        <h1>Registration Form</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={registrationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await axios.post(
                "http://localhost:4000/api/auth/register",
                values
              );
              setSuccess('Registration successful');
              setTimeout(() => navigate("/login"), 1000); 
            } catch (err) {
              setError('Registration failed: ' + (err.response ? err.response.data.error : err.message));
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
                  helperText={<ErrorMessage name="email" />}
                  error={!!<ErrorMessage name="email" />}
                  autoComplete="off"
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
                  error={!!<ErrorMessage name="password" />}
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
                  autoComplete="off"
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
                Register
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outlined"
                color="secondary"
                fullWidth
                style={{ marginTop: "8px" ,textTransform:"initial"}}
              >
                Already have an acoount? 
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RegistrationForm;