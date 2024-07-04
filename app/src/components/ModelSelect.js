import { Autocomplete, TextField } from "@mui/material";
import { useTheme } from "styled-components";

function ModelSelect(props) {
    const { 
        models = [],
        selectedModel = null,
        selectModel = () => {},
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
