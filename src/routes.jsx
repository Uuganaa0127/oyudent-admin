import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications,Test} from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { News  ,CreateNews } from "@/pages/news";
import { Course, CourseParticipants }from "@/pages/course"
import { HrAdmin } from "@/pages/hrTime"
import Banner from "./pages/banner/banner";
import { BrandsPage } from "@/pages/brands"
import { apiService } from "./apiService/apiService";
import { jwtDecode } from "jwt-decode";
import { CountryPage } from "@/pages/country/CountryPage"
import { WarehousePage, AddInventoryPage, ShowInvoicesPage } from "@/pages/inventory"
import UserList from "./pages/userList/userList";
import Logout from "./pages/auth/logout";
import AdminOrdersPage from "./pages/inventory/Order";

// import CreateNews from "./pages/homeController/newsCreate";
// import { Test } from "@/pages/test";
const icon = {
  className: "w-5 h-5 text-inherit",
};
const token = apiService.getTokenFromCookie()
if (token) {
  
  try {
    const decoded = jwtDecode(token);
    console.log(decoded,'decoded');
    // userRole = decoded.roles?.includes("admin") ? "admin" : "user"; // ✅ Determine role
  } catch (error) {
    console.error("Invalid token:", error);
  }
}
const role = true;
export const routes = [
  {
    title: "Dashboard",
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
        
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "News",
        path: "/news",
        element: <News />,
        
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "CreateNews",
      //   path: "/createNews",
      //   element: <CreateNews />,
      // },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "banner",
        path: "/banner",
        element: <Banner />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "BrandsPage",
        path: "/BrandsPage",
        element: <BrandsPage />,
        
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "CountryPage",
        path: "/CountryPage",
        element: <CountryPage />,
      },
        // !role == 1? 
        //  ({
        //       icon: <InformationCircleIcon {...icon} />,
        //       name: "Time",
        //       path: "/hrTime",
        //       element: <HrWorker />,
        //  })
        //   : (
            {
              icon: <InformationCircleIcon {...icon} />,
              name: "Time",
              path: "/hrTime",
              element: <HrAdmin />,
            },
            {
              icon: <InformationCircleIcon {...icon} />,
              name: "course",
              path: "/course",
              element: <Course />,
            },
            {
              icon: <InformationCircleIcon {...icon} />,
              name: "UserList",
              path: "/UserList",
              element: <UserList />,
            },
            // ),
      {
        icon: <ServerStackIcon {...icon} />,
      name: "test",
      path: "/test",
      element: <Test />,
    },
   
    ],
  },
  {
    title:"Warehouse",
    layout: "warehouse",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "WarehousePage",
        path: "/warehousePage",
        element: <WarehousePage />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "AddtoInventory",
        path: "/AddtoInventory",
        element: <AddInventoryPage />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "ShowInvoices",
        path: "/ShowInvoices",
        element: <ShowInvoicesPage />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Order",
        path: "/Order",
        element: <AdminOrdersPage />,
      },
    {
      icon: <RectangleStackIcon {...icon} />,
      name: "sign up",
      path: "/sign-up",
      element: <SignUp />,
    },
    
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Logout",
        path: "/logout",
        element: <Logout />,
      }
    ],
  }, 
];

export default routes;
