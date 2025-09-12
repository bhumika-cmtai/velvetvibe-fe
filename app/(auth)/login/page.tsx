// login/page.tsx
"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginSuccess } from '@/lib/redux/slices/authSlice';
import { loginUserApi } from '@/lib/api/auth'; // Ensure this path is correct
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginUserApi({ email, password });
      const { user, accessToken } = response.data;

      // Dispatch user data to Redux store
      dispatch(loginSuccess({ user, accessToken }));
      toast.success('Logged in successfully');
      
      // **NEW: Redirect based on user role**
      if (user.role === 'admin') {
        router.push('/account/admin'); // Redirect admins to their dashboard
      } else {
        router.push('/'); // Redirect regular users to the homepage
      }

    } catch (err: any) {
      toast.error(err.message)
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-10 shadow-sm">
        <div>
          <h2 className="text-center text-3xl font-bold">Sign in to your account</h2>
           <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/signup" className="font-medium text-[#D09D13] hover:text-[#b48a10]">
              create a new account
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {/* <div className="text-right text-sm">
             <Link href="/forgot-password" className="font-medium text-[#D09D13] hover:text-[#b48a10]">
                Forgot password?
              </Link>
          </div> */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <Button type="submit" className="w-full bg-[var(--primary-button-theme)] hover:bg-[var(--secondary-button-theme)] text-[var(--primary-button-text)] hover:text-[var(--secondary-button-text)]" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}