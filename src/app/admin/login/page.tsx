import { login } from "../actions";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const hasError = params?.error === "true";
  const isRateLimited = params?.error === "ratelimit";

  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  let mainSiteUrl = "/";
  if (host.startsWith("admin.")) {
    const protocol = host.includes("localhost") ? "http" : "https";
    mainSiteUrl = `${protocol}://${host.replace("admin.", "")}`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#001f3f] mb-6">Painel Mineira Master</h1>
        {hasError && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm text-center border border-red-200">
            Credenciais inválidas.
          </div>
        )}
        {isRateLimited && (
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded mb-4 text-sm text-center border border-yellow-200">
            Muitas tentativas de login. Aguarde alguns minutos e tente novamente.
          </div>
        )}
        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:ring-[#0074D9] focus:border-[#0074D9] outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:ring-[#0074D9] focus:border-[#0074D9] outline-none" 
            />
          </div>
          <button type="submit" className="w-full bg-[#001f3f] text-white py-3 font-bold uppercase rounded-md hover:bg-[#0074D9] transition-colors mt-4">
            Entrar
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <a 
            href={mainSiteUrl} 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0074D9] transition-colors"
          >
            <ArrowLeft size={16} /> Voltar para o Site Principal
          </a>
        </div>
      </div>
    </div>
  );
}
