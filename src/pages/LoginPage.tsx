import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Login successful! Redirecting...");
      window.location.href = "/dashboard"; // you can replace this with useNavigate() from react-router-dom
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 text-center">
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="font-open-sans text-muted-foreground">
            Sign in to your VahanBazar account
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-card border border-border rounded-lg p-8 space-y-4"
        >
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default LoginPage;
