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
    <div className="space-y-5">
      <style dangerouslySetInnerHTML={{
        __html: `
          .ant-input:-webkit-autofill,
          .ant-input:-webkit-autofill:hover,
          .ant-input:-webkit-autofill:focus,
          .ant-input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px rgba(31, 41, 55, 0.8) inset !important;
            -webkit-text-fill-color: #ffffff !important;
            background-color: rgba(31, 41, 55, 0.8) !important;
            border-color: rgba(75, 85, 99, 0.6) !important;
            caret-color: #ffffff !important;
            transition: background-color 5000s ease-in-out 0s !important;
          }
          
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px rgba(31, 41, 55, 0.8) inset !important;
            -webkit-text-fill-color: #ffffff !important;
            background-color: rgba(31, 41, 55, 0.8) !important;
            border-color: rgba(75, 85, 99, 0.6) !important;
            caret-color: #ffffff !important;
            transition: background-color 5000s ease-in-out 0s !important;
          }
          
          input[type="password"]:-webkit-autofill,
          input[type="password"]:-webkit-autofill:hover,
          input[type="password"]:-webkit-autofill:focus,
          input[type="password"]:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px rgba(31, 41, 55, 0.8) inset !important;
            -webkit-text-fill-color: #ffffff !important;
            background-color: rgba(31, 41, 55, 0.8) !important;
            border-color: rgba(75, 85, 99, 0.6) !important;
            caret-color: #ffffff !important;
            transition: background-color 5000s ease-in-out 0s !important;
          }
          
          .ant-input-password .ant-input:-webkit-autofill,
          .ant-input-password .ant-input:-webkit-autofill:hover,
          .ant-input-password .ant-input:-webkit-autofill:focus,
          .ant-input-password .ant-input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px rgba(31, 41, 55, 0.8) inset !important;
            -webkit-text-fill-color: #ffffff !important;
            background-color: rgba(31, 41, 55, 0.8) !important;
            border-color: rgba(75, 85, 99, 0.6) !important;
            caret-color: #ffffff !important;
            transition: background-color 5000s ease-in-out 0s !important;
          }

          /* White placeholder text overrides for Login */
          .login-email-input::placeholder,
          .login-password-input input::placeholder {
            color: #ffffff !important;
            opacity: 0.8 !important;
          }

          .login-password-input .ant-input::placeholder {
            color: #ffffff !important;
            opacity: 0.8 !important;
          }
        `
      }} />
      <Form onFinish={handleLogin} layout="vertical" className="space-y-5">
        <Form.Item
          label={<span className="text-gray-300 font-medium text-sm">Email</span>}
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
          className="mb-4"
        >
          <Input
            placeholder="example@email.com"
            value={loginData.emailOrUsername}
            onChange={(e) =>
              setLoginData((prev) => ({
                ...prev,
                emailOrUsername: e.target.value,
              }))
            }
            className="bg-gray-800/80 border-gray-700/60 text-white placeholder-white rounded-lg h-12 px-4 text-sm focus:border-purple-500/60 focus:shadow-none hover:border-gray-600/80 transition-all duration-200 login-email-input"
            style={{
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderColor: 'rgba(75, 85, 99, 0.6)',
              color: '#ffffff'
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-300 font-medium text-sm">Password</span>}
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          className="mb-4"
        >
          <Input.Password
            placeholder="••••••••••"
            value={loginData.password}
            onChange={(e) =>
              setLoginData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            className="bg-gray-800/80 border-gray-700/60 text-white placeholder-white rounded-lg h-12 px-4 text-sm focus:border-purple-500/60 focus:shadow-none hover:border-gray-600/80 transition-all duration-200 [&_.ant-input]:bg-transparent [&_.ant-input]:border-0 [&_.ant-input]:text-white [&_.ant-input]:placeholder-white [&_.ant-input-suffix]:bg-transparent login-password-input"
            style={{
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderColor: 'rgba(75, 85, 99, 0.6)',
              color: '#ffffff'
            }}
            iconRender={(visible: boolean) => (
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 p-1 bg-transparent border-0"
              >
                {visible ? (
                  <EyeInvisibleOutlined className="w-4 h-4" />
                ) : (
                  <EyeOutlined className="w-4 h-4" />
                )}
              </button>
            )}
          />
        </Form.Item>
        
        <div className="flex justify-end -mt-2 mb-4">
          <button
            type="button"
            onClick={onForgotPassword} 
            className="mt-2 text-purple-400 hover:text-purple-300 hover:underline text-xs font-medium transition-colors duration-200 bg-transparent border-0 p-0 cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <Typography.Text type="danger">{error}</Typography.Text>
          </div>
        )}

        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 text-white font-semibold rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
          style={{ 
            height: '48px',
            background: 'linear-gradient(90deg, rgb(147, 51, 234), rgb(37, 99, 235))',
            borderRadius: '8px'
          }}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
