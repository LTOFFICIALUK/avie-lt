"use client";
import api from "@/lib/api";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, Checkbox } from "antd";
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
  agreeToTerms: boolean;
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

    if (!values.agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Notice");
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

          /* White placeholder text overrides */
          .username-input::placeholder,
          .email-input::placeholder,
          .password-input input::placeholder,
          .confirm-password-input input::placeholder {
            color: #ffffff !important;
            opacity: 0.8 !important;
          }

          .password-input .ant-input::placeholder,
          .confirm-password-input .ant-input::placeholder {
            color: #ffffff !important;
            opacity: 0.8 !important;
          }
        `
      }} />
      <Form 
        form={form}
        onFinish={handleRegister} 
        layout="vertical" 
        className="space-y-5"
        onValuesChange={handleValuesChange}
      >
        <div className="space-y-5">
          <div>
            <Form.Item
              label={<span className="text-gray-300 font-medium text-sm">Username</span>}
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
              className="mb-4"
            >
              <Input 
                placeholder="Choose a username" 
                className="bg-gray-800/80 border-gray-700/60 text-white placeholder-white rounded-lg h-12 px-4 text-sm focus:border-purple-500/60 focus:shadow-none hover:border-gray-600/80 transition-all duration-200 username-input"
                style={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderColor: 'rgba(75, 85, 99, 0.6)',
                  color: '#ffffff'
                }}
              />
            </Form.Item>
            <div className="mt-2 mb-4">
              <Typography.Text className="text-xs text-amber-400/80">
                <span className="font-medium">Important:</span> Your username is permanent and cannot be changed later.
              </Typography.Text>
            </div>
          </div>

          <Form.Item
            label={<span className="text-gray-300 font-medium text-sm">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
            className="mb-4"
          >
            <Input 
              placeholder="Enter your email" 
              className="bg-gray-800/80 border-gray-700/60 text-white placeholder-white rounded-lg h-12 px-4 text-sm focus:border-purple-500/60 focus:shadow-none hover:border-gray-600/80 transition-all duration-200 email-input"
              style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: 'rgba(75, 85, 99, 0.6)',
                color: '#ffffff'
              }}
            />
          </Form.Item>

          <div>
            <Form.Item
              label={<span className="text-gray-300 font-medium text-sm">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, message: "Password must be at least 8 characters!" },
              ]}
              className="mb-4"
            >
              <Input.Password
                placeholder="Choose a password"
                className="bg-gray-800/80 border-gray-700/60 text-white placeholder-white rounded-lg h-12 px-4 text-sm focus:border-purple-500/60 focus:shadow-none hover:border-gray-600/80 transition-all duration-200 [&_.ant-input]:bg-transparent [&_.ant-input]:border-0 [&_.ant-input]:text-white [&_.ant-input]:placeholder-white [&_.ant-input-suffix]:bg-transparent password-input"
                style={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderColor: 'rgba(75, 85, 99, 0.6)',
                  color: '#ffffff'
                }}
                iconRender={(visible: boolean) => (
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
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

            {form.getFieldValue('password') && (
              <div className="-mt-3 mb-4">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        index <= passwordStrength.score
                          ? index <= 2
                            ? "bg-red-500"
                            : index === 3
                            ? "bg-amber-500"
                            : "bg-green-500"
                          : "bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <Typography.Text className={`${getPasswordStrengthLabel().color} text-xs font-medium`}>
                  {getPasswordStrengthLabel().text}
                </Typography.Text>
              </div>
            )}
          </div>

          <Form.Item
            label={<span className="text-gray-300 font-medium text-sm">Confirm Password</span>}
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
            className="mb-4"
          >
            <Input.Password
              placeholder="Confirm your password"
              className="bg-gray-800/80 border-gray-700/60 text-white placeholder-white rounded-lg h-12 px-4 text-sm focus:border-purple-500/60 focus:shadow-none hover:border-gray-600/80 transition-all duration-200 [&_.ant-input]:bg-transparent [&_.ant-input]:border-0 [&_.ant-input]:text-white [&_.ant-input]:placeholder-white [&_.ant-input-suffix]:bg-transparent confirm-password-input"
              style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: 'rgba(75, 85, 99, 0.6)',
                color: '#ffffff'
              }}
              iconRender={(visible: boolean) => (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
              <Typography.Text type="danger">{error}</Typography.Text>
            </div>
          )}

          {verificationMessage && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm mb-4">
              <Typography.Text type="success">{verificationMessage}</Typography.Text>
            </div>
          )}

          <Form.Item
            name="agreeToTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('You must agree to the Terms of Service and Privacy Notice')),
              },
            ]}
            className="mb-4"
          >
            <Checkbox 
              className="text-gray-300 text-xs [&_.ant-checkbox]:bg-gray-800/80 [&_.ant-checkbox]:border-gray-600/60 [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-gradient-to-r [&_.ant-checkbox-checked_.ant-checkbox-inner]:from-purple-600 [&_.ant-checkbox-checked_.ant-checkbox-inner]:to-blue-600 [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-purple-500 hover:[&_.ant-checkbox]:border-purple-500/60"
              style={{
                fontSize: '12px',
                lineHeight: '1.4'
              }}
            >
                             <span className="text-gray-300 text-xs leading-relaxed">
                 By clicking Create Account, you are agreeing to our{' '}
                 <a 
                   href="/policy" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-purple-400 hover:text-purple-300 underline"
                 >
                   Terms of Service
                 </a>
                 {' '}and acknowledging our{' '}
                 <a 
                   href="/policy" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-purple-400 hover:text-purple-300 underline"
                 >
                   Privacy Notice
                 </a>
                 .
               </span>
            </Checkbox>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={passwordStrength.score < 3}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 text-white font-semibold rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              height: '48px',
              background: passwordStrength.score < 3 ? 'rgba(75, 85, 99, 0.5)' : 'linear-gradient(90deg, rgb(147, 51, 234), rgb(37, 99, 235))',
              borderRadius: '8px'
            }}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
