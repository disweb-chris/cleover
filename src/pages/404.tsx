import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Página no encontrada 🧐</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <p>Puedes volver al inicio haciendo clic en el botón de abajo:</p>
      <Link href="/">
        <button style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
          Volver al Inicio
        </button>
      </Link>
    </div>
  );
}
