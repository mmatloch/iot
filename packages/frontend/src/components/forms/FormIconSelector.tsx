import { useStatic } from '@api/staticApi';
import { Box, FilterOptionsState } from '@mui/material';
import { buildIconUrl } from '@utils/buildIconUrl';
import { noop } from 'lodash';

import FormLiveAutocomplete from './FormLiveAutocomplete';

interface Props {
    name: string;
    label: string;
}

export const FormIconSelector = ({ name, label }: Props) => {
    const { data } = useStatic();

    const filterOptions = (options: string[], state: FilterOptionsState<string>) => {
        return options.filter((option) => option.includes(state.inputValue));
    };

    return (
        <>
            <FormLiveAutocomplete
                name={name}
                label={label}
                validation={{ required: true }}
                margin="dense"
                loading={false}
                getOptionLabel={(file) => file}
                formatOnSelect={(file) => file}
                onChange={noop}
                options={data?.files || []}
                filterOptions={filterOptions}
                renderOption={(props, file) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img loading="lazy" width="40" src={buildIconUrl(file)} alt="" />
                        {file}
                    </Box>
                )}
            />
        </>
    );
};
