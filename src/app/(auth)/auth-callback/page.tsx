import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import User from '@/models/User';

const AuthCallbackPage = async () => {

    const user = await currentUser();

    if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
        return redirect("/sign-in");
    }

    await connectDB();

    const dbUser = await User.findOne({
        clerkId: user.id,
    });


    const isGoogleLogin = user.externalAccounts?.some(account => account.provider === 'oauth_google');

    if (!dbUser) {
        await User.create({
            _id: user.id,
            clerkId: user.id,
            username: user.username,
            email: user.primaryEmailAddress.emailAddress,
            firstName: isGoogleLogin ? user.firstName : user.unsafeMetadata.firstName,
            lastName: isGoogleLogin ? user.lastName : user.unsafeMetadata.lastName,
            profileImageUrl: user.imageUrl
        });

        return redirect("/dashboard");
    } else {
        return redirect("/");
    }
};

export default AuthCallbackPage;
