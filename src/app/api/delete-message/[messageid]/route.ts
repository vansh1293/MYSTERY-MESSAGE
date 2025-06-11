import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const { messageid } = await params;
    console.log("Deleting message with ID:", messageid);
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;
    if (!session || !user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    try {
        const result = await UserModel.updateOne(
            { _id: new mongoose.Types.ObjectId(user._id) },
            { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageid) } } }
        );
        console.log("Update result:", result);
        if (result.modifiedCount === 0) {
            return Response.json({ success: false, message: "Message not found or already deleted" }, { status: 404 });
        }
        return Response.json({ success: true, message: "Message deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting message:", error);
        return Response.json({ success: false, message: "Error deleting message" }, { status: 500 });
    }
}
