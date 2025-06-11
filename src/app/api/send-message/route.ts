import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConect";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { Message } from "@/model/User"

const MessageQuerySchema = z.object({
    mesaage: messageSchema,
});

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        if (!user.isAccepting)
            return Response.json({ success: false, message: "User is not accepting messages" }, { status: 403 });
        const result = MessageQuerySchema.safeParse({ mesaage: { content: content } });
        console.log(result);
        if (!result.success) {
            const messageErrors = result.error.format().mesaage?._errors || [];
            return Response.json({ success: false, message: messageErrors.length > 0 ? messageErrors.join(", ") : "Invalid message." }, { status: 400 });
        }
        const message = { content, createdAt: new Date() };
        user.messages.push(message as Message);
        await user.save();
        return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending message:", error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}