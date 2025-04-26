
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

export interface Member { id:number; name:string; role:string; }
interface AuthContextType {
  member: Member | null;
  token: string | null;
  login: (email:string,password:string)=>Promise<void>;
  logout: ()=>void;
}
export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: {children:ReactNode}) {
  const [member, setMember] = useState<Member|null>(null);
  const [token, setToken] = useState<string|null>(null);
  const router = useRouter();

  useEffect(()=>{
    const t = localStorage.getItem('token');
    if(t) {
      setToken(t);
      fetch('/api/me',{ headers:{ Authorization:`Bearer ${t}`} })
        .then(r=>r.json())
        .then(m=>setMember(m))
        .catch(()=>{ localStorage.removeItem('token'); setToken(null); });
    }
  },[]);

  async function login(email:string,password:string) {
    const res = await fetch('http://localhost:8000/api/login',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    if(!res.ok) throw new Error('Login failed');
    const { token, member } = await res.json();
    localStorage.setItem('token', token);
    setToken(token);
    setMember(member);
    router.push('/');
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setMember(null);
    router.push('/login');
  }

  return <AuthContext.Provider value={{member, token, login, logout}}>
    {children}
  </AuthContext.Provider>;
}
