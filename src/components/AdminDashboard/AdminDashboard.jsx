import React, { useEffect, useState } from "react";
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, useMediaQuery, TablePagination, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../App";

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loadingId, setLoadingId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [updatedDate, setUpdatedDate] = useState("");
    const [updatedTime, setUpdatedTime] = useState("");

    const navigate = useNavigate();
    const { handleLogout, user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/appointments/all-appointments", {
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

    const handleDownloadPass = (appointment) => {
        navigate(`/download/${appointment.id}`);
    };

    const handleOpenModal = (appointment) => {
        setSelectedAppointment(appointment);
        setUpdatedDate(appointment.date);
        setUpdatedTime(appointment.time);
        setOpenModal(true);
    };

    const handleUpdate = async (id, status = "scheduled") => {
        try {
            setLoadingId(id);
            await axios.put(`http://localhost:5000/api/appointments/update-status`, {
                id: id,
                date: updatedDate,
                time: updatedTime,
                status: status,
            }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setAppointments((prev) => prev.map(app =>
                app.id === id ? { ...app, date: updatedDate, time: updatedTime, status: status } : app
            ));
            setOpenModal(false);
        } catch (error) {
            console.error("Update Error:", error);
        } finally {
            setLoadingId(null);
        }
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
            <Typography variant="h5" color="secondary" gutterBottom>
                Admin Dashboard
            </Typography>
            <Box sx={{
                display: "flex",
                flexDirection: isMobile ? "column-reverse" : "column",
                justifyContent: "space-between", mb: 1, gap: isMobile ? 4 : 3
            }}>
                <Box display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent="flex-end"
                    alignItems="center" gap={2} mb={2}>
                    <Button variant="contained" color="secondary"
                        fullWidth={isMobile} onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
                {appointments.length > 0 ? (
                    <Box>
                        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                            <Table size={isMobile ? "small" : "medium"}>
                                <TableHead sx={{ backgroundColor: theme.palette.secondary.main }}>
                                    <TableRow>
                                        {["Appointment ID", "Date", "Time", "Status", "Pass Download", "Operation"].map((header) => (
                                            <TableCell key={header} sx={{ color: "#fff", textAlign: "center" }}>
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
                                                    onClick={() => handleDownloadPass(appointment)}
                                                    disabled={appointment.status !== "scheduled"}
                                                >
                                                    Download Pass
                                                </Button>
                                            </TableCell>
                                            <TableCell
                                                sx={{ textAlign: "center", display: "flex", gap: 1, justifyContent: "center" }}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleOpenModal(appointment)}
                                                >
                                                    Update
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleUpdate(appointment.id, "canceled")}
                                                    disabled={appointment.status !== "scheduled"}
                                                >
                                                    {loadingId === appointment.id ? <CircularProgress size={20} /> : "Cancel"}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="success"
                                                    onClick={() => handleUpdate(appointment.id, "completed")}
                                                    disabled={appointment.status !== "scheduled"}
                                                >
                                                    {loadingId === appointment.id ? <CircularProgress size={20} /> : "Complete"}
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
                        />
                    </Box>
                ) : (
                    <Typography variant="h6">No Appointments</Typography>
                )}
            </Box>
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Update Appointment</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Date" type="date"
                        fullWidth margin="dense"
                        value={updatedDate} onChange={(e) => setUpdatedDate(e.target.value)}
                        InputLabelProps={{ shrink: true }} />
                    <TextField label="Time" type="time"
                        fullWidth margin="dense" value={updatedTime}
                        inputProps={{ step: 60 }}
                        onChange={(e) => setUpdatedTime(e.target.value)} InputLabelProps={{ shrink: true }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="error">Cancel</Button>
                    <Button onClick={() => handleUpdate(selectedAppointment.id, "scheduled")} variant="contained" color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDashboard;
