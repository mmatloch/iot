import { WidgetContainer } from '@features/widgets';
import { NewWidgetContainer } from '@features/widgets/components/NewWidgetContainer';
import Layout from '@layout/Layout';
import { Box } from '@mui/material';

export default function Home() {
    return (
        <Layout>
            <Box />
            {/* <WidgetContainer /> */}
            <NewWidgetContainer />
        </Layout>
    );
}
