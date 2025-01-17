import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const BriefingList = ({ projectId }) => {
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBriefing, setEditingBriefing] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchBriefings = async () => {
      try {
        const projectRef = doc(db, 'projects', projectId);
        const briefingsRef = collection(projectRef, 'briefings');
        const snapshot = await getDocs(briefingsRef);
        const briefingData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBriefings(briefingData);
      } catch (error) {
        console.error('Error fetching briefings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBriefings();
  }, [projectId]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este briefing?");
    if (!confirmDelete) return;
    
    try {
      const projectRef = doc(db, 'projects', projectId);
      const briefingRef = doc(projectRef, 'briefings', id);
      await deleteDoc(briefingRef);
      setBriefings(briefings.filter(briefing => briefing.id !== id));
    } catch (error) {
      console.error('Error deleting briefing:', error);
    }
  };

  const handleEdit = (briefing) => {
    setEditingBriefing(briefing.id);
    setEditData(briefing);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const briefingRef = doc(projectRef, 'briefings', editingBriefing);
      await updateDoc(briefingRef, editData);
      setBriefings(briefings.map(briefing => (briefing.id === editingBriefing ? { ...briefing, ...editData } : briefing)));
      setEditingBriefing(null);
    } catch (error) {
      console.error('Error updating briefing:', error);
    }
  };

  if (loading) return <p>Cargando briefings...</p>;

  return (
    <div>
      <h2>Briefings del Proyecto</h2>
      {briefings.length === 0 ? (
        <p>No hay briefings registrados.</p>
      ) : (
        <ul>
          {briefings.map(briefing => (
            <li key={briefing.id}>
              {editingBriefing === briefing.id ? (
                <div>
                  <input type="date" name="meetingDate" value={editData.meetingDate} onChange={handleEditChange} />
                  <input type="text" name="projectGoal" value={editData.projectGoal} onChange={handleEditChange} />
                  <input type="text" name="targetAudience" value={editData.targetAudience} onChange={handleEditChange} />
                  <textarea name="businessDescription" value={editData.businessDescription} onChange={handleEditChange} />
                  <input type="text" name="technicalRequirements" value={editData.technicalRequirements} onChange={handleEditChange} />
                  <input type="number" name="budget" value={editData.budget} onChange={handleEditChange} />
                  <input type="date" name="estimatedDeadline" value={editData.estimatedDeadline} onChange={handleEditChange} />
                  <button onClick={handleUpdate}>Guardar</button>
                  <button onClick={() => setEditingBriefing(null)}>Cancelar</button>
                </div>
              ) : (
                <div>
                  <strong>Fecha de reunión:</strong> {briefing.meetingDate} <br />
                  <strong>Objetivo:</strong> {briefing.projectGoal} <br />
                  <strong>Público Objetivo:</strong> {briefing.targetAudience} <br />
                  <strong>Descripción del Negocio:</strong> {briefing.businessDescription} <br />
                  <strong>Requerimientos Técnicos:</strong> {briefing.technicalRequirements} <br />
                  <strong>Presupuesto:</strong> ${briefing.budget} <br />
                  <strong>Fecha Estimada de Entrega:</strong> {briefing.estimatedDeadline} <br />
                  <button onClick={() => handleEdit(briefing)}>Editar</button>
                  <button onClick={() => handleDelete(briefing.id)}>Eliminar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BriefingList;