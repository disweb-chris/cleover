import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import app from "./firebaseConfig";

export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Interfaz para tipar los datos de los clientes
interface Client {
  id: string;
  name: string;
}

// ✅ Función para agregar un cliente (sin `any`)
export const addClient = async (clientData: Omit<Client, "id">): Promise<void> => {
  try {
    const docRef = await addDoc(collection(db, "clients"), clientData);
    console.log("Cliente agregado con ID:", docRef.id);
  } catch (error) {
    console.error("Error al agregar cliente:", error);
  }
};

// ✅ Función para obtener todos los clientes
export const getClients = async (): Promise<Client[]> => {
  const querySnapshot = await getDocs(collection(db, "clients"));
  const clients: Client[] = [];

  querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
    const data = doc.data() as Omit<Client, "id">;
    clients.push({ id: doc.id, ...data });
  });

  return clients;
};
