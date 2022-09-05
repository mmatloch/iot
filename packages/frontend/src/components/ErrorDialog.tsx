import { SentimentVeryDissatisfied, Warning } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    title: string;
    message: string;
}

export default function ErrorDialog({ title, message }: Props) {
    const { t } = useTranslation();

    const retry = () => {
        location.reload();
    };

    return (
        <Dialog open={true}>
            <DialogTitle>
                <Grid container spacing={1}>
                    <Grid item>
                        <SentimentVeryDissatisfied fontSize="large" color="warning" />
                    </Grid>
                    <Grid item>{title}</Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={retry}>{t('generic:retry')}</Button>
            </DialogActions>
        </Dialog>
    );
}
