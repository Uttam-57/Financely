import { useState } from "react";
import { Link } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { FormField, Button } from "@/shared/ui";
import useRegister from "@/hooks/useRegister";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { submit, registerWithGoogle, clearFieldError, loading, errors } =
    useRegister();

  function handleSubmit(e) {
    e.preventDefault();
    submit(formData);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    clearFieldError(name);
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl text-text-1">
          Create your <span className="text-primary font-semibold">Financely</span> account
        </h1>
      </div>

      <form className="flex flex-col gap-4 mb-4" onSubmit={handleSubmit} noValidate>
        <FormField
          id="fullName"
          label="Full Name"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder="John Doe"
          maxLength={50}
          required
        />

        <FormField
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="johndoe@email.com"
          autoComplete="email"
          maxLength={80}
          required
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Create a password"
          autoComplete="new-password"
          maxLength={64}
          required
        />

        <FormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          autoComplete="new-password"
          maxLength={64}
          required
        />

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
          {loading ? "Creating Account..." : "Sign Up With Email"}
        </Button>

        <span className="text-center text-sm text-gray-500">Or</span>
      </form>

      <Button
        type="button"
        disabled={loading}
        onClick={registerWithGoogle}
      >
        {loading ? "Please wait..." : "Continue with Google"}
      </Button>

      <p className="text-center mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link to={Routes.SIGNIN} className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
}