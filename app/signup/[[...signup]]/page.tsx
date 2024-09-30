import { SignUp } from '@clerk/nextjs';


export default function SignUpPage() {
	return (
		<div className="relative h-screen w-full overflow-hidden bg-gray-900">
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
				<SignUp />
			</div>
		</div>
	);
}
