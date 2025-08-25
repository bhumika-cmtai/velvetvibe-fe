"use client"; // This remains a client component

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSuccess } from '@/lib/redux/slices/authSlice';
import { verifyOtpApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// I've renamed the component to VerifyOtpForm to be clear
export default function VerifyOtpForm() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // This hook is what requires the Suspense boundary
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  // This check now correctly runs on the client after Suspense resolves
  if (!email) {
    router.push('/signup');
    return null; // Return null while redirecting
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await verifyOtpApi({ email, otp });
      dispatch(loginSuccess({ user: response.data.user, accessToken: response.data.accessToken }));
      router.push('/'); // Redirect to homepage on success
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-10 shadow-sm">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit OTP to {email}.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="otp">Enter OTP</Label>
            <Input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}