'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
    }
  };

  return (
    <main>
      <h1>Bienvenido al Dashboard 🎉</h1>
      {user && (
        <p>
          Hola, <strong>{user.email}</strong> 👋
        </p>
      )}

      <div style={{ marginTop: '20px' }}>
        <h2>Navegación rápida:</h2>
        <ul>
          <li>
            <a href="/clients">Ver Clientes</a>
          </li>
          <li>
            <a href="/projects">Ver Proyectos</a>
          </li>
        </ul>
      </div>

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Cerrar Sesión
      </button>
    </main>
  );
}
