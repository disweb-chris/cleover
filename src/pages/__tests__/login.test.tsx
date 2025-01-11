import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../login';

describe('LoginPage', () => {
  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
  });

  it('shows an error if fields are empty', () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i }); // ✅ Cambiado
    fireEvent.click(loginButton);
    expect(screen.getByText('Por favor, completa todos los campos.')).toBeInTheDocument();
  });
});
