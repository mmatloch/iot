import { Card, CardContent } from '@mui/material';

import SignInForm from './SignInForm';

export default function SignInCard() {
    return (
        <Card sx={{ p: 3 }}>
            <CardContent>
                <SignInForm />
            </CardContent>
        </Card>
    );
}
