"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined, ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import api from "@/lib/api";

interface PasswordResetProps {
  onBackToLogin: () => void;
}

// Component handles both requesting password reset email and setting new password
export default function PasswordReset({ onBackToLogin }: PasswordResetProps) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  
  // Request password reset email
  const handleRequestReset = async (values: { email: string }) => {
    setLoading(true);
    
    try {
      // Directly call backend API instead of going through Next.js API route
      const response = await api.post("/api/user/request-password-reset", {
        email: values.email
      });
      
      setEmailSent(true);
      message.success('Password reset instructions sent to your email');
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      message.error(error?.response?.data?.error || 'Failed to request password reset. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Submit new password with reset token
  const handleResetPassword = async (values: { token: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      return message.error('Passwords do not match');
    }
    
    setLoading(true);
    
    try {
      const response = await api.post("/api/user/reset-password", {
        token: values.token,
        password: values.password
      });
      
      setResetSuccess(true);
      message.success('Password reset successful! You can now log in with your new password.');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      message.error(error?.response?.data?.error || 'Failed to reset password. The token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };
  
  // Step 1: User enters email to request reset
  if (!emailSent && !resetToken) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={onBackToLogin}
            className="text-blue-400 hover:text-blue-300 p-0 flex items-center"
          >
            Back to login
          </Button>
        </div>
        
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
          <div className="flex items-start gap-3">
            <MailOutlined className="w-5 h-5 mt-0.5" />
            <div>
              <Typography.Text className="text-sm font-medium">
                Forgot your password?
              </Typography.Text>
              <Typography.Text className="text-xs block mt-1 text-blue-400/80">
                Enter your email and we'll send you instructions to reset your password.
              </Typography.Text>
            </div>
          </div>
        </div>
        
        <Form
          name="password_reset_request"
          onFinish={handleRequestReset}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-zinc-400" />} 
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
              className="mt-4"
            >
              Send Reset Instructions
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
  
  // Step 2: User received email and now enters token and new password
  if (emailSent && !resetSuccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={onBackToLogin}
            className="text-blue-400 hover:text-blue-300 p-0 flex items-center"
          >
            Back to login
          </Button>
        </div>
        
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
          <div className="flex items-start gap-3">
            <LockOutlined className="w-5 h-5 mt-0.5" />
            <div>
              <Typography.Text className="text-sm font-medium">
                Reset your password
              </Typography.Text>
              <Typography.Text className="text-xs block mt-1 text-blue-400/80">
                Enter the token from your email and create a new password.
              </Typography.Text>
            </div>
          </div>
        </div>
        
        <Form
          name="password_reset"
          onFinish={handleResetPassword}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="token"
            rules={[{ required: true, message: 'Please enter the reset token' }]}
          >
            <Input 
              placeholder="Reset token from email"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-zinc-400" />} 
              placeholder="New password"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-zinc-400" />} 
              placeholder="Confirm new password"
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
              className="mt-4"
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
  
  // Step 3: Password reset successfully
  if (resetSuccess) {
    return (
      <div className="p-6 text-center">
        <CheckCircleOutlined className="text-green-400 text-5xl mb-4" />
        <Typography.Title level={4} className="text-white">
          Password Reset Successful!
        </Typography.Title>
        <Typography.Text className="text-zinc-400 block mb-6">
          Your password has been reset successfully.
        </Typography.Text>
        <Button 
          type="primary" 
          onClick={onBackToLogin}
          size="large"
          block
        >
          Return to Login
        </Button>
      </div>
    );
  }
  
  return null;
} 