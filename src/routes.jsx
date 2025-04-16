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
import { Course }from "@/pages/course"
import {HrAdmin} from "@/pages/hrTime"
import Banner from "./pages/banner/banner";
import { apiService } from "./apiService/apiService";
import { jwtDecode } from "jwt-decode";
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
    userRole = decoded.roles?.includes("admin") ? "admin" : "user"; // ✅ Determine role
  } catch (error) {
    console.error("Invalid token:", error);
  }
}
const role = true;
export const routes = [
  {
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
            // ),
    
      {
        icon: <ServerStackIcon {...icon} />,
      name: "test",
      path: "/test",
      element: <Test />,
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
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
  
    
    ],
  },
  // {
  //   title: "test_pages",
  //   layout: "test",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "test",
  //       path: "/test",
  //       element: <Test />,
  //     },
    
    
  //   ],
  // },
 
];

export default routes;
