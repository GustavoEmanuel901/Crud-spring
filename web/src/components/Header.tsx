import { useNavigate } from 'react-router-dom';
import { clearTokens } from '@/utils/tokenManager';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-10 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Clientes</h1>
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
