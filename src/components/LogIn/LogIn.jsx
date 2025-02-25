import React, { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Link,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
    auth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App";

const LogIn = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema,
        onSubmit: async (values) => handleLogin(values),
    });

    const handleLogin = async (values) => {
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            const user = userCredential.user;

            if (!user.emailVerified) {
                setMessage({
                    text: "Email not verified! Please verify your email.",
                    type: "error",
                });
                setLoading(false);
                return;
            }

            const response = await axios.post("http://localhost:5000/api/auth/login", {
                uid: user.uid,
                email: user.email,
            });

            setUser(response.data.user);
            setMessage({ text: "Login successful!", type: "success" });

            setTimeout(() => {
                if (response.data.user.role) {
                    navigate(response.data.user.role === "admin" ? "/admin" : "/customer");
                } else {
                    setMessage({ text: "User role not found.", type: "error" });
                }
            }, 1000);
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || error.message,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!formik.values.email) {
            setMessage({ text: "Please enter your email first.", type: "warning" });
            return;
        }
        try {
            await sendPasswordResetEmail(auth, formik.values.email);
            setMessage({
                text: "Password reset email sent successfully!",
                type: "success",
            });
        } catch (error) {
            setMessage({ text: error.message, type: "error" });
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
                LogIn
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
                Welcome To Lycoris...
            </Typography>

            <PeopleOutlinedIcon
                sx={{ fontSize: "6rem", color: "secondary.main" }}
            />

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
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    sx={{
                        color: "secondary.main",
                        cursor: "pointer",
                        fontSize: isMobile ? "0.7rem" : "1rem",
                    }}
                    mt={1}
                    onClick={handleForgotPassword}
                >
                    Forgot password?
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
                <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Link
                        href="/register"
                        sx={{
                            textDecoration: "none",
                            color: "secondary.main",
                            fontSize: isMobile ? "0.7rem" : "1rem",
                        }}
                        variant="body2"
                    >
                        Don't have an account? Register.
                    </Link>
                </Box>
            </form>
        </Box>
    );
};

export default LogIn;
