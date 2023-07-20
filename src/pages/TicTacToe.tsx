import { useState } from "react";
import { Button, Alert, Col, Row } from "antd";

import './TicTacToe.css';
import { isMobile } from "react-device-detect";
import { Header } from "../components/Header";
import { addResult, getResults } from "../api";

const board = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

export const TicTacToe = (props: any) => {
    const { players, setplayers, setlist, setloadlist } = props;
    const { playerX, playerO } = players;
    
    const [state, setState] = useState<Array<string | null>>(Array(9).fill(null));
    const [isXTurn, setIsXTurn] = useState(true);
    const [winner, setwinner] = useState<string | boolean | null>(null);
    const scoresInit = [{ x: 0, o: 0, status: "", board: [] }]
    const [scores, setscores] = useState<Array<Object>>(scoresInit);

    const [loading, setloading] = useState(false);

    const checkWinner = (state: Array<string | null>) => {
        const winnerLogic = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let logic of winnerLogic) {
            const [a, b, c] = logic;
            if (state[a] !== null && state[a] === state[b] && state[a] === state[c]) {
                return state[a];
            }
        }

        return false;
    };

    const checkDraw = (state: Array<string | null>, isWinner: string | boolean | null) => {
        var nullIndex = [];
        for (let index = 0; index < state.length; index++) {
            const val = state[index];
            if (val === null) {
                nullIndex.push(val);
            }

        }
        return nullIndex.length === 0 && isWinner === false;
    }

    const handleClick = (index: any) => {
        if (state[index] !== null) {
            return;
        }
        const copyState = [...state];
        copyState[index] = isXTurn ? "X" : "O";
        
        const isWinner = checkWinner(copyState);
        const isDraw = checkDraw(copyState, isWinner);
        setwinner(isDraw ? "Draw" : isWinner);
        console.log(isDraw ? "Draw" : isWinner);
        updateScore(isDraw ? "Draw" : isWinner, copyState);

        setState(copyState);
        setIsXTurn(!isXTurn);
    };

    const clear = () => {
        setplayers(null);
        setscores(scoresInit);
        setState(Array(9).fill(null));
        setwinner(null);
        setIsXTurn(true);
        setloading(false);
    }

    const handleStop = async () => {
        try {
            setloading(true);
            const payload = { playerX: playerX, playerO: playerO, scores: scores }
            console.log(payload);
            const added = await addResult(payload);
            if (added) {
                clear()
                getResults(setlist, setloadlist);
            } else {
                setloading(false);
            }
        } catch (err: any) {
            console.log(err.message);
        }
    }
    
    const updateScore = (winner: any, state: any) => {
        if (winner!==false) {
            const cloneScores: any = [...scores];
            const prevIndex = cloneScores.length - 1;
            const prevScores = cloneScores[prevIndex];
            const xScore = prevScores.x;
            const oScore = prevScores.o;
            if (scores.length === 1 && prevScores.board.length === 0) {
                console.log("was here");
                setscores([{ winner: winner, x: winner === "X" ? 1 : 0, o: winner === "O" ? 1 : 0, board: state }]);
            } else {
                cloneScores.push({ winner: winner, x: winner === "X" ? xScore + 1 : xScore, o: winner === "O" ? oScore + 1 : oScore, board: state });
                const newScore = cloneScores;
                setscores(newScore);
            }
        }
    }
   
    const handleContinue = () => {
        setState(Array(9).fill(null));
        setwinner(null);
        setIsXTurn(true);
    };

    const Board = () => {
        try {
            return <>
                {
                    board.map((row, rowIndex) => {
                        return <div className="board" key={rowIndex}>
                            <>
                                {row.map((col, colIndex) => {
                                    return <Square key={colIndex} disabled={typeof winner === "string"} onClick={() => handleClick(col)} value={state[col]} />
                                })}
                            </>
                        </div>
                    })
                }
            </>
        } catch (err: any) {
            console.log(err.message);
            return <></>
        }
    };

    return (
        <div className="board-container" style={{ width: isMobile ? "100%" : "50%" }}>
            <Col xs={24}>
                <AlertStatus winner={winner} playerX={playerX} playerO={playerO} />
            </Col>

            <ScoreBoard isXTurn={isXTurn} playerX={playerX} playerO={playerO} scores={scores} />

            <Board />

            <Row gutter={[24, 5]} className="footer-options">
                <Col xs={12}>
                    <Button
                        className="score"
                        disabled={typeof winner !== 'string'}
                        size={"large"}
                        type={"primary"}
                        danger
                        onClick={handleStop}
                        loading={loading}
                    >
                        STOP
                    </Button>
                </Col>
                <Col xs={12}>
                    <Button
                        className="score"
                        disabled={typeof winner !== 'string' || loading}
                        size={"large"}
                        type={"primary"}
                        onClick={handleContinue}
                    >
                        CONTINUE
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export const ViewGame  = (props: any) => {
    const { isXTurn, playerX, playerO, scores } = props;
    console.log(scores);
    const ViewBoard = () => {
        try {
            return <Row>
                {
                    scores.map((result: any, resultIndex: any)=>{
                        return <Col xs={24} lg={12} key={resultIndex}>
                            <b>Game {resultIndex+1}</b> - <b style={{ color: result.winner==="Draw"? "gray": result.winner==="X"? "red" : "skyblue"}}>{result.winner==="Draw"? `Draw` : `Player ${result.winner} Win`}</b>
                            {
                                board.map((row, rowIndex) => {
                                    return <div className="board" key={rowIndex}>
                                        <>
                                            {row.map((col, colIndex) => {
                                                return <Square key={colIndex} value={result.board[col]} />
                                            })}
                                        </>
                                    </div>
                                })
                            }
                            <hr />
                        </Col>
                    })
                }
            </Row>
        } catch (err: any) {
            console.log(err.message);
            return <></>
        }
    };
    return <div className="board-container" style={{ width: isMobile ? "100%" : "70%" }}>
    <ScoreBoard isXTurn={isXTurn} playerX={playerX} playerO={playerO} scores={scores} />
    <ViewBoard />
    </div>
}

export const AlertStatus = (props: any) => {
    const { winner, playerX, playerO } = props;
    try {
        const win = typeof winner === "string" && winner !== "Draw";
        const draw = typeof winner === "string" && winner === "Draw"

        return <>
            {win && <Alert className="alert-status" message={`Player ${winner} Win!`} description={`Congratulatulation ${winner === "X" ? playerX : playerO}!`} type={"success"} showIcon />}
            {draw && <Alert className="alert-status" message={`DRAW`} description={''} type={"info"} showIcon />}
        </>
    } catch (err: any) {
        console.log(err.emssage);
        return <></>
    }
}

export const ScoreBoard = (props: any) => {
    const { isXTurn, playerX, playerO, scores } = props;
    const scoresLength = scores.length;
    const latestScores = scores[scoresLength - 1];
    const xScore = latestScores.x;
    const oScore = latestScores.o;
    return <div className="scoreboard">
        <span className={`score x-score ${!isXTurn? "inactive" : ""}`}>X: {playerX} - {xScore}</span>
        <span className={`score o-score ${!isXTurn? "" : "inactive"}`}>O: {playerO} - {oScore}</span>
    </div>
}
export const Square = (props: any) => {
    const style = props.value === "X" ? "square x" : "square o";
    return (
        <Button
            onClick={props.onClick}
            className={style}
            disabled={props.disabled}
        >
            {props.value}
        </Button>
    );
};