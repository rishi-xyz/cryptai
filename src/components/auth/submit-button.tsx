"use client";

import { useFormStatus } from "react-dom";

import { Loader2Icon } from "lucide-react";

import { Button } from "../ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type={pending ? "button" : "submit"}
            aria-disabled={pending}
            variant={"fushia"}
            className="border-2 border-fuchsia-500/30 hover:border-fuchsia-500 hover:cursor-pointer hover:bg-fuchsia-500/30 rounded-lg"
        >
            {children}
            {
                pending && (
                    <span className="animate-spin absolute right-4">
                        <Loader2Icon />
                    </span>
                )
            }
            <span aria-live="polite" className="sr-only" role="status">
                {pending ? "Loading" : "Submit form"}
            </span>
        </Button >
    );
}