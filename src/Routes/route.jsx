import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import Tutors from "../Pages/Tutor/Tutors";
import Tuitions from "../Pages/Tuitions/Tuitions";
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import DashboardLayout from "../Layouts/DashboardLayout";
import PostTuition from "../Pages/DashBoard/PostTuition";
import BeATutor from "../Pages/DashBoard/BeATutor";
import MyTuition from "../Pages/DashBoard/MyTuition";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <Register></Register>,
      },
      {
        path: "tutors",
        element: <Tutors></Tutors>,
      },
      {
        path: "tuitions",
        element: <Tuitions></Tuitions>,
      },
      {
        path: "about",
        element: <About></About>,
      },
      {
        path: "contact",
        element: <Contact></Contact>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "post_tuition",
        element: <PostTuition />,
      },
      {
        path: "be-a-tutor",
        element: <BeATutor></BeATutor>,
      },
      {
        path: "my_tuitions",
        element: <MyTuition></MyTuition>,
      },
    ],
  },
]);
