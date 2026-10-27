import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAdditionalUserInfo } from "firebase/auth";
import { loginWithEmail, loginWithGoogle } from "@/hooks/firebase";
import { Routes } from "@/routes/routes";
import { isValidEmail } from "@/shared/utils/validator";

const FIREBASE_LOGIN_ERRORS = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/popup-blocked": "Google popup was blocked by your browser.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/too-many-requests": "Too many failed attempts. Try again later.",
};

function getFirebaseLoginErrorMessage(errorCode) {
  return (
    FIREBASE_LOGIN_ERRORS[errorCode] ||
    "Unable to sign in. Please check your credentials and try again."
  );
}

// Pure validator outside hook lifecycle
function validateLoginForm(data = {}) {
  const fieldErrors = {};
  const cleanEmail = (data.email || "").trim();

  if (!isValidEmail(cleanEmail)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!data.password) {
    fieldErrors.password = "Password is required.";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    cleanEmail,
  };
}

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const submit = useCallback(
    async (formData) => {
      const { isValid, fieldErrors, cleanEmail } = validateLoginForm(formData);

      if (!isValid) {
        setErrors(fieldErrors);
        return { success: false, errors: fieldErrors };
      }

      setLoading(true);
      setErrors({});

      try {
        const userCredential = await loginWithEmail(
          cleanEmail,
          formData.password,
        );

        navigate(Routes.DASHBOARD, { replace: true });

        return { success: true, user: userCredential.user };
      } catch (err) {
        const message = getFirebaseLoginErrorMessage(err?.code);
        setErrors({ form: message });

        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setErrors({});

    try {
      const userCredential = await loginWithGoogle();
      const additionalInfo = getAdditionalUserInfo(userCredential);

      // PREVENT NEW USERS: If this account was just created, reject & clean up
      if (additionalInfo?.isNewUser) {
        await userCredential.user.delete();
        const notRegisteredMessage =
          "No account found with this Google account. Please register first.";
        setErrors({ form: notRegisteredMessage });

        return { success: false, error: notRegisteredMessage };
      }

      navigate(Routes.DASHBOARD, { replace: true });

      return { success: true, user: userCredential.user };
    } catch (err) {
      const message = err?.code
        ? getFirebaseLoginErrorMessage(err.code)
        : err?.message;
      setErrors({ form: message });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      if (!prev[field] && !prev.form) return prev;
      const updated = { ...prev };
      delete updated[field];
      delete updated.form;
      return updated;
    });
  }, []);

  return {
    signInWithGoogle,
    submit,
    clearError,
    loading,
    errors,
  };
}
