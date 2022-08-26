import { useAuth } from '@hooks/useAuth';
import { Button } from '@mui/material';

export default function Home() {
    const auth = useAuth();

    const logout = () => {
        auth?.logout();
    };

    return (
        <div>
            <h1>Home</h1>
            <Button onClick={logout}>Logout</Button>
        </div>
    );
}
