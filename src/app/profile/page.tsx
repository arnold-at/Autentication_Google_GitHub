import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signIn");

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full mx-auto mb-4"
          />
        )}
        <h2 className="text-xl font-bold text-gray-800">{session.user?.name}</h2>
        <p className="text-gray-500 mb-6">{session.user?.email}</p>
        <LogoutButton />
      </div>
    </main>
  );
}