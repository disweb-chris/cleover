export default function Home() {
    return (
      <main>
        <h1>Bienvenido a Cleover 🎉</h1>
        <p>Gestión de proyectos digitales de forma simple y eficiente.</p>
  
        <div style={{ marginTop: '20px' }}>
          <h2>Secciones:</h2>
          <ul>
            <li><a href="/clients">Clientes</a></li>
            <li><a href="/projects">Proyectos</a></li>
            <li><a href="/auth">Autenticación</a></li>
          </ul>
        </div>
      </main>
    );
  }
  