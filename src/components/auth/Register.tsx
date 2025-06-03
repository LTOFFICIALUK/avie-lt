"use client";
import api from "@/lib/api";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { ApiLoginErrorResponse } from "@/types/api";

type PasswordStrength = {
  score: number;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form] = Form.useForm();

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Function to validate username for special characters and non-English letters
  const validateUsername = (username: string): { isValid: boolean; message: string } => {
    // Only allow alphanumeric characters and underscores
    const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
    
    if (!validUsernameRegex.test(username)) {
      return { 
        isValid: false, 
        message: "Username can only contain English letters, numbers, and underscores."
      };
    }
    
    return { isValid: true, message: '' };
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength.score === 0)
      return { text: "Very Weak", color: "text-red-500" };
    if (passwordStrength.score <= 2)
      return { text: "Weak", color: "text-red-500" };
    if (passwordStrength.score === 3)
      return { text: "Medium", color: "text-yellow-500" };
    if (passwordStrength.score === 4)
      return { text: "Strong", color: "text-green-500" };
    return { text: "Very Strong", color: "text-green-600" };
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setError(null);
    setIsLoading(true);

    // Validation checks
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Password is not strong enough");
      setIsLoading(false);
      return;
    }

    if (values.username.length < 3) {
      setError("Username must be at least 3 characters long");
      setIsLoading(false);
      return;
    }

    // Check for special characters and non-English letters in username
    const usernameValidation = validateUsername(values.username);
    if (!usernameValidation.isValid) {
      setError(usernameValidation.message);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/user/register", {
        email: values.email,
        password: values.password,
        displayName: values.username,
        referralCode: "Y0UJU$TH4V3T0B3L!V3",
      });

      if (response.data.token) {
        setVerificationMessage(
          "Please check your email to verify your account."
        );
      } else {
        setError("Invalid response from server");
      }
    } catch (err: unknown) {
      const error = err as any;
      setError(error.response?.data?.error || error.response?.data?.message || "An error occurred");
      console.error("Registration error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password strength calculation when form values change
  const handleValuesChange = (changedValues: any) => {
    if (changedValues.password !== undefined) {
      const password = changedValues.password;
      
      const strength: PasswordStrength = {
        score: 0,
        hasMinLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      };

      let score = 0;
      if (strength.hasMinLength) score++;
      if (strength.hasUpperCase) score++;
      if (strength.hasLowerCase) score++;
      if (strength.hasNumber) score++;
      if (strength.hasSpecialChar) score++;

      setPasswordStrength({ ...strength, score: score });
    }
  };

  return (
    <Form 
      form={form}
      onFinish={handleRegister} 
      layout="vertical" 
      className="space-y-6"
      onValuesChange={handleValuesChange}
    >
      <div className="space-y-6">
        <div>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              { min: 3, message: "Username must be at least 3 characters!" },
              { 
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  const validation = validateUsername(value);
                  if (!validation.isValid) {
                    return Promise.reject(new Error(validation.message));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input placeholder="Choose a username" />
          </Form.Item>
          <div className="mt-1">
            <Typography.Text className="text-xs text-yellow-500">
              <span className="font-medium">Important:</span> Your username is permanent and cannot be changed later.
            </Typography.Text>
          </div>
        </div>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <div>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Input.Password
              placeholder="Choose a password"
              iconRender={(visible: boolean) => (
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
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

          {form.getFieldValue('password') && (
            <div className="mt-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      index <= passwordStrength.score
                        ? index <= 2
                          ? "bg-red-500"
                          : index === 3
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : "bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
              <Typography.Text className={getPasswordStrengthLabel().color}>
                {getPasswordStrengthLabel().text}
              </Typography.Text>
            </div>
          )}
        </div>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm your password"
            iconRender={(visible: boolean) => (
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400">
            <Typography.Text type="danger">{error}</Typography.Text>
          </div>
        )}

        {verificationMessage && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/25 text-green-400">
            <Typography.Text type="success">{verificationMessage}</Typography.Text>
          </div>
        )}

        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          disabled={passwordStrength.score < 3}
          style={{ height: 30 }}
          className="w-full"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        <Typography.Text className="text-xs text-zinc-400">
          By clicking Create Account, you are agreeing to our Terms of Service and
          acknowledging our Privacy Notice.
        </Typography.Text>
      </div>
    </Form>
  );
};

export default Register;
