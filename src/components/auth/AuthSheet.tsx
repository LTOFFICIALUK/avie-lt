"use client";

import { useState } from "react";
import {
  CloseOutlined,
  MailOutlined,
  CheckCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { Button, Modal, Tabs, Typography } from "antd";
import type { TabsProps } from "antd";
import Login from "./Login";
import Register from "./Register";
import FormVerify2FA from "./FormVerify2FA";
import PasswordReset from "./PasswordReset";


export function AuthSheet() {
  const [open, setOpen] = useState(false);

  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null
  );

  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);

  const handleForgotPassword = () => {
    setResetPasswordMode(true);
  };

  const handleBackToLogin = () => {
    setResetPasswordMode(false);
  };

  const items: TabsProps["items"] = [
    {
      key: "login",
      label: "Login",
      children: (
        <Login
          onRequiresVerification={(verificationMessage) => {
            setVerificationMode(true);
            setVerificationMessage(verificationMessage);
          }}
          onForgotPassword={handleForgotPassword}
        />
      ),
    },
    {
      key: "register",
      label: "Register",
      children: <Register />,
    },
  ];

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 h-10 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
      >
        LOGIN / REGISTER
      </Button>

      <Modal
        open={open}
        closable={false}
        footer={null}
        title={null}
        width={420}
        centered
        className="avie-auth-modal"
        styles={{
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
          },
          content: {
            padding: 0,
            background: 'transparent',
            boxShadow: 'none',
            maxHeight: '90vh',
          }
        }}
      >
        {/* Sleek Modal Container */}
        <div className="relative bg-gray-900/98 backdrop-blur-2xl rounded-xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden" style={{
          border: '1px solid rgba(75, 85, 99, 0.4)',
          borderTopWidth: '2px',
          borderTopColor: 'transparent',
          borderImage: 'linear-gradient(90deg, rgb(168, 85, 247), rgb(59, 130, 246), rgb(168, 85, 247)) 1',
          borderImageSlice: '2 0 0 0'
        }}>
          
          {/* Compact Header */}
          <div className="relative px-6 py-4 border-b border-gray-800/60 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/favicon/avie-logo-512x512-noback.png"
                  alt="AVIE Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white m-0">
                    {verificationMode
                      ? "Verify Login"
                      : resetPasswordMode
                      ? "Reset Password"
                      : "Welcome to AVIE"}
                  </h3>
                  <p className="text-xs text-gray-400 m-0 mt-0.5">
                    {verificationMode
                      ? "Enter your verification code"
                      : resetPasswordMode
                      ? "Reset your account password"
                      : "Start earning $SOL tokens"}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setOpen(false);
                  setResetPasswordMode(false);
                  setVerificationMode(false);
                  setVerificationSuccess(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800/60 border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/80 hover:border-gray-600/50 transition-all duration-200"
              >
                <CloseOutlined className="text-sm" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Area with Tab Clearance */}
          <div className="px-6 pt-3 pb-4 overflow-y-auto flex-1 min-h-0">
            {verificationMode ? (
              <div className="space-y-5">
                {verificationSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                      <CheckCircleOutlined className="text-2xl text-white" />
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <h4 className="text-green-400 font-semibold mb-1">Verification Successful!</h4>
                    <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-900/25 to-purple-900/15 border border-blue-500/20">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MailOutlined className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-blue-300 font-medium text-sm mb-1">
                            {verificationMessage}
                          </p>
                          <p className="text-blue-400/70 text-xs">
                            Enter the 6-character code from your email.
                          </p>
                        </div>
                      </div>
                    </div>

                    <FormVerify2FA
                      onVerificationSuccess={() => setVerificationSuccess(true)}
                    />
                  </>
                )}
              </div>
            ) : resetPasswordMode ? (
              <PasswordReset onBackToLogin={handleBackToLogin} />
            ) : (
              <div className="auth-container">
                <Tabs 
                  items={items} 
                  centered
                  className="avie-auth-tabs"
                />
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Enhanced Custom Styles */}
      <style jsx global>{`
        /* Modal Base */
        .avie-auth-modal .ant-modal-content {
          background: transparent !important;
          box-shadow: none !important;
        }

        /* Sleek Tab Navigation */
        .avie-auth-tabs .ant-tabs-nav {
          margin-bottom: 1rem;
          margin-top: 4px;
          position: relative;
          z-index: 10;
        }

        .avie-auth-tabs .ant-tabs-nav::before {
          display: none !important;
        }

        .avie-auth-tabs .ant-tabs-nav-wrap {
          border-bottom: none !important;
          padding-top: 2px;
        }

        .avie-auth-tabs .ant-tabs-nav-list {
          position: relative;
          z-index: 10;
        }

        .avie-auth-tabs .ant-tabs-tab {
          padding: 8px 20px;
          margin: 0 4px;
          border-radius: 8px;
          background: rgba(31, 41, 55, 0.6);
          border: 1px solid rgba(75, 85, 99, 0.3);
          color: rgba(156, 163, 175, 1);
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          z-index: 10;
        }

        .avie-auth-tabs .ant-tabs-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1));
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .avie-auth-tabs .ant-tabs-tab:hover::before {
          opacity: 1;
        }

        .avie-auth-tabs .ant-tabs-tab:hover {
          border-color: rgba(147, 51, 234, 0.4);
          color: rgba(196, 181, 253, 1);
          transform: translateY(-1px);
        }

        .avie-auth-tabs .ant-tabs-tab-active {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(59, 130, 246, 0.15)) !important;
          border: 1px solid rgba(147, 51, 234, 0.4) !important;
          color: white !important;
          transform: translateY(-1px);
        }

        .avie-auth-tabs .ant-tabs-tab-active::before {
          opacity: 1;
        }

        .avie-auth-tabs .ant-tabs-ink-bar {
          display: none !important;
        }

        /* Ultra Compact Content Area */
        .avie-auth-tabs .ant-tabs-content-holder {
          background: rgba(17, 24, 39, 0.3);
          border-radius: 12px;
          border: 1px solid rgba(75, 85, 99, 0.2);
          padding: 1rem;
        }

        /* Refined Form Inputs */
        .avie-auth-tabs input,
        .avie-auth-tabs .ant-input,
        .avie-auth-tabs .ant-input-password input {
          background: rgba(31, 41, 55, 0.7) !important;
          border: 1px solid rgba(75, 85, 99, 0.4) !important;
          border-radius: 8px !important;
          color: white !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          height: 36px !important;
          transition: all 0.2s ease !important;
        }

        .avie-auth-tabs input:hover,
        .avie-auth-tabs .ant-input:hover,
        .avie-auth-tabs .ant-input-password:hover input {
          border-color: rgba(147, 51, 234, 0.4) !important;
          background: rgba(31, 41, 55, 0.8) !important;
        }

        .avie-auth-tabs input:focus,
        .avie-auth-tabs .ant-input:focus,
        .avie-auth-tabs .ant-input-focused,
        .avie-auth-tabs .ant-input-password input:focus {
          border-color: rgba(147, 51, 234, 0.6) !important;
          background: rgba(31, 41, 55, 0.9) !important;
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.08) !important;
        }

        /* Autofill Fix */
        .avie-auth-tabs input:-webkit-autofill,
        .avie-auth-tabs input:-webkit-autofill:hover,
        .avie-auth-tabs input:-webkit-autofill:focus,
        .avie-auth-tabs input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px rgba(31, 41, 55, 0.8) inset !important;
          -webkit-text-fill-color: white !important;
          background-color: rgba(31, 41, 55, 0.8) !important;
          border: 1px solid rgba(75, 85, 99, 0.4) !important;
          border-radius: 8px !important;
        }

        /* Form Labels */
        .avie-auth-tabs label,
        .avie-auth-tabs .ant-form-item-label > label {
          color: rgba(209, 213, 219, 1) !important;
          font-weight: 500 !important;
          font-size: 12px !important;
          margin-bottom: 3px !important;
        }

        /* Ultra Compact Form Items */
        .avie-auth-tabs .ant-form-item {
          margin-bottom: 0.625rem !important;
        }

        /* Enhanced Primary Button */
        .avie-auth-tabs .ant-btn-primary {
          background: linear-gradient(135deg, #9333ea, #3b82f6) !important;
          border: none !important;
          border-radius: 8px !important;
          height: 36px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
          width: 100% !important;
          position: relative !important;
          overflow: hidden !important;
        }

        .avie-auth-tabs .ant-btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .avie-auth-tabs .ant-btn-primary:hover::before {
          left: 100%;
        }

        .avie-auth-tabs .ant-btn-primary:hover {
          background: linear-gradient(135deg, #7c3aed, #2563eb) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(147, 51, 234, 0.25) !important;
        }

        .avie-auth-tabs .ant-btn-primary:active {
          transform: translateY(0) !important;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3) !important;
        }

        /* Secondary/Ghost Buttons */
        .avie-auth-tabs .ant-btn-default,
        .avie-auth-tabs .ant-btn:not(.ant-btn-primary) {
          background: rgba(31, 41, 55, 0.6) !important;
          border: 1px solid rgba(75, 85, 99, 0.4) !important;
          border-radius: 8px !important;
          color: rgba(209, 213, 219, 1) !important;
          height: 36px !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
        }

        .avie-auth-tabs .ant-btn-default:hover,
        .avie-auth-tabs .ant-btn:not(.ant-btn-primary):hover {
          background: rgba(75, 85, 99, 0.6) !important;
          border-color: rgba(147, 51, 234, 0.4) !important;
          color: rgba(196, 181, 253, 1) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        /* Links */
        .avie-auth-tabs a {
          color: rgba(196, 181, 253, 1) !important;
          text-decoration: none !important;
          font-size: 12px !important;
          transition: all 0.2s ease !important;
          font-weight: 500 !important;
        }

        .avie-auth-tabs a:hover {
          color: rgba(147, 51, 234, 1) !important;
          text-shadow: 0 0 8px rgba(147, 51, 234, 0.3) !important;
        }

        /* Error Messages */
        .avie-auth-tabs .ant-form-item-explain-error {
          color: rgba(248, 113, 113, 1) !important;
          font-size: 11px !important;
          margin-top: 2px !important;
        }

        /* Typography */
        .avie-auth-tabs .ant-typography {
          color: rgba(209, 213, 219, 1) !important;
        }

        /* Password Input Suffix */
        .avie-auth-tabs .ant-input-password-icon {
          color: rgba(156, 163, 175, 1) !important;
          transition: color 0.2s ease !important;
        }

        .avie-auth-tabs .ant-input-password-icon:hover {
          color: rgba(209, 213, 219, 1) !important;
        }

        /* Verification Input */
        .verification-input {
          background: rgba(31, 41, 55, 0.7) !important;
          border: 1px solid rgba(75, 85, 99, 0.4) !important;
          border-radius: 8px !important;
          color: white !important;
          text-align: center !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          height: 45px !important;
          width: 42px !important;
        }

        .verification-input:focus {
          border-color: rgba(147, 51, 234, 0.6) !important;
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.08) !important;
          background: rgba(31, 41, 55, 0.9) !important;
        }

        /* Remove number input spinners */
        .avie-auth-tabs input[type="number"] {
          -moz-appearance: textfield;
        }

        .avie-auth-tabs input[type="number"]::-webkit-outer-spin-button,
        .avie-auth-tabs input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Forgot Password Link */
        .avie-auth-tabs .ant-form-item:last-child {
          text-align: center;
          margin-bottom: 0 !important;
        }

        /* Ultra Compact Register Form */
        .avie-auth-tabs .ant-tabs-tabpane[data-node-key="register"] .ant-form-item {
          margin-bottom: 0.5rem !important;
        }

        .avie-auth-tabs .ant-tabs-tabpane[data-node-key="register"] .ant-form-item-label {
          padding-bottom: 0 !important;
          margin-bottom: 2px !important;
        }

        .avie-auth-tabs .ant-tabs-tabpane[data-node-key="register"] label {
          font-size: 11px !important;
          margin-bottom: 2px !important;
        }

        /* Password Strength Indicator */
        .password-strength {
          margin-top: 2px !important;
          margin-bottom: 2px !important;
          height: 3px !important;
        }

        /* Terms and Conditions Text */
        .avie-auth-tabs .ant-typography.ant-typography-caption,
        .avie-auth-tabs .terms-text {
          font-size: 10px !important;
          line-height: 1.3 !important;
          color: rgba(156, 163, 175, 1) !important;
          margin-top: 4px !important;
          margin-bottom: 4px !important;
        }

        /* Loading States */
        .avie-auth-tabs .ant-btn-loading {
          pointer-events: none;
        }

        .avie-auth-tabs .ant-btn-loading-icon {
          color: rgba(255, 255, 255, 0.8) !important;
        }

        /* Remove any remaining tab borders/lines */
        .avie-auth-tabs .ant-tabs-nav::before,
        .avie-auth-tabs .ant-tabs-nav-wrap::before,
        .avie-auth-tabs .ant-tabs-nav-list::before {
          display: none !important;
          border: none !important;
        }

        .avie-auth-tabs .ant-tabs-content {
          border-top: none !important;
        }

        .avie-auth-tabs .ant-tabs-content-top {
          border-top: none !important;
        }

        /* Ensure tabs are above any overlay */
        .avie-auth-tabs .ant-tabs {
          position: relative;
          z-index: 10;
        }

        .avie-auth-tabs .ant-tabs-content-holder {
          position: relative;
          z-index: 5;
        }

        /* Compact password confirmation */
        .avie-auth-tabs .ant-tabs-tabpane[data-node-key="register"] .ant-input-password {
          margin-bottom: 0 !important;
        }

        /* Tighter form validation messages */
        .avie-auth-tabs .ant-tabs-tabpane[data-node-key="register"] .ant-form-item-explain {
          margin-top: 1px !important;
          margin-bottom: 2px !important;
        }

        /* Compact checkbox/agreement sections */
        .avie-auth-tabs .ant-tabs-tabpane[data-node-key="register"] .ant-checkbox-wrapper {
          font-size: 11px !important;
          margin-bottom: 8px !important;
        }

        /* Username validation messages */
        .avie-auth-tabs .username-rules,
        .avie-auth-tabs .username-note {
          font-size: 10px !important;
          margin-top: 1px !important;
          margin-bottom: 2px !important;
          line-height: 1.2 !important;
        }
      `}</style>
    </>
  );
}
