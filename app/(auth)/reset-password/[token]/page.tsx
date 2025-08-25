

"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { resetPasswordApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await resetPasswordApi(token, { password });
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-10 shadow-sm">
                <div>
                    <h2 className="text-center text-3xl font-bold">Set New Password</h2>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="password">New Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                     <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {message && <p className="text-sm text-green-600">{message}</p>}
                    <div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}