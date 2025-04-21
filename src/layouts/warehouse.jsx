import { Route, Routes } from "react-router-dom";
import { Cog6ToothIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";

import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useState } from "react";
import { WarehousePage } from "@/pages/inventory";
import CourseParticipants from "@/pages/course/courseParticipants";
import {WarehouseDetailPage} from "@/pages/inventory";

export function Warehouse() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [collapsed, setCollapsed] = useState(false); // for optional collapse toggle

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        collapsed={collapsed}
        brandImg={
          sidenavType === "gray" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />

      {/* Adjust margin when sidebar is collapsed */}
      <div className={`p-4 transition-all duration-300 ${collapsed ? "xl:ml-20" : "xl:ml-80"}`}>
        <DashboardNavbar />

        {/* Optional sidebar collapse toggle */}
        <IconButton
          size="md"
          color="white"
          className="fixed top-6 left-6 z-50 hidden xl:inline-flex shadow-md"
          ripple={false}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Bars3Icon className="h-5 w-5 text-blue-gray-700" />
        </IconButton>

        {/* Configurator icon */}
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        {/* Route section for Warehouse */}
        <Routes>
        <Route path="details/:id" element={<WarehouseDetailPage />} />

          {routes.map(
           ({ layout, pages }) =>
             layout === "warehouse" && // ✅ use "warehouse" here
             pages.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
         ))
  )}
</Routes>


        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Warehouse.displayName = "/src/layout/warehouse.jsx";

export default Warehouse;
