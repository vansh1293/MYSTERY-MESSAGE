'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


const Page = () => {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [Submitting, setSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 500);
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    useEffect(() => {
        const checkUsernameUniqueness = async () => {
            if (!username) {
                setUsernameMessage("");
                return;
            }
            setIsCheckingUsername(true);
            try {
                const response = await axios.get(`/api/check-username-unique?username=${username}`);
                setUsernameMessage(response.data.message);

            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError.response?.data.message || "Failed to check username.");
            } finally {
                setIsCheckingUsername(false);
            }
        }
        checkUsernameUniqueness();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast.success(response.data.message);
            router.replace(`/verify/${data.username}`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            if (axiosError.response) {
                toast.error(axiosError.response.data.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join the Mystery Message Community
                    </h1>
                    <p className="mb-4">Sign up to start chatting with others!</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your username" {...field} onChange={(e) => {
                                            field.onChange(e);
                                            debounced(e.target.value);
                                        }} />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                    <p className={`text-sm ${usernameMessage === "Username is available." ? "text-green-500" : "text-red-500"}`}>{usernameMessage}</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
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
                                ) : ('Sign Up')
                            }
                        </Button>
                    </form>
                </Form>
                <div className="mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account? <Link href="/sign-in" className="text-blue-500 hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page 