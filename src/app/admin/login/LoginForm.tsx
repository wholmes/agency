"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null as LoginState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="form-field">
        <label htmlFor="admin-password" className="form-label">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="form-input"
          aria-invalid={!!state?.error}
        />
        {state?.error ? (
          <p className="form-error" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>
      <button type="submit" className="btn btn-primary w-full justify-center" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
