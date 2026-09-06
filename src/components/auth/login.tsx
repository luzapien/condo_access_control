import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import { toast } from 'sonner';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error('Credenciales incorrectas o error al iniciar sesión.');
      console.error(error);
    } else {
      toast.success('¡Bienvenido a la caseta!');
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f4] px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-6">
        
        {/* Encabezado del Login */}
        <div className="text-center space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#344c3d]">
            COTO PARQUE ARRAYANES 6
          </div>
          <h1 className="text-xl font-bold text-stone-900">Acceso a Seguridad</h1>
          <p className="text-xs text-stone-500">Ingresa tus credenciales de guardia o administrador</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guardia1@arrayanes6.com"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-[#fafbfa] border border-stone-300 rounded-xl focus:ring-4 focus:ring-[#344c3d]/20 focus:outline-none focus:bg-white text-stone-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-[#fafbfa] border border-stone-300 rounded-xl focus:ring-4 focus:ring-[#344c3d]/20 focus:outline-none focus:bg-white text-stone-900 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2d4a3e] hover:bg-[#253d33] active:bg-[#1a2d25] text-white font-bold py-3 px-4 rounded-xl shadow-md transition active:scale-[0.98] cursor-pointer text-sm"
          >
            {loading ? 'Iniciando sesión...' : 'Entrar al Sistema'}
          </button>
        </form>

      </div>
    </div>
  );
}
