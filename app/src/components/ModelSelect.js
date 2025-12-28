import { Autocomplete, TextField } from "@mui/material";
import { useTheme } from "styled-components";

function ModelSelect(props) {
    const {
        models = [],
        statusesById = {},
        selectedModel = null,
        selectModel = () => { },
    } = props;
    const theme = useTheme();

    return (
        <Autocomplete
            id="size-small-standard"
            size="medium"
            options={models}
            getOptionLabel={(model) => model.title}
            value={selectedModel}
            sx={{
                width: '300px',
            }}
            onChange={(event, model) => {
                if (model) {
                    selectModel(model);
                }
            }}
            disableClearable
            renderOption={(props, option) => {
                const status = statusesById[String(option.id)] || 'missing';
                const color = status === 'ok' ? theme.colors.primary : theme.colors.error?.default || 'red';
                return (
                    <li {...props}>
                        <span style={{ width: 8, height: 8, borderRadius: 999, marginRight: 8, background: color, display: 'inline-block' }} />
                        {option.title}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Model"
                    placeholder="Model name..."
                    sx={{
                        '& .MuiInputBase-input': {
                            color: theme.colors.text.primary,
                        },
                        '& .MuiInput-underline:before': {
                            borderBottomColor: theme.colors.text.primary
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: theme.colors.text.primary
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottomColor: theme.colors.text.secondary
                        },
                        '& .MuiInputLabel-root': {
                            color: theme.colors.text.secondary,
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: theme.colors.text.primary,
                        },
                        '& .MuiInputLabel-focused .MuiInputLabel': {
                            color: theme.colors.text.primary,
                        },
                    }}
                />
            )}
        />
    );
}

export default ModelSelect;
