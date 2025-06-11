'use client'
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { messageSchema } from "@/schemas/messageSchema"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
const page = () => {
    const [Sending, setSending] = useState(false);
    const [Generation, setGeneration] = useState<string>('');
    const [loadingGeneration, setLoadingGeneration] = useState(false);
    const param = useParams<{ username: string }>();
    const username = param.username;
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    })
    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            setSending(true);
            const response = await axios.post<ApiResponse>('/api/send-message', {
                username: username,
                content: data.content
            });
            toast.success(response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            if (axiosError.response) {
                toast.error(axiosError.response.data.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setSending(false);
        }
    }
    const getAISuggestion = async () => {
        setLoadingGeneration(true);
        try {
            setGeneration('');
            const res = await fetch("/api/suggest-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) {
                setGeneration("Something went wrong.");
                return;
            }
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                for (const char of chunk) {
                    await new Promise((res) => setTimeout(res, 15));
                    setGeneration((prev) => prev + char);
                }
            }
        } catch (error) {
            toast.error("Failed to generate message.");
            console.error(error);
        } finally {
            setLoadingGeneration(false);
        }
    };


    return (
        <>
            <main className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Public Profile Link</h1>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-lg font-medium mb-1">
                                            Send Anonymous Message to <span className="text-indigo-600">@{username}</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Write any anonymous message here"
                                                className="h-14 px-4 text-base border rounded-md w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <Button type="submit" className=" px-6 py-3 rounded-md" disabled={Sending}>
                                    {Sending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send It'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <div className="mt-10">
                        <Button onClick={getAISuggestion} className="w-full md:w-auto">
                            {Generation ? "Regenerate" : "Suggest Messages"}
                        </Button>

                        <p className="text-sm mt-4 text-gray-600">Click on any message below to select it.</p>

                        <div className="mt-4 flex flex-col gap-2">
                            {loadingGeneration && (
                                <p className="text-gray-400">Generating questions...</p>
                            )}
                            {Generation.split("||").map((question, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => form.setValue("content", question.trim())}
                                    className="px-4 py-3 bg-gray-100 hover:bg-indigo-100 text-gray-700 rounded-md cursor-pointer transition"
                                >
                                    {question.trim()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default page
