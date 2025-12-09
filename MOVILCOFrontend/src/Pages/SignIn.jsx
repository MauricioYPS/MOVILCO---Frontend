import React, { useState } from 'react';
import AuthLayout from './auth/AuthLayout';
import Login from './Login';
import Register from './Register';

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthLayout
      title={isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta'}
      subtitle={
        isLogin
          ? 'Ingresa tus credenciales para acceder al panel.'
          : 'Completa tus datos para solicitar acceso al portal.'
      }
    >
      {isLogin ? <Login withLayout={false} /> : <Register withLayout={false} />}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <button
            onClick={() => setIsLogin((prev) => !prev)}
            className="ml-2 font-bold text-red-600 hover:text-red-500 transition-colors focus:outline-none hover:underline"
          >
            {isLogin ? 'Solicita acceso aquí' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
