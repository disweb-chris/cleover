import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import app from "./firebaseConfig";

export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Interfaz para tipar los datos de los clientes
interface Client {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  direccion: string;
  datosFacturacion: {
    razonSocial: string;
    cuit: string;
    direccionFiscal: string;
    condicionIva: string;
  };
  datosMarketing: {
    redesSociales: {
      instagram: string;
      linkedin: string;
    };
    fuenteContacto: string;
    preferenciasComunicacion: string[];
  };
  proyectos: string[];
  notas: {
    notaId: string;
    contenido: string;
    fechaCreacion: string;
    creadoPor: string;
  }[];
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
  try {
    const querySnapshot = await getDocs(collection(db, "clients"));
    const clients: Client[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Client, "id">;
      return { id: doc.id, ...data };
    });
    return clients;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
};

