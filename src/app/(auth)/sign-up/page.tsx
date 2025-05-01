'use client';

import React, { useState } from 'react';
import { useSignUp, useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { toast } from "sonner";
import { Eye, EyeOff, LoaderIcon } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {

    const { isLoaded, signUp, setActive } = useSignUp();
    const { signIn } = useSignIn();

    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [code, setCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        if (!firstName || !emailAddress || !password) {
            return toast.warning("Please fill in all fields");
        }

        setIsLoading(true);

        try {
            await signUp.create({
                emailAddress,
                password
            });

            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

            await signUp.update({
                username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
                unsafeMetadata: {
                    firstName,
                    lastName
                }
            });
            setVerified(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));

            if (err.clerkError) {
                toast.error(err.errors[0].longMessage)
            }

            switch (err.errors[0]?.code) {
                case "form_identifier_exists":
                    toast.error("This email is already registered. Please sign in.");
                    break;
                case "form_password_pwned":
                    toast.error("The password is too common. Please choose a stronger password.");
                    break;
                case "form_param_format_invalid":
                    toast.error("Invalid email address. Please enter a valid email address.");
                    break;
                case "form_password_length_too_short":
                    toast.error("Password is too short. Please choose a longer password.");
                    break;
                default:
                    toast.error("An error occurred. Please try again");
                    break;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        if (!code) {
            return toast.warning("Verification code is required");
        }

        setIsVerifying(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                router.push('/auth-callback');
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
                toast.error("Invalid verification code");
            }
        } catch (err: any) {
            console.error('Error:', JSON.stringify(err, null, 2));
            toast.error("An error occurred. Please try again");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (!isLoaded || !signIn) return;
        try {
            console.log("got here");

            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/dashboard",
                redirectUrlComplete: '/auth-callback'
            });
        } catch (err) {
            console.error('Google sign-in error:', err);
            toast.error('Failed to sign in with Google. Please try again.');
        }
    };

    return verified ? (
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center hc gap-y-6">
            <div className="w-full">
                <h1 className="text-2xl font-bold">
                    Please check your email
                </h1>
                <p className="text-sm text-muted-foreground">
                    We&apos;ve sent a verification code to {emailAddress}
                </p>
            </div>
            <form onSubmit={handleVerify} className="w-full max-w-sm text-center">
                <Label htmlFor="code">
                    Verification code
                </Label>
                <InputOTP
                    maxLength={6}
                    value={code}
                    disabled={isVerifying}
                    onChange={(e) => setCode(e)}
                    className="pt-2"
                >
                    <InputOTPGroup className="justify-center w-full">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <Button size="lg" type="submit" disabled={isVerifying} className="w-full mt-4">
                    {isVerifying ? (
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : "Verify"}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                    Back to signup
                    <Button size="sm" variant="link" type="button" disabled={isVerifying} onClick={() => setVerified(false)}>
                        Sign up
                    </Button>
                </p>
            </form>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center hc gap-y-6">
            <h1 className="text-2xl text-center font-bold">Sign up</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <Label htmlFor="firstName">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            disabled={isLoading}
                            placeholder="Enter your first name"
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="lastName">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            disabled={isLoading}
                            placeholder="Enter your last name"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <Label htmlFor="email">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        disabled={isLoading}
                        value={emailAddress}
                        placeholder="Enter your email address"
                        onChange={(e) => setEmailAddress(e.target.value)}
                    />
                </div>
                <div className="mt-4 space-y-2">
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <div className="relative w-full">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            disabled={isLoading}
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={isLoading}
                            className="absolute top-1 right-1"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ?
                                <EyeOff className="w-4 h-4" /> :
                                <Eye className="w-4 h-4" />
                            }
                        </Button>
                    </div>
                </div>
                <div id='clerk-captcha' />
                <div className="mt-4">
                    <Button size="lg" type="submit" disabled={isLoading} className="w-full bg-transparent hover:text-white border text-black">
                        {isLoading ? (
                            <LoaderIcon className="w-4 h-4 animate-spin" />
                        ) : "Continue"}
                    </Button>
                    <Button size="lg" type="button" onClick={handleGoogleSignIn} className="w-full mt-4">
                        Sign in with Google
                    </Button>
                </div>
                <div className="mt-4 flex">
                    <p className="text-sm text-muted-foreground text-center w-full">
                        Already a member? <Link href="/sign-in" className="text-foreground">Sign in</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};