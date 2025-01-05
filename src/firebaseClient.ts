import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import app from "./firebaseConfig";

export const auth = getAuth(app);
export const db = getFirestore(app);

// Función para agregar un cliente
export const addClient = async (clientData: any) => {
  try {
    const docRef = await addDoc(collection(db, "clients"), clientData);
    console.log("Cliente agregado con ID:", docRef.id);
  } catch (error) {
    console.error("Error al agregar cliente:", error);
  }
};

// Función para obtener todos los clientes
export const getClients = async () => {
  const querySnapshot = await getDocs(collection(db, "clients"));
  const clients: any[] = [];
  querySnapshot.forEach((doc) => {
    clients.push({ id: doc.id, ...doc.data() });
  });

  return clients;
};
