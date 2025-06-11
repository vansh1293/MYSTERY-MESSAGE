# 🕵️‍♂️ Mystery Message

Mystery Message is a full-stack anonymous messaging platform built using **Next.js** (App Router) and **TypeScript**. Users can sign up, receive a verification email, and then receive anonymous messages via a public profile link. Additionally, the app integrates the **Gemini API** to provide real-time message suggestions using streaming AI.

---

## 🚀 Features

- ✅ User Signup with Email Verification (via Nodemailer)
- 🔐 Secure Sign-In using NextAuth
- 📬 Public Profile Page to Receive Anonymous Messages
- 🧾 Dashboard to View Received Messages and Copy Profile Link
- 🤖 Real-time Message Suggestions via Gemini AI API
- 🔗 Clean Route Structure with Dynamic Routing (`/u/[username]`)

---

## 🧑‍💻 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **MongoDB** with Mongoose
- **NextAuth.js**
- **Nodemailer**
- **Gemini API**
- **Zod** (form validation)
- **Tailwind CSS** + **Shadcn/UI**

---

## 🌐 Live Demo

Coming Soon...

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
GEMINI_API_KEY=your_gemini_api_key
NODEMAILER_EMAIL=your_email_address
NODEMAILER_PASS=your_email_app_password
```

ℹ️ If using Gmail for `NODEMAILER_EMAIL`, make sure you enable 2FA and generate an App Password.

---

## 🛠️ Getting Started

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/mystery-message.git
cd mystery-message
```

2. **Install Dependencies**

```bash
npm install
```

3. **Add Environment Variables**

Refer to the `.env` setup above.

4. **Run the Development Server**

```bash
npm run dev
```

---

## 🔄 Authentication Flow

- User signs up with email & password.
- A verification code is emailed using Nodemailer.
- User verifies the code and then signs in via NextAuth.
- After login, user is redirected to a dashboard.

---

## 📬 Public Profile Flow

- Every user has a profile at: `/u/<username>`
- Anyone can send an anonymous message via this public page.

---

## 🧠 Gemini API

- Real-time, streamed message suggestions powered by the Gemini AI API.
- Suggestions appear as you type or when viewing anonymous messages.

---

## 💡 Future Enhancements

- 📱 Mobile responsive improvements
- 🔔 Notifications for new messages
- ✉️ Auto AI-replies using Gemini
- 🧪 Unit tests and integration tests
- 🗃️ Message filters and analytics

---

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/)
- [MongoDB](https://mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Nodemailer](https://nodemailer.com/)
- [Gemini AI](https://ai.google.dev/)
- [Shadcn/UI](https://ui.shadcn.com/)

---

✨ Created with ❤️ by **Vansh Arora**
