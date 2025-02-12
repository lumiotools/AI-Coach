import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  const appearance = {
    baseTheme: dark,
    elements: {
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
      card: "bg-gray-800 shadow-xl border border-gray-700",
      headerTitle: "text-2xl font-bold text-white",
      headerSubtitle: "text-gray-400",
      formFieldInput: "bg-gray-700 text-white border-gray-600",
      formFieldLabel: "text-gray-300",
      footerActionLink: "text-blue-400 hover:text-blue-300",
      identityPreviewText: "text-gray-300",
      identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
    },
  };
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        {/* <SignIn redirectUrl="https://agentcoach-ai-new.vercel.app/ai" forceRedirectUrl="https://agentcoach-ai-new.vercel.app/ai" signUpUrl='https://agentcoach-ai-new.vercel.app/ai'/> */}
        <SignIn
          appearance={appearance}
          signUpUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/signup`}
        />
      </div>
    </div>
  );
}
