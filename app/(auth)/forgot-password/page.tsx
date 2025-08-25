'use client';

import { useState } from 'react';
import { forgotPasswordApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export default function ForgotPasswordPage() {
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
        await forgotPasswordApi({ email });
        setMessage('If an account with that email exists, a reset link has been sent.');
    } catch (err: any) {
        setMessage(err.message);
    } finally {
        setIsLoading(false);
    }
};

return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-10 shadow-sm">
            <div>
                <h2 className="text-center text-3xl font-bold">Reset Password</h2>
                <p className="mt-2 text-center text-sm text-gray-600">Enter your email to receive a reset link.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                {message && <p className="text-sm text-green-600">{message}</p>}
                <div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </div>
            </form>
        </div>
    </div>
);
}