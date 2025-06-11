'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"


const Page = () => {
    const [Submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    });
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setSubmitting(true);
        const res = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });
        console.log(res);
        if (res?.error) {
            toast.error("Invalid credentials. Please try again.");
        }
        else {
            toast.success("Successfully signed in!");
        }
        if (res?.url) {
            router.replace("/dashboard");
        }
        setSubmitting(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join the Mystery Message Community
                    </h1>
                    <p className="mb-4">Sign In to start chatting with others!</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email or Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={Submitting}>
                            {
                                Submitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : ('Sign In')
                            }
                        </Button>
                    </form>
                </Form>
                <div className="mt-4">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account? <Link href="/sign-up" className="text-blue-500 hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page 