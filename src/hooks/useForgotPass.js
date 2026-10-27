import { useState, useCallback } from "react";
import { sendResetEmail } from "@/hooks/firebase";
import { isValidEmail } from "@/shared/utils/validator";

const FIREBASE_RESET_ERRORS = {
  "auth/user-not-found": "No account found with this email address.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/too-many-requests": "Too many requests. Please wait a moment and try again.",
};

function getFirebaseResetErrorMessage(errorCode) {
  return (
    FIREBASE_RESET_ERRORS[errorCode] ||
    "Unable to send reset link. Please try again later."
  );
}

function validateEmailOnly(email = "") {
  const cleanEmail = email.trim();
  const fieldErrors = {};

  if (!isValidEmail(cleanEmail)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    cleanEmail,
  };
}

export default function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSent, setIsSent] = useState(false);

  const resetPassword = useCallback(async (email) => {
    const { isValid, fieldErrors, cleanEmail } = validateEmailOnly(email);

    if (!isValid) {
      setErrors(fieldErrors);
      setIsSent(false);
      return { success: false, errors: fieldErrors };
    }

    setLoading(true);
    setErrors({});
    setIsSent(false);

    try {
      await sendResetEmail(cleanEmail);
      setIsSent(true);
      return { success: true };
    } catch (err) {
      const message = getFirebaseResetErrorMessage(err?.code);
      setErrors({ form: message });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

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
    resetPassword,
    clearFieldError,
    loading,
    errors,
    isSent,
  };
}