"use client";
import api from "@/lib/api";
import { Button, Form, Input, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { ApiLoginErrorResponse } from "@/types/api";

interface Props {
  onVerificationSuccess: () => void;
}

interface VerificationFormValues {
  verificationCode: string;
}

const FormVerify2FA = ({ onVerificationSuccess }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();
  const { lang } = useParams();

  const handleVerifyCode = async (values: VerificationFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post("/api/user/verify-session", {
        token: values.verificationCode,
      });

      if (response.data.token) {
        // Store JWT token in localStorage
        localStorage.setItem("jwt_token", response.data.token);

        // Update Authorization header for future requests
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        onVerificationSuccess();

        setTimeout(() => {
          router.push(`/${lang}`);
        }, 2000);
      } else {
        setError("Error verifying session: No token received");
      }
    } catch (err: unknown) {
      const error = err as ApiLoginErrorResponse;
      setError(
        error.response?.data?.error ||
          "An error occurred while verifying the session"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onFinish={handleVerifyCode} layout="vertical" className="space-y-6">
      <Form.Item
        label="Verification Code"
        name="verificationCode"
        rules={[
          {
            required: true,
            message: "Please input verification code!",
          },
          { len: 6, message: "Code must be 6 characters!" },
        ]}
      >
        <Input
          placeholder="Enter 6-character code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
          maxLength={6}
          className="text-center text-xl tracking-wider"
        />
      </Form.Item>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400">
          <Typography.Text type="danger">{error}</Typography.Text>
        </div>
      )}

      <Button
        type="primary"
        htmlType="submit"
        loading={isLoading}
        disabled={verificationCode.length !== 6}
        className="w-full "
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>
    </Form>
  );
};

export default FormVerify2FA;
