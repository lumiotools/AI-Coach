import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
	return (
		<div className="relative h-screen w-full overflow-hidden bg-gray-900">
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
				{/* <SignIn redirectUrl="https://agentcoach-ai-new.vercel.app/ai" forceRedirectUrl="https://agentcoach-ai-new.vercel.app/ai" signUpUrl='https://agentcoach-ai-new.vercel.app/ai'/> */}
				<SignIn signUpUrl={`${process.env.NEXT_PUBLIC_APP_URL}/signin`}/>
			</div>
		</div>
	);
}
