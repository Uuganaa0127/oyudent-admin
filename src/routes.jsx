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
import { News } from "@/pages/news";
import {HrWorker,HrAdmin} from "@/pages/hrTime"
// import { Test } from "@/pages/test";
const icon = {
  className: "w-5 h-5 text-inherit",
};

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
      
        role == 1? 
         ({
              icon: <InformationCircleIcon {...icon} />,
              name: "Time",
              path: "/hrTime",
              element: <HrWorker />,
         })
          : ({
              icon: <InformationCircleIcon {...icon} />,
              name: "Time",
              path: "/hrTime",
              element: <HrAdmin />,
            }),
    
      {
        icon: <ServerStackIcon {...icon} />,
      name: "test",
      path: "/test",
      element: <Test />,
    }
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
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
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
