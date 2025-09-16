"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Mail, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store'; // Ensure this path is correct for your store type
import { submitContactForm } from '@/lib/redux/slices/contactSlice'; // Ensure this path is correct for your slice

export function ContactForm() {
    // --- STATE MANAGEMENT ---
    // Use 'fullName' to match the backend model
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // Added phone number state
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get the Redux dispatch function
    const dispatch = useDispatch<AppDispatch>();

    // --- FORM SUBMISSION HANDLER ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create a plain object with the form data
        const inquiryData = {
            fullName,
            email,
            message,
            phoneNumber,
        };

        try {
            // Dispatch the thunk and use .unwrap() to handle the promise
            await dispatch(submitContactForm(inquiryData)).unwrap();
            
            // Reset form fields only on successful submission
            setFullName('');
            setEmail('');
            setPhoneNumber('');
            setMessage('');
        } catch (error) {
            // The slice's extraReducers already show an error toast.
            // We can log the error here for development purposes.
            console.error("Failed to submit inquiry:", error);
        } finally {
            // Set submitting state back to false regardless of outcome
            setIsSubmitting(false);
        }
    };

    return (
        <section className="my-12 md:my-20 bg-[var(--base-10)] rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
                {/* Left Side: Form */}
                <div className="p-8 md:p-12">
                    <p className="font-semibold tracking-widest text-sm uppercase text-gray-500">
                        HAVE A QUESTION?
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif text-[var(--primary-text-theme)] mt-2">
                        Get In Touch
                    </h2>
                    <p className="mt-4 text-gray-600 max-w-md">
                        We'd love to hear from you. Whether it's a question about our products, an order, or just a hello, feel free to reach out.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                value={fullName} 
                                onChange={e => setFullName(e.target.value)} 
                                required 
                                disabled={isSubmitting}
                                className="w-full p-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black transition" 
                            />
                            <input 
                                type="email" 
                                placeholder="Your Email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                                disabled={isSubmitting}
                                className="w-full p-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black transition" 
                            />
                        </div>
                        <div>
                             <input 
                                type="tel" 
                                placeholder="Phone Number (Optional)" 
                                value={phoneNumber} 
                                onChange={e => setPhoneNumber(e.target.value)} 
                                disabled={isSubmitting}
                                className="w-full p-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black transition" 
                            />
                        </div>
                        <div>
                            <textarea 
                                placeholder="Your Message" 
                                rows={4} 
                                value={message} 
                                onChange={e => setMessage(e.target.value)} 
                                required 
                                disabled={isSubmitting}
                                className="w-full p-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black transition resize-none"
                            ></textarea>
                        </div>
                        <Button type="submit" className="w-full h-12 rounded-md font-bold text-base" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Right Side: Image and Details */}
                <div className="relative h-80 md:h-full w-full min-h-[400px]">
                    <Image
                        src="https://i.pinimg.com/736x/16/c6/b2/16c6b2a7922b069f8628e7dd0a3f62e4.jpg"
                        alt="Customer Support"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                        <div className="flex items-center gap-3 mb-4"><Mail size={20} /><span>hi.florawear@example.com</span></div>
                        <div className="flex items-center gap-3 mb-4"><Phone size={20} /><span>1-333-345-6868</span></div>
                        <div className="flex items-center gap-3"><MapPin size={20} /><span>abcd street, Noida, India</span></div>
                    </div>
                </div>
            </div>
        </section>
    );
}