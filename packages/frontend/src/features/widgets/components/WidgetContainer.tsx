import Antenna from '@assets/icons/antenna.png';
import CleanWater from '@assets/icons/clean-water.png';
import Idea from '@assets/icons/idea.png';
import Server from '@assets/icons/server.png';
import Thermometer from '@assets/icons/thermometer.png';
import Router from '@assets/icons/wireless-router.png';
import { Switch, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { Widget } from './Widget';
import { WidgetGridItem, WidgetSize } from './WidgetGridItem';

export const WidgetContainer = () => {
    return (
        <Grid container spacing={2}>
            <WidgetGridItem size={WidgetSize.Small}>
                <Widget
                    icon={CleanWater}
                    title={'Zawór ogrodowy'}
                    content={<Typography variant="caption">Uruchomiony od 37 minut</Typography>}
                    action={<Switch defaultChecked color="success" />}
                />
            </WidgetGridItem>
            <WidgetGridItem size={WidgetSize.Small}>
                <Widget
                    icon={Thermometer}
                    title={'Termometr w szklarni'}
                    content={<Typography variant="caption">27{'\u00b0'}C | 80%</Typography>}
                />
            </WidgetGridItem>
            <WidgetGridItem size={WidgetSize.Small}>
                <Widget
                    icon={Idea}
                    title={'Żarówka'}
                    content={<Typography variant="caption">jasność 80% czerwony</Typography>}
                    action={<Switch defaultChecked color="success" />}
                />
            </WidgetGridItem>
            <WidgetGridItem size={WidgetSize.Large}>
                <Widget
                    icon={Server}
                    title={'Serwer'}
                    content={<Typography variant="caption">66{'\u00b0'}C | 11.23% | 2660MB</Typography>}
                />
            </WidgetGridItem>
            <WidgetGridItem size={WidgetSize.Small}>
                <Widget icon={Antenna} title={'Router bez obudowy'} />
            </WidgetGridItem>
            <WidgetGridItem size={WidgetSize.Small}>
                <Widget icon={Router} title={'Koordynator'} />
            </WidgetGridItem>

            <WidgetGridItem size={WidgetSize.Small}>
                <Widget icon={Router} title={'Testowe urządzenie'} />
            </WidgetGridItem>
        </Grid>
    );
};
