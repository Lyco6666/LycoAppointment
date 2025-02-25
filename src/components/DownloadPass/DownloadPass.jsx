import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Paper, Typography, Button, useMediaQuery, Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import axios from "axios";
import { useAuth } from "../../App";

const AppointmentPass = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const contentRef = useRef();

    const [appointment, setAppointment] = useState({});

    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/appointments/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                setAppointment(response.data || {});
            } catch (error) {
                console.error("Fetch Appointment Error:", error);
            }
        };
        fetchAppointment();
    }, [id, user]);

    const handleDownload = async () => {
        const content = contentRef.current;

        const widthPx = content.offsetWidth;
        const heightPx = content.offsetHeight;

        const widthMm = widthPx * 0.264583;
        const heightMm = heightPx * 0.264583;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [widthMm, heightMm],
        });

        const canvas = await html2canvas(content, {
            scale: 2,
            useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 0, 0, widthMm, heightMm);
        doc.save(`Appointment_Pass_${id}.pdf`);
    };


    return (
        <Box
            sx={{
                p: isMobile ? 2 : 3,
                borderRadius: 3,
                boxShadow: isMobile ? "" : "0px 4px 20px rgba(0,0,0,0.1)",
                background: isMobile ? "" : "#f0f4f8",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: isMobile ? 4 : 2,
                mt: isMobile ? 3 : 0,
                minHeight: isMobile ? "100vh" : "auto",
            }}
        >
            <Paper
                elevation={10}
                ref={contentRef}
                sx={{
                    padding: 3,
                    borderRadius: 3,
                    width: "15rem",
                    height: "21rem",
                    background: "linear-gradient(135deg, #4a90e2, #50e3c2)",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        letterSpacing: 1,
                        mb: 2,
                        textTransform: "uppercase",
                    }}
                    color="secondary"
                >
                    Appointment Pass
                </Typography>
                <Typography >Welcome To Lycoris...</Typography>
                <PeopleOutlinedIcon
                    sx={{ fontSize: "6rem", color: "secondary.main" }}
                />
                <Divider sx={{ bgcolor: "rgba(255,255,255,0.5)", width: "80%", mb: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1 }} >
                    <strong>Name:</strong> {appointment.name}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    <strong>Date:</strong> {appointment.date ? new Date(appointment.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }) : ''}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    <strong>Time:</strong> {appointment.time ? new Date(`1970-01-01T${appointment.time}`).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }) : ''}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    <strong>Purpose:</strong> {appointment.purpose}
                </Typography>
                <Divider sx={{ bgcolor: "rgba(255,255,255,0.5)", width: "80%", mt: 2 }} />
                <Typography variant="caption" sx={{ mt: 2 }}>
                    ID: {id}
                </Typography>
            </Paper>

            <Button
                variant="contained"
                color="secondary"
                onClick={handleDownload}
                size="medium"
                sx={{
                    borderRadius: 2,
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                    textTransform: "uppercase",
                }}
            >
                Download Pass
            </Button>
        </Box>
    );
};

export default AppointmentPass;
