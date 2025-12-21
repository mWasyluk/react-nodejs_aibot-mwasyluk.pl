import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import useFetch from "../hooks/useFetch";
import { prepareContextPrompt } from "../utils/prompt-util";
import MarkdownContent from "./MarkdownContent";
import SendMessageButton from "./SendMessageButton";
import { QUERY_URL } from "../utils/api-util";

const Container = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const Button = styled.div`
    padding: 5px 25px 5px 20px; 
    border-radius: 99px;
    cursor: pointer;

    display: flex;
    flex-direction: row;
    gap: 4px;

    justify-content: center;
    align-items: center;

    font-family: "Science Gothic", sans-serif;
    font-size: 18px;
    font-weight: 500;
    color: #fff;

    transition: box-shadow 0.1s ease-in-out, transform 0.3s ease-in-out, scale 0.3s ease-in-out;
`;

const Row = styled.div`
    display: flex;
    gap: 8px;
    width: 100%;
    justify-content: center;
`;

function ActionButton(props) {
    const {
        // bg = "linear-gradient(10deg,rgba(102, 161, 255, 0.5) 0%, rgba(75, 133, 227, 0.5) 35%, rgba(0, 212, 255, 0.5) 100%)", 
        // bgHover = "linear-gradient(10deg,rgba(52, 86, 139, 0.5) 0%, rgba(38, 75, 134, 0.5) 35%, rgba(50, 140, 158, 0.5) 100%)", 
        icon, 
        title,
        c1 = "rgba(194, 194, 194, 0.75)",
        c2 = "rgba(173, 173, 173, 0.75)",
        c3 = "rgba(134, 134, 134, 0.75)",
        ...otherProps
    } = props;
    const [isHover, setIsHover] = useState(false);
    const [deg, setDeg] = useState(10);

    const style = {
        background: `linear-gradient(${deg}deg, ${c1} 0%, ${c2} 35%, ${c3} 100%)`,
        boxShadow: !isHover ? '2px 2px 4px #00000023' : '2px 2px 4px #00000053, inset 0 0 0 2px white',
        transform: `translate(0, ${!isHover ? 0 : '2px'})`,
        // scale: !isHover ? '1 1' : '1.1 1.1'
    }

    useEffect(() => {
        setTimeout(() => {
            const newDeg = deg + 5;
            setDeg(newDeg % 360);
        }, 100)
    }, [deg])

    return (
        <Button style={style} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} {...otherProps}>{icon}{title}</Button>
    )
}

function ActionsContainer(props) {
    const { callAction } = props;
    const theme = useTheme();

    const { data, isLoading, error, fetchData } = useFetch();

    // useEffect(() => {
    //     if (data && !isLoading) {
    //         addMessage({content: data, source: 'out'});
    //     } else if (error) {
    //         addMessage({content: error, source: 'err'});
    //     }
    // }, [data, isLoading, error]);
    
    return (
        <Container>
            <span>Use one of the quick actions to start a conversation</span>
            <Row>
                <ActionButton
                    icon={<img src="images/joke.png" width={32} height={32} style={{filter: "brightness(0) invert(1)"}}/>}
                    title="Joke"
                    c1="rgba(175, 91, 12, 0.75)"
                    c2="rgba(202, 75, 16, 0.75)"
                    c3="rgba(255, 10, 10, 0.75)"
                />
                <ActionButton
                    icon={<img src="images/riddle.png" width={32} height={32}  style={{filter: "brightness(0) invert(1)"}}/>}
                    title="Riddle"
                    c1="rgba(117, 151, 53, 0.75)"
                    c2="rgba(80, 146, 36, 0.75)"
                    c3="rgba(33, 153, 53, 0.75)"
                />
                <ActionButton
                    icon={<img src="images/god.png" width={32} height={32}  style={{filter: "brightness(0) invert(1)"}}/>}
                    title="God"
                    onClick={() => callAction("god")}
                    c1="rgba(62, 154, 207, 0.75)"
                    c2="rgba(5, 60, 209, 0.75)"
                    c3="rgba(52, 13, 224, 0.75)"
                />
            </Row>
        </Container>
    );
}

export default ActionsContainer;
