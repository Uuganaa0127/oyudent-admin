import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";

import { CreateNews } from "../pages/news";
import CourseParticipants from "@/pages/course/courseParticipants";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useState } from "react";
import { WarehousePage } from "@/pages/inventory";
import { Test } from "@/pages/dashboard";
import { WarehouseDetailPage } from "@/pages/inventory";
import  { HrOfficeWorkers } from "@/pages/hrTime/hrOfficeWorkers";
// import { CourseParticipants } from "../pages/course";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  return (
    
    <div className="min-h-screen bg-blue-gray-50/50">
      
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "gray" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, false)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        <Routes>
      <Route path="/news/createNews"  element= {<CreateNews/>} />
      <Route path="/course/CourseParticipants/:courseId" element={<CourseParticipants />} />
      <Route path="/warehouse/warehousePage"  element= {<WarehousePage/>} />
      <Route path="/warehouse/details/:id" element={<WarehouseDetailPage />} />
      <Route path="/hrTime/HrOfficeWorkers/:id" element={<HrOfficeWorkers />} />
      

      {/* <Route path="/test/Test" element={<Test />} /> */}


          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
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

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
