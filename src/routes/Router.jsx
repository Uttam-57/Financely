import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";

import { Routes } from "@/routes/routes";
import AppLayout from "@/shared/layout/AppLayout";
import ErrorBoundry from "@/shared/utils/ErrorBoundry";
import AuthLayout from "@/shared/layout/AuthLayout";

const DashboardPage = lazy(() => import('@/pages/DashbordPage'));
const SignUpPage = lazy(()=> import ('@/pages/Auth/SignUpPage'));
const SignInPage = lazy(()=> import ('@/pages/Auth/SignInPage'));
const ForgotPasswordPage = lazy(()=> import("@/pages/Auth/ForgotPasswordPage"));
const NotFoundPage = lazy(()=> import("@/pages/NotFoundPage"))
function ProtectedRoute() {
    const { user, status } = useSelector((state) => state.auth);
    const location = useLocation();

    if (status === "checking" || status === "") {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to={Routes.SIGNIN} replace state={{ from: location }} />;
}
function GuestRoute() {
    const { user, status } = useSelector((state) => state.auth);

    if (status === "checking" || status === "") {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return user ? <Navigate to={Routes.DASHBOARD} replace /> : <Outlet />;
}


const Router = createBrowserRouter([
    {
        element:<ProtectedRoute />,
        errorElement: <ErrorBoundry />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {path: Routes.HOME, element: <DashboardPage />},
                    {path: Routes.DASHBOARD, element: <DashboardPage />},
                ],
            },

        ],
    },
    {
        element: <GuestRoute />,
        errorElement: <ErrorBoundry />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {path: Routes.SIGNIN, element: <SignInPage />},
                    {path: Routes.SIGNUP, element: <SignUpPage />},
                    {path: Routes.FORGOT_PASS, element: <ForgotPasswordPage />}
                ],
            },
        ]
    },
    {
        path: Routes.NOT_FOUND,
        element: (
            <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading...</div>}>
                <NotFoundPage />
            </Suspense>
        ),
    },
])

export default function AppRouter(){
    return <RouterProvider router={Router} />
}