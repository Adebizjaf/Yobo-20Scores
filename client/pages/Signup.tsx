import { FormEvent } from "react";

export default function Signup() {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Signed up (demo)");
  };
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">
        Create your account
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <input
            type="text"
            required
            className="w-full rounded-md border bg-background px-3 py-2 outline-none ring-0 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            className="w-full rounded-md border bg-background px-3 py-2 outline-none ring-0 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            className="w-full rounded-md border bg-background px-3 py-2 outline-none ring-0 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-gradient-to-r from-blue-600 to-green-600 px-4 py-2 font-semibold text-white shadow hover:opacity-90"
        >
          Sign up
        </button>
      </form>
      <p className="mt-4 text-sm text-foreground/70">
        Already have an account?{" "}
        <a className="text-blue-600 hover:underline" href="/login">
          Log in
        </a>
      </p>
    </div>
  );
}
