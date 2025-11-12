import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CarList from "./components/CarList";
import SoldCarList from "./components/SoldCarList";
import AddCar from "./components/AddCar";
import EditCar from "./components/EditCar";
import AddExpense from "./components/AddExpense";
import Footer from "./components/Footer";

// import { useLocation } from "react-router-dom";

function App() {
  // const token = localStorage.getItem("token");
  // const location = useLocation();
  // const hideNavbar = ["/login", "/register"].includes(location.pathname);
  return (
    <Router>
      <Navbar />
      <Footer />
      <div className="container mt-4">
        <Routes>
          {/* Keep path="/" but render conditionally */}
          {/* <Route path="/" element={token ? <Dashboard /> : <Login />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/dashbord" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/add" element={<AddCar />} />
          <Route path="/cars/edit/:id" element={<EditCar />} />
          <Route path="/cars/:id/expenses" element={<AddExpense />} />
          <Route path="/soldcars" element={<SoldCarList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
