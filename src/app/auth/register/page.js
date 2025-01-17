'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Crear documento en Firestore
      await setDoc(doc(db, 'clients', user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });

      alert('Usuario registrado exitosamente 🎉');
      router.push('/auth/login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('El correo electrónico ya está registrado. Por favor, intenta iniciar sesión.');
      } else {
        alert('Ocurrió un error al registrar el usuario: ' + error.message);
      }
    }
  };

  return (
    <main>
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </main>
  );
}
