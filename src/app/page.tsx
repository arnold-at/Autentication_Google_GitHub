import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
          <p className="text-gray-500 mt-2">
            Plataforma de autenticación con NextAuth.js
          </p>
        </div>

        {session ? (
          <div className="flex flex-col gap-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 font-medium">
                👋 Hola, {session.user?.name}
              </p>
              <p className="text-green-500 text-sm">{session.user?.email}</p>
            </div>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium"
            >
              Ir al Dashboard →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Link
              href="/signIn"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
            >
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </main>
  );

  
}