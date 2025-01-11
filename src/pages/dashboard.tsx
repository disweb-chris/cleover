import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../services/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function DashboardPage() {
  const router = useRouter();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Dashboard</h1>
      <p>Bienvenido al Dashboard. Solo los usuarios autenticados pueden ver esta página.</p>
      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Cerrar sesión
      </button>
    </div>
  );
}
