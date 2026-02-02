import FormLogin from '@/components/FormLogin';
// import { useNavigate } from 'react-router-dom';

export default function Login() {
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     // Salva um token/autenticação no localStorage
//     localStorage.setItem('isAuthenticated', 'true');
//     navigate('/cliente');
//   };

  return <FormLogin disableShowPasswordField={true} showFooterLinks={false} />
    
    
  
}
