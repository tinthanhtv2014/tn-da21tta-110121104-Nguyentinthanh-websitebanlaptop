import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import "./App.css";

import GuardRoute from "./authentication/guardRoute";
// import Navbar from "./share-view/navbar";
import RouterView from "./web-view/router-view";

import UserRouter from "./user-view/router-user";

// import HeaderUser from "./user-view/components/headerUser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // nhớ import CSS luôn
import RouterAdmin from "./admin-view/router-admin";
import NavBarAdmin from "./admin-view/components/navBarAdmin";
import HeaderAdmin from "./admin-view/components/headerAdmin";

//user
import HeaderUser from "./web-view/components/headerUser";
import FooterUser from "./web-view/components/footerUser";
import Login from "./web-view/page/login";
import { Grid } from "@mui/material";

function App() {
  return (
    <div className="App">
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration={2000}
      >
        <Router>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/*" element={<MainLayout />} />
            <Route
              path="/admin/*"
              element={
                <GuardRoute>
                  <AdminLayout />
                </GuardRoute>
              }
            />
            {/* <Route path="/admin/*" element={<AdminLayout />} /> */}

            {/* <Route path="/profile/*" element={<RouterUser />} /> */}
            {/* <Route path="/admin/*" element={<RouterAdmin />} /> */}
          </Routes>
        </Router>{" "}
        <ToastContainer />
      </SnackbarProvider>
    </div>
  );
}

// Giao diện cơ bản
const MainLayout = () => (
  <>
    <HeaderUser />
    <Routes>
      <Route
        path="/*"
        element={<RouterView />}
        style={{ marginTop: "20px", marginBottom: "20px" }}
      />
    </Routes>
    <FooterUser />
  </>
);

const RouterUser = () => (
  <>
    {/* <HeaderUser /> */}
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={3} md={2.5}></Grid>
      <Grid item xs={9} md={9}>
        <Routes>
          <Route path="/*" element={<UserRouter />} />
        </Routes>
      </Grid>
    </Grid>
  </>
);

const AdminLayout = () => (
  <>
    <HeaderAdmin />

    <Grid container style={{ height: "100vh", marginTop: "64px" }}>
      <Grid item xs={3} md={2.5}>
        <NavBarAdmin />
      </Grid>
      <Grid item xs={9} md={9}>
        <Routes>
          <Route path="/*" element={<RouterAdmin />} />
        </Routes>
      </Grid>
    </Grid>
  </>
);

export default App;
