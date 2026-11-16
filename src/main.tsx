import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider } from "./app/Store";
import { Landing } from "./features/Landing";
import { Dashboard } from "./features/Dashboard";
import { Profile } from "./features/Profile";
import { AppLayout, ComingSoon } from "./layouts/AppLayout";
import "./styles/global.css";
function ScrollReset() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <StoreProvider>
        <ScrollReset />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:categoryId" element={<Profile />} />
            <Route path=":feature" element={<ComingSoon />} />
          </Route>
          <Route path="*" element={<ComingSoon missing />} />
        </Routes>
      </StoreProvider>
    </HashRouter>
  </React.StrictMode>,
);
