import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {  updateProfile } from "firebase/auth";
import {
  registerWithEmail,
  loginWithGoogle,
} from "@/hooks/firebase";
import { Routes } from "@/routes/routes";
import { isValidEmail, isValidPassword } from "@/shared/utils/validator";

const NAME_REGEX = /^[a-zA-Z\s'-]{1,50}$/;

const FIREBASE_ERRORS = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/popup-blocked": "Google popup was blocked by your browser.",
  "auth/popup-closed-by-user": "Registration was cancelled.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/operation-not-allowed":
    "This sign-in method is not enabled in Firebase.",
  "auth/weak-password": "Password must be at least 6 characters.",
};

function getFirebaseErrorMessage(errorCode) {
  return (
    FIREBASE_ERRORS[errorCode] ||
    "Unable to create your account. Please try again."
  );
}
// data = {} to prevenet passing undefine null in place of data
const validateForm = (data = {}) => {
  const fieldErrors = {};
  const cleanName = (data.fullName || "").trim();
  const cleanEmail = (data.email || "").trim();

  if (!NAME_REGEX.test(cleanName)) {
    fieldErrors.fullName = "Full name must be 1 to 50 valid characters.";
  }
  if (!isValidEmail(cleanEmail)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!isValidPassword(data.password)) {
    fieldErrors.password =
      "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.";
  }
  if (!data.confirmPassword || data.confirmPassword !== data.password) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    cleanName,
    cleanEmail,
  };
};

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const submit = useCallback(
    async (formData) => {
      const { isValid, fieldErrors, cleanName, cleanEmail } =
        validateForm(formData);

      if (!isValid) {
        setErrors(fieldErrors);
        return { success: false, errors: fieldErrors };
      }

      setLoading(true);
      setErrors({});

      try {
        const userCredential = await registerWithEmail(cleanEmail, formData.password);

        // Attempt to set display name, but don't fail registration if this single call fails
        try {
          await updateProfile(userCredential.user, {
            displayName: cleanName,
          });
        } catch (profileErr) {
          console.warn("Failed to set displayName on signup:", profileErr);
        }

        navigate(Routes.DASHBOARD, { replace: true });

        return { success: true, user: userCredential.user };
      } catch (err) {
        const message = getFirebaseErrorMessage(err?.code);
        setErrors({ form: message });
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const registerWithGoogle = useCallback(async () => {
    setLoading(true);
    setErrors({});

    try {
      const userCredential = await loginWithGoogle();
      navigate(Routes.DASHBOARD, { replace: true });

      return { success: true, user: userCredential.user };
    } catch (err) {
      const message = getFirebaseErrorMessage(err?.code);
      setErrors({ form: message });

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      if (!prev[field] && !prev.form) return prev;
      const updated = { ...prev };
      delete updated[field];
      delete updated.form;
      return updated;
    });
  }, []);

  return {
    submit,
    registerWithGoogle,
    clearFieldError,
    loading,
    errors,
  };
}
