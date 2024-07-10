import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import styled, { ThemeProvider, css } from 'styled-components';
import Chat from './components/Chat';
import ModelSelect from './components/ModelSelect';
import { cubicBackground } from './styles/background';
import useFetch from './hooks/useFetch';
import { darkTheme, lightTheme } from './theme';

const AppWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    
    padding: 16px;
    
    ${({theme}) => css`
        background-color: ${theme.colors.background};

        & * {
            color: ${theme.colors.text.primary};
        }

        ${theme === lightTheme ? css`
            --c1: #b2b2b2;
            --c2: #ffffff;
            --c3: #d9d9d9;
            ` : css`
            --c1: #2d2d2d;
            --c2: #000000;
            --c3: #161616;
        `}
        --s: 132px; 
        ${cubicBackground};
    `}
`;

const AppContent = styled.div`
    position: relative; 
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;

    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
    max-height: 100%;
    max-width: 1140px;
    
    padding: 16px;

    ${({theme}) => css`
        background-color: ${theme.colors.surface}dd;
        border-radius: 16px;
        box-shadow: 0 0 8px 8px ${theme.colors.surface};
    `}
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h1``;

function App() {
    const [currentTheme, setCurrentTheme] = useState(lightTheme);
    const { data: models } = useFetch({url: `http://127.0.0.1:${process.env.AIBOT_API_PORT}/models`});
    const [model, setModel] = useState(null);

    const toggleTheme = () => {
      setCurrentTheme(currentTheme === darkTheme ? lightTheme : darkTheme);
    };

    useEffect(() => {
        if (models && models.length > 0){
            setModel(models[0]);
        }
    }, [models])

    return (
      <ThemeProvider theme={currentTheme} >
            <AppWrapper>
                <AppContent>
                    <Header>
                        <Title>
                            Welcome in AiBot!
                        </Title>
                        <ModelSelect models={models ? models : []} selectedModel={model} selectModel={setModel}/>
                        <IconButton 
                            onClick={toggleTheme} 
                            style={{ color: currentTheme.colors.text.primary }}
                            sx={{ height: 'fit-content'}}>
                            {currentTheme === darkTheme ? <LightMode /> : <DarkMode />}
                        </IconButton>
                    </Header>
                    <Chat model={model}/>
                </AppContent>
            </AppWrapper>
      </ThemeProvider>
    );
}

export default App;
