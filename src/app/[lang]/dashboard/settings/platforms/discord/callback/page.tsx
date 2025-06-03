"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Spin, Result } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function DiscordCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const completeOAuth = async () => {
      try {
        // Pridobimo kodo iz URL-ja
        const code = searchParams.get('code');
        
        // Pridobimo state iz URL-ja
        const returnedState = searchParams.get('state');
        
        // Preverimo, če imamo vse potrebne podatke
        if (!code) {
          throw new Error('Authorization code is missing');
        }
        
        // Pošljemo zahtevo na backend za dokončanje OAuth procesa
        await api.post('/api/platforms/discord/connect', {
          code,
          redirectUri: 'https://backend.avie.live/api/platforms/discord/callback'
        });
        
        setStatus('success');
        
        // Preusmerimo nazaj na stran z nastavitvami po kratkem zamiku
        setTimeout(() => {
          router.push('/dashboard/settings');
        }, 2000);
      } catch (error) {
        console.error('Error completing Discord OAuth:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to connect Discord account');
      }
    };

    completeOAuth();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <p className="mt-4 text-lg">Connecting your Discord account...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Result
          status="error"
          title="Connection Failed"
          subTitle={errorMessage || 'There was an error connecting your Discord account.'}
          extra={[
            <button
              key="back"
              onClick={() => router.push('/dashboard/settings')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md"
            >
              Back to Settings
            </button>
          ]}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Result
        status="success"
        title="Connection Successful"
        subTitle="Your Discord account has been connected successfully."
        extra={[
          <button
            key="back"
            onClick={() => router.push('/dashboard/settings')}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md"
          >
            Back to Settings
          </button>
        ]}
      />
    </div>
  );
} 