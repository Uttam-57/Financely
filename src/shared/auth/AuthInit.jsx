// src/components/AuthInit.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authLogin, authLogout } from "@/features/auth/authSlice";
import { watchAuthState } from "@/hooks/firebase";

export default function AuthInit({ children }) {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = watchAuthState(
      (activeUser) => {
        if (!activeUser) {
          dispatch(authLogout());
          return;
        }

        // Pass strictly essential fields to prevent sensitive credentials from ever reaching action payloads
        dispatch(
          authLogin({
            uid: activeUser.uid,
            email: activeUser.email,
            displayName: activeUser.displayName,
            photoURL: activeUser.photoURL,
          })
        );
      },
      () => {
        dispatch(authLogout());
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  // Gate the application while verifying the session status
  if (status === "checking" || status === "") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-base">
        <p className="text-sm font-medium text-slate-600">Verifying session...</p>
      </div>
    );
  }

  // Once resolved, render the router/children
  return children;
}