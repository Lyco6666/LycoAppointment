import React, { useEffect, useState } from "react";
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, useMediaQuery, TablePagination
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../App";

const CustomerDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();
    const { handleLogout, user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/appointments/my-appointments", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setAppointments(response.data || []);
            } catch (error) {
                console.error("Fetch Appointments Error:", error);
            }
        };

        fetchAppointments();
    }, [user]);

    const handleBookAppointment = () => {
        navigate("/create-appointment");
    };

    const handleDownloadPass = (appointment) => {
        navigate(`/download/${appointment.id}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                gap: isMobile ? 4 : 2,
                mt: isMobile ? 4 : 0,
                minHeight: isMobile ? "100vh" : "auto",
            }}
        >
            <Typography variant="h5" color="secondary" gutterBottom mt={2} mb={4}>
                Customer Dashboard
            </Typography>

            <Box sx={{
                display: "flex",
                flexDirection: isMobile ? "column-reverse" : "column",
                justifyContent: "space-between", mb: 1, gap: isMobile ? 4 : 3
            }}>
                <Box display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent="space-between"
                    alignItems="center" gap={2} mb={2}>
                    <Button variant="contained"
                        color="primary" fullWidth={isMobile}
                        onClick={handleBookAppointment}
                    >
                        Book Appointment
                    </Button>
                    <Button variant="contained" color="secondary" fullWidth={isMobile} onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>

                {appointments.length > 0 ? (
                    <Box>
                        <TableContainer component={Paper}
                            sx={{
                                maxWidth: "100%", overflowX: "auto",
                                borderRadius: 2,
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
                            }}>
                            <Table size={isMobile ? "small" : "medium"}>
                                <TableHead sx={{ backgroundColor: theme.palette.secondary.main }}>
                                    <TableRow>
                                        {["Appointment ID", "Date", "Time", "Status", "Pass Download"].map((header) => (
                                            <TableCell
                                                key={header}
                                                sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
                                            >
                                                {header}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment, index) => (
                                        <TableRow
                                            key={appointment.id}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                                                transition: "background-color 0.3s",
                                                "&:hover": { backgroundColor: "#e3f2fd" },
                                            }}
                                        >
                                            <TableCell sx={{ textAlign: "center" }}>{appointment.id}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                {appointment.date ? new Date(appointment.date).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }) : ''}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                {appointment.time ? new Date(`1970-01-01T${appointment.time}`).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                }) : ''}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: "bold",
                                                        color:
                                                            appointment.status === "scheduled"
                                                                ? "blue"
                                                                : appointment.status === "completed"
                                                                    ? "green"
                                                                    : "red",
                                                    }}
                                                >
                                                    {appointment.status.toUpperCase()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    disabled={appointment.status !== "scheduled"}
                                                    onClick={() => handleDownloadPass(appointment)}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Download Pass
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={appointments.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                            labelRowsPerPage={isMobile ? "Rows" : "Rows per page"}
                        />
                    </Box>
                ) : (
                    <Typography variant="h6" sx={{ mt: 4 }}>
                        No Appointments
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default CustomerDashboard;
