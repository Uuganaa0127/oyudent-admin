import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
// import CourseParticipants from "@/pages/course/CourseParticipants";

// import { CreateNews } from "./pages/news";
// import { Test } from "./pages/test";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      {/* <Route path="/course-participants/:courseId" element={<CourseParticipants />} /> */}
      {/* <Route path="/dashboard/news/createNews"  element= {<CreateNews/>} /> */}
      {/* <Route path="/test/*" element={<Test />} /> */}
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
