import dbConnect from "@/lib/dbConect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        }
        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            const UsernameErrors = result.error.format().username?._errors || [];
            return Response.json({ success: false, message: UsernameErrors?.length > 0 ? UsernameErrors.join(", ") : "Invalid username." }, { status: 400 });

        }
        const { username } = result.data;
        const user = await UserModel.findOne({ username, isVerified: true });
        if (user)
            return Response.json({ success: false, message: "Username already exists." }, { status: 200 });
        return Response.json({ success: true, message: "Username is available." }, { status: 200 });
    } catch (error) {
        console.error("Error checking username:", error);
        return Response.json({ success: false, message: "Failed to check username." }, { status: 500 });
    }
}