'use client'

import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";

const page = () => {
    const [message, setMessage] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSwitchedLoading, setIsSwitchedLoading] = useState<boolean>(false);
    const [profileUrl, setProfileUrl] = useState('');

    const handleDeleteMessage = (messageId: string) => {
        setMessage(prevMessages => prevMessages.filter(message => message._id.toString() !== messageId));
    }
    const { data: session } = useSession();
    const form = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema)
    })
    const { register, watch, setValue } = form;
    const acceptMessage = watch("isAccepting");
    const fetchAcceptMessage = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get<ApiResponse>("/api/accept-message");
            setValue("isAccepting", response.data.isAccepting ?? false);
        } catch (error) {
            console.error("Error accepting message:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to accept message.");
        } finally {
            setLoading(false);
        }
    }, [setValue])
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true);
        setIsSwitchedLoading(true);
        try {
            const response = await axios.get<ApiResponse>("/api/get-messages");
            setMessage(response.data.messages || []);
            if (refresh) {
                toast.success("Messages refreshed successfully.");
            }
            setIsSwitchedLoading(false);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to accept message.");
        } finally {
            setLoading(false);
        }
    }, [setLoading, setMessage]);
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>("/api/accept-message", { acceptMessage: !acceptMessage });
            setValue("isAccepting", !acceptMessage);
            toast(response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to accept message.");
        }
    }
    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessage();
    }, [session, fetchMessages, fetchAcceptMessage, setValue])
    useEffect(() => {
        if (typeof window !== "undefined" && session?.user?.username) {
            const base = `${window.location.protocol}//${window.location.host}`;
            setProfileUrl(`${base}/u/${session.user.username}`);
        }
    }, [session]);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Copied to clipboard!");
    }
    if (!session || !session.user) {
        return (
            <div>Unauthorized! Please login</div>
        )
    }
    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Profile Link:</h2>{' '}
                <div className="flex items-centre">
                    <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2" />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>
            <div className="mb-4">
                <Switch {...register("isAccepting")} checked={acceptMessage} onCheckedChange={handleSwitchChange} disabled={isSwitchedLoading} />
                <span className="ml-2">Accepting Messages: {acceptMessage ? "On" : "Off"}</span>
            </div>
            <Separator />
            <Button className="mt-4" variant="outline" onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
            }}>
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )
                }
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {
                    message.length > 0 ? (
                        message.map((m, index) => (
                            <MessageCard key={index} message={m} onMessageDelete={handleDeleteMessage} />
                        ))
                    ) : (
                        <p className="text-gray-600">No messages found.</p>
                    )
                }
            </div>
        </div>
    )
}

export default page