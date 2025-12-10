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
import UsersManagement from "../Pages/DashBoard/UserManagement";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import ApproveTutors from "../Pages/DashBoard/ApproveTutors";
import ApproveTuition from "../Pages/DashBoard/ApproveTuition";
import MyApplications from "../Pages/DashBoard/MyApplications";
import Error from "../Pages/Error";
import DashboardHome from "../Pages/DashBoard/DashboardHome/DashboardHome";
import ProfileSetting from "../Pages/DashBoard/ProfileSetting/ProfileSetting";
import TuitionsManagement from "../Pages/DashBoard/TuitionsManagement";
import TutorOngoingTuitions from "../Pages/DashBoard/TutorOngoingTuitions";
import PaymentHistory from "../Pages/PaymentHistory";
import PaymentSuccess from "../Pages/PaymentSuccess";
import PaymentCancelled from "../Pages/PaymentCancelled";
import RevenueHistory from "../Pages/RevenueHistory";
import TutorRoute from "./TutorRoute";

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
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),

    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "my_tuitions",
        element: <MyTuition></MyTuition>,
      },
      {
        path: "post_tuition",
        element: <PostTuition />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled />,
      },

      {
        path: "payment-history",
        Component: PaymentHistory,
      },
      {
        path: "tuitions-management",
        element: <TuitionsManagement></TuitionsManagement>,
      },
      
      //tutor

      {
        path: "my-applications",
        element: (
          <TutorRoute>
            <MyApplications></MyApplications>
          </TutorRoute>
        ),
      },
      {
        path: "ongoing-tuitions",
        element: (
          <TutorRoute>
            <TutorOngoingTuitions></TutorOngoingTuitions>
          </TutorRoute>
        ),
      },

      {
        path: "be-a-tutor",
        element: (
          <TutorRoute>
            <BeATutor></BeATutor>
          </TutorRoute>
        ),
      },

      {
        path: "revenue-history",
        element: (
          <TutorRoute>
            <RevenueHistory></RevenueHistory>
          </TutorRoute>
        ),
      },

      //admin
      {
        path: "approve-tutors",
        element: (
          <AdminRoute>
            <ApproveTutors></ApproveTutors>
          </AdminRoute>
        ),
      },
      {
        path: "approve-tuitions",
        element: (
          <AdminRoute>
            <ApproveTuition></ApproveTuition>
          </AdminRoute>
        ),
      },
      {
        path: "users-management",
        element: (
          <AdminRoute>
            <UsersManagement></UsersManagement>
          </AdminRoute>
        ),
      },
      {
        path: "profile-setting",
        element: <ProfileSetting></ProfileSetting>,
      },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
]);
