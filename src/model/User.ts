import mongoose, { Schema, Document, Types } from "mongoose";

export interface Message extends Document {
    _id: Types.ObjectId;
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now }
});

export interface User extends Document {
    username: string;
    password: string;
    email: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isVerified: boolean;
    isAccepting: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: [true, "Username is required"], trim: true, unique: true },
    email: {
        type: String, required: [true, "Email is required"], unique: true, match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Please use a valid email address"]
    },
    password: { type: String, required: [true, "Password is required"] },
    verifyCode: { type: String },
    verifyCodeExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    isAccepting: { type: Boolean, default: false },
    messages: [MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema));
export default UserModel;