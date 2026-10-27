import { useState } from "react";
import { Link } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { FormField, Button } from "@/shared/ui";
import useForgotPassword from "@/hooks/useForgotPass";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { resetPassword, clearFieldError, loading, errors, isSent } =
    useForgotPassword();

  function handleSubmit(e) {
    e.preventDefault();
    resetPassword(email);
  }

  function handleChange(e) {
    const { value, name } = e.target;
    setEmail(value);
    clearFieldError(name || "email");
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-light mb-4 text-text-1">Forgot Password ?</h1>
       
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="Enter Your Email"
          type="email"
          value={email}
          onChange={handleChange}
          error={errors.email}
          placeholder="johndoe@email.com"
          autoComplete="email"
          required
        />

        {errors.form && (
          <p className="text-sm text-red-500 text-center" role="alert">
            {errors.form}
          </p>
        )}

        {isSent && (
          <p className="text-sm text-green-600 text-center" role="status">
            A password reset link has been sent to your email. Check your inbox.
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending Link..." : "Request Reset Link"}
        </Button>

        <span className="text-primary text-sm font-medium text-center">
          <Link to={Routes.SIGNIN}>Back To Login</Link>
        </span>
      </form>
    </>
  );
}