import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert, CircularProgress, Link, useMediaQuery, useTheme } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { auth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "../../config/firebase";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const validationSchema = Yup.object({
        name: Yup.string().min(3, "Must be at least 3 characters").required("Full Name is required"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
            .required("Phone number is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });

    const formik = useFormik({
        initialValues: { name: "", email: "", phoneNumber: "", password: "" },
        validationSchema,
        onSubmit: async (values) => handleRegister(values),
    });

    const handleRegister = async (values) => {
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: values.name });
            await sendEmailVerification(user);

            await axios.post("http://localhost:5000/api/auth/register", {
                uid: user.uid,
                name: values.name,
                email: values.email,
                phoneNumber: values.phoneNumber
            });

            setMessage({ text: "User registered! Check your email for verification.", type: "success" });
            formik.resetForm();
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setMessage({
                    text: "User already exists! Please login.",
                    type: "error",
                    login: true
                });
            } else {
                setMessage({ text: error.message, type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                padding: 4,
                borderRadius: 3,
                boxShadow: isMobile ? "" : "0px 4px 20px rgba(0,0,0,0.1)",
                background: isMobile ? "" : "#f0f4f8",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflowY: "auto",
                gap: isMobile ? 4 : 2,
                mt: isMobile ? 4 : 0,
                minHeight: isMobile ? "100vh" : "auto",
            }}
        >
            <Typography variant="h5" color="secondary" align="center" gutterBottom>
                Register
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
                Welcome To Lycoris...
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                {message.text && (
                    <Alert severity={message.type} sx={{
                        mb: 2,
                        fontSize: isMobile ? "0.7rem" : "1rem"
                    }}>
                        {message.text}
                    </Alert>
                )}
                <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    margin="normal"
                    required
                />

                <Button type="submit" variant="contained" color="secondary"
                    fullWidth sx={{ mt: 2 }} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Register"}
                </Button>
                <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Link
                        href="/login"
                        sx={{
                            textDecoration: "none",
                            color: "secondary.main",
                            fontSize: isMobile ? "0.7rem" : "1rem",
                        }}
                        variant="body2"
                    >
                        Already have an account? Login.
                    </Link>
                </Box>
            </form>
        </Box>
    );
};

export default Register;
