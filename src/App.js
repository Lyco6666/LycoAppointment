import React, { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./components/LogIn/LogIn";
import Register from "./components/Register/Register";
import PrivateRoute from "./components/PrivateRoute/PrivateRouter";
import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";
// import { motion } from "framer-motion";
import CustomerDashboard from "./components/CustomerDashboard/CustomerDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import AppointmentForm from "./components/AppointmentForm/AppointmnetForm";
import DownloadPass from "./components/DownloadPass/DownloadPass";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = window.innerWidth < 768;

  const handleLogout = async () => {
    setUser(null);
    await signOut(auth);
  };

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await axios.post("http://localhost:5000/api/auth/login", {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });

          const fetchedUser = response.data.user;
          if (fetchedUser) {
            setUser(fetchedUser);
          }
        } catch (error) {
          console.error("Auth Error:", error);
          handleLogout();
        }
      } else {
        handleLogout();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout, isMobile }}>
      <Box
        className="App"
        sx={{
          display: isMobile ? "block" : "flex",
          justifyContent: "center",
          minHeight: "100vh",
          alignItems: "center",
          background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
          pt: isMobile ? 5 : 0,
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" />} />
            <Route
              path="/login"
              element={user ? <Navigate to={`/${user.role}`} /> : <LogIn />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to={`/${user.role}`} /> : <Register />}
            />

            <Route element={<PrivateRoute role="customer" />}>
              <Route path="/customer" element={<CustomerDashboard />} />
              <Route path="/create-appointment" element={<AppointmentForm />} />
            </Route>

            <Route element={<PrivateRoute role="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route
              path="/download/:id"
              element={<DownloadPass />}
            />
            <Route path="*" element={<div>NOT FOUND</div>} />
          </Routes>
        </Router>
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Box
            elevation={5}
            sx={{
              padding: 4,
              borderRadius: 3,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
              background: "white",
              textAlign: "center",
            }}
          >
            
          </Box>
        </motion.div> */}
      </Box>
    </AuthContext.Provider>
  );
}

export default App;
