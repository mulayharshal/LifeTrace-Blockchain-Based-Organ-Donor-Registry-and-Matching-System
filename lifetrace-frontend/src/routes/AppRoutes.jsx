import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DonorDashboard from "../pages/DonorDashboard";
import HospitalDashboard from "../pages/HospitalDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import DonorProfile from "../pages/DonorProfile";
import DonorConsent from "../pages/DonorConsent";
import RegisterOrgan from "../pages/RegisterOrgan";
import RegisterRecipient from "../pages/RegisterRecipient";
import ViewRecipients from "../pages/ViewRecipients";
import ViewOrgans from "../pages/ViewOrgans";
import CreateHospitalProfile from "../pages/CreateHospitalProfile";



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/donor"
        element={
          <ProtectedRoute allowedRoles={["ROLE_DONOR"]}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospital"
        element={
          <ProtectedRoute allowedRoles={["ROLE_HOSPITAL"]}>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/donor/profile"
  element={
    <ProtectedRoute allowedRoles={["ROLE_DONOR"]}>
      <DonorProfile />
    </ProtectedRoute>
  }
/>

<Route
  path="/donor/consent"
  element={
    <ProtectedRoute allowedRoles={["ROLE_DONOR"]}>
      <DonorConsent />
    </ProtectedRoute>
  }
/>

      <Route
  path="/hospital/register-organs/:donorId"
  element={
    <ProtectedRoute allowedRoles={["ROLE_HOSPITAL"]}>
      <RegisterOrgan />
    </ProtectedRoute>
  }
/>


      <Route
  path="/hospital/register-recipient"
  element={
    <ProtectedRoute allowedRoles={["ROLE_HOSPITAL"]}>
      <RegisterRecipient />
    </ProtectedRoute>
  }
/>


    <Route
  path="/hospital/recipients"
  element={
    <ProtectedRoute allowedRoles={["ROLE_HOSPITAL"]}>
      <ViewRecipients />
    </ProtectedRoute>
  }
/>


  <Route
  path="/hospital/organs"
  element={
    <ProtectedRoute allowedRoles={["ROLE_HOSPITAL"]}>
      <ViewOrgans />
    </ProtectedRoute>
  }
/>

<Route
  path="/hospital/create-profile"
  element={
    <ProtectedRoute allowedRoles={["ROLE_HOSPITAL"]}>
      <CreateHospitalProfile  />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
};

export default AppRoutes;
