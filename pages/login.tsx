import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../src/firebaseClient";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ Función para validar el email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ✅ Función para iniciar sesión
  const handleLogin = async () => {
    setError(""); // Limpiar errores anteriores

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // ✅ Redirigir al Dashboard después de iniciar sesión
    } catch (err) {
      if (err instanceof Error) {
        setError("Error al iniciar sesión: " + err.message);
      }
    }
  };

  // ✅ Función para registrarse
  const handleRegister = async () => {
    setError(""); // Limpiar errores anteriores

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // ✅ Redirigir al Dashboard después de registrarse
    } catch (err) {
      if (err instanceof Error) {
        setError("Error al registrarse: " + err.message);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{isRegistering ? "Registro" : "Iniciar Sesión"}</h1>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      {isRegistering ? (
        <button onClick={handleRegister}>Registrarse</button>
      ) : (
        <button onClick={handleLogin}>Iniciar Sesión</button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <br />
      <p>
        {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Inicia sesión" : "Regístrate"}
        </span>
      </p>
    </div>
  );
}
