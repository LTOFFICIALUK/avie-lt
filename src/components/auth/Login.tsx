"use client";
import api from "@/lib/api";
import { setToken } from "@/lib/auth";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import { ApiLoginErrorResponse } from "@/types/api";

interface Props {
  onRequiresVerification: (verificationMessage: string) => void;
  onForgotPassword: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = ({ onRequiresVerification, onForgotPassword }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post("/api/user/login", {
        email: values.email,
        password: values.password,
      });

      if (response.data.requiresVerification) {
        if (response.data.token) {
          setToken(response.data.token);
        }

        onRequiresVerification(
          "Please enter the 6-character verification code sent to your email."
        );
        setError(null);
        return;
      }

      if (response.data.token) {
        setToken(response.data.token);
        window.location.href = "/dashboard";
        return;
      }

      // Only show invalid response if neither condition is met
      setError("Invalid response from server");
    } catch (err: unknown) {
      const error = err as any;
      setError(error.response?.data?.error || error.response?.data?.message || "An error occurred");
      console.error("Login error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onFinish={handleLogin} layout="vertical" className="space-y-6">
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input
          placeholder="Enter your email or username"
          value={loginData.emailOrUsername}
          onChange={(e) =>
            setLoginData((prev) => ({
              ...prev,
              emailOrUsername: e.target.value,
            }))
          }
        />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          placeholder="Enter your password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          iconRender={(visible: boolean) => (
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="text-zinc-400 hover:text-white"
            >
              {visible ? (
                <EyeInvisibleOutlined className="h-4 w-4" />
              ) : (
                <EyeOutlined className="h-4 w-4" />
              )}
            </button>
          )}
        />
      </Form.Item>
      
      <div className="flex justify-end">
        <Button 
          type="link" 
          onClick={onForgotPassword} 
          className="text-blue-400 hover:text-blue-300 p-0 h-auto text-sm"
        >
          Forgot password?
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400">
          <Typography.Text type="danger">{error}</Typography.Text>
        </div>
      )}

      <Button
        type="primary"
        htmlType="submit"
        loading={isLoading}
        className="w-full "
        style={{ height: 30 }}
      >
        {isLoading ? "Logging in..." : "Log In"}
      </Button>
    </Form>
  );
};

export default Login;
