import { useState } from "react";
import { Link } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { FormField, Button } from "@/shared/ui";
import useLogin from "@/hooks/useLogin";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { submit, signInWithGoogle, clearError, loading, errors } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    submit(formData);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearError(name);
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl text-gray-900">
          Sign in to <span className="text-primary font-semibold">Financely</span>
        </h1>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="johndoe@email.com"
          autoComplete="email"
          required
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Your password"
          autoComplete="current-password"
          required
        />
        <span className="text-primary text-sm"><Link to={Routes.FORGOT_PASS}>Forgot Password?</Link></span>

        {errors.form && (
          <p className="text-sm text-red-500 text-center" role="alert">
            {errors.form}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-6 bg-surface-card text-text-1 border border-primary hover:text-text-2"
        >
          {loading ? "Signing in..." : "Sign in With Email"}
        </Button>

        <span className="text-center text-sm text-gray-500">Or</span>

        <Button
          type="button"
          disabled={loading}
          onClick={signInWithGoogle}
        >
          {loading ? "Please wait..." : "Sign In With Google"}
        </Button>
      </form>

      <p className="text-center mt-4 text-sm text-slate-600">
        New to Financely?{" "}
        <Link to={Routes.SIGNUP} className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
}