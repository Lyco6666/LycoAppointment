import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, Alert, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "../../App";
import { useNavigate } from "react-router-dom";

const AppointmentForm = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const validationSchema = Yup.object({
        date: Yup.date().required("Date is required"),
        time: Yup.string().required("Time is required"),
        purpose: Yup.string().min(5, "Purpose must be at least 5 characters").required("Purpose is required"),
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const formik = useFormik({
        initialValues: { date: "", time: "", purpose: "" },
        validationSchema,
        onSubmit: async (values) => handleAppointment(values),
    });

    const handleAppointment = async (values) => {
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            await axios.post("http://localhost:5000/api/appointments/book", values, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setMessage({ text: "Appointment successfully scheduled!", type: "success" });
            setTimeout(() => navigate("/customer"), 1000);
            formik.resetForm();
        } catch (error) {
            setMessage({ text: "Failed to schedule appointment. Please try again.", type: "error" });
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
                Schedule Appointment
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                {message.text && (
                    <Alert severity={message.type} sx={{ mb: 2 }}>
                        {message.text}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    name="date"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.date && Boolean(formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Time"
                    type="time"
                    name="time"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.time && Boolean(formik.errors.time)}
                    helperText={formik.touched.time && formik.errors.time}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Purpose"
                    name="purpose"
                    multiline
                    rows={3}
                    value={formik.values.purpose}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.purpose && Boolean(formik.errors.purpose)}
                    helperText={formik.touched.purpose && formik.errors.purpose}
                    margin="normal"
                    required
                />

                <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Book Appointment"}
                </Button>
            </form>
        </Box>
    );
};

export default AppointmentForm;
