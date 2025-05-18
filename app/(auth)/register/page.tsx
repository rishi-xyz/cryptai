"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react"; // Import signIn

import { AuthForm } from "@/src/components/auth/auth-form";
import { SubmitButton } from "@/src/components/auth/submit-button";

import { register, RegisterActionState } from "@/src/auth/actions";
import { Button } from "@/src/components/ui/button";
import { Hexagon } from "@/src/components/globals/hexagon";

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [state, formAction] = useActionState<RegisterActionState, FormData>(
        register,
        {
            status: "idle",
        },
    );

    useEffect(() => {
        if (state.status === "user_exists") {
            toast.error("Account already exists");
        } else if (state.status === "failed") {
            toast.error("Failed to create account");
        } else if (state.status === "invalid_data") {
            toast.error("Failed validating your submission!");
        } else if (state.status === "success") {
            toast.success("Account created successfully");
            router.refresh();
        }
    }, [state, router]);

    const handleSubmit = (formData: FormData) => {
        setEmail(formData.get("email") as string);
        formAction(formData);
    };

    return (
        <section className="overflow-clip">
            <section className="relative min-h-screen w-full">
                <div className="absolute inset-0 z-0">
                    <div className="absolute">
                        <Hexagon size={1200} />
                    </div>
                </div>
                {/* Foreground content (sign-up box) */}
                <div className="relative z-10 flex justify-center items-center min-h-screen px-4 sm:px-12">
                    <div className="w-full max-w-md bg-black/30 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-lg">
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                            <h3 className="text-xl font-semibold dark:text-zinc-50">Sign Up</h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">
                                Create an account on CryptAI
                            </p>
                        </div>

                        {/* OAuth buttons */}
                        <div className="flex flex-col gap-3 mt-6">
                            <Button
                                onClick={() => signIn("google")}
                                variant="fushia"
                                className="border-2 border-fuchsia-500/30 hover:border-fuchsia-500 hover:bg-fuchsia-500/30"
                            >
                                Sign up with Google
                            </Button>
                            <Button
                                onClick={() => signIn("github")}
                                variant="fushia"
                                className="border-2 border-fuchsia-500/30 hover:border-fuchsia-500 hover:bg-fuchsia-500/30"
                            >
                                Sign up with GitHub
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center justify-center gap-4 my-6">
                            <div className="h-px flex-1 bg-white/20" />
                            <span className="text-sm text-white/80">OR</span>
                            <div className="h-px flex-1 bg-white/20" />
                        </div>

                        {/* Auth form */}
                        <AuthForm action={handleSubmit} defaultEmail={email}>
                            <SubmitButton>Sign Up</SubmitButton>
                            <p className="text-center text-sm text-white mt-4 dark:text-zinc-400">
                                {"Already have an account? "}
                                <Link
                                    href="/login"
                                    className="font-semibold text-fuchsia-500 hover:underline dark:text-zinc-200"
                                >
                                    Sign in
                                </Link>{" "}
                                instead.
                            </p>
                        </AuthForm>
                    </div>
                </div>
            </section>
        </section>
    );
}
