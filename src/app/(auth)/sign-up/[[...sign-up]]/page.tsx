import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-purple-600 hover:bg-purple-700 text-white",
            card: "bg-[#1a1a1a] border border-[#333]",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton:
              "bg-[#252525] border-[#333] text-white hover:bg-[#333]",
            formFieldLabel: "text-gray-300",
            formFieldInput:
              "bg-[#252525] border-[#333] text-white focus:ring-purple-500",
            footerActionLink: "text-purple-400 hover:text-purple-300",
          },
        }}
      />
    </div>
  );
}
