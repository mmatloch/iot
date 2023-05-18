import Antenna from '@assets/icons/antenna.png';
import CleanWater from '@assets/icons/clean-water.png';
import Idea from '@assets/icons/idea.png';
import Server from '@assets/icons/server.png';
import Thermometer from '@assets/icons/thermometer.png';
import Router from '@assets/icons/wireless-router.png';
import { Switch, Typography } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { Widget } from './Widget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const cols = {
    lg: 12,
    md: 6,
    sm: 6,
    xs: 6,
    xxs: 1,
};

const breakpoints = {
    lg: 1900,
    md: 800,
    sm: 768,
    xs: 480,
    xxs: 0,
};

export const WidgetContainer = () => {
    return (
        <ResponsiveGridLayout className="layout" cols={cols} breakpoints={breakpoints}>
            {/* <div key="1">
                <Widget
                    icon={CleanWater}
                    title={'Zawór ogrodowy'}
                    content={<Typography variant="caption">Uruchomiony od 37 minut</Typography>}
                    action={<Switch defaultChecked color="success" />}
                />
            </div>

            <div key="2">
                <Widget
                    icon={Thermometer}
                    title={'Termometr w szklarni'}
                    content={<Typography variant="caption">27{'\u00b0'}C | 80%</Typography>}
                />
            </div>

            <div key="3">
                <Widget
                    icon={Idea}
                    title={'Żarówka'}
                    content={<Typography variant="caption">jasność 80% czerwony</Typography>}
                    action={<Switch defaultChecked color="success" />}
                />
            </div>

            <div key="4">
                <Widget
                    icon={Server}
                    title={'Serwer'}
                    content={<Typography variant="caption">66{'\u00b0'}C | 11.23% | 2660MB</Typography>}
                />
            </div>

            <div key="5">
                <Widget icon={Antenna} title={'Router bez obudowy'} />
            </div>

            <div key="6">
                <Widget icon={Router} title={'Koordynator'} />
            </div>

            <div key="7">
                <Widget icon={Router} title={'Testowe urządzenie'} />
            </div> */}
        </ResponsiveGridLayout>
    );
};
