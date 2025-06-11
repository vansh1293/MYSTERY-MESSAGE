import dbConnect from "@/lib/dbConect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, verifyCode } = await request.json();
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({ success: false, message: "User not found." }, { status: 404 });
        }
        console.log("Verifying code for user:", user.username);
        console.log("Provided verifyCode:", verifyCode);
        const isValid = user.verifyCode === verifyCode;
        const isExpired = new Date(user.
            verifyCodeExpires) > new Date();
        if (isValid && isExpired) {
            user.isVerified = true;
            user.verifyCode = "";
            user.verifyCodeExpires = new Date(0);
            await user.save();
            return Response.json({ success: true, message: "Account verified successfully." }, { status: 200 });
        }
        if (!isExpired) {
            return Response.json({ success: false, message: "Verification code has expired,Please Sign up again." }, { status: 400 });
        }
        return Response.json({ success: false, message: "Invalid code." }, { status: 400 });
    } catch (error) {
        console.error("Error verifying code:", error);
        return Response.json({ success: false, message: "Failed to verify code." }, { status: 500 });
    }
}