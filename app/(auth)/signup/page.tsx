// signup/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUserApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { toast } from 'sonner'; 

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // setError(''); // <-- Iski ab zaroorat nahi hai

    try {
      await registerUserApi({ name: fullName, email, password, role: "user" });

      // Success toast dikhayein
      toast.success("Account created successfully!", {
        description: "An OTP has been sent to your email for verification.",
      });

      // OTP page par redirect karein
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);

    } catch (err: any) {
      // Error ko toast mein dikhayein
       console.log("err.message")
       console.log(err.message)
      toast.error(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-subtle">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-background-main p-10 shadow-sm">
        <div>
          <h2 className="text-center text-3xl font-bold text-text-main">Create an Account</h2>
          <p className="mt-2 text-center text-sm text-text-subtle">
            Already registered?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
              Sign in
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {/* Error paragraph ko hata diya gaya hai */}
          
          <div>
            <Button type="submit" className="w-full bg-[var(--primary-button-theme)] hover:bg-[var(--secondary-button-theme)] text-[var(--primary-button-text)] hover:text-[var(--secondary-button-text)]" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}