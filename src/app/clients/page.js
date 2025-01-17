'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        const clientsData = [];
        querySnapshot.forEach((doc) => {
          clientsData.push({ id: doc.id, ...doc.data() });
        });
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients: ', error);
      }
    };

    fetchClients();
  }, []);

  return (
    <main>
      <h1>Lista de Clientes</h1>
      {clients.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              <strong>{client.name}</strong> - {client.email}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
