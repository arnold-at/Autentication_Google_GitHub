import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) redirect("/signIn");

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Bienvenido, <span className="font-semibold">{session.user?.name}</span>
        </p>
        <div className="flex gap-4">
          <Link
            href="/profile"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Ver Perfil
          </Link>
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}