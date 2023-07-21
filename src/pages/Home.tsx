import { Row, Col, Card, Button, Table, notification, Modal, Form, Input } from "antd";
import moment from "moment";

import "./Home.css";

import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Header } from "../components/Header";
import { createAuth, getResults } from "../api";
import { TicTacToe, ViewGame } from "./TicTacToe";

export const Home = () => {

    const [showForm, setshowForm] = useState(false);
    const [players, setplayers] = useState<Object | null>(null);

    const [gameScores, setgameScores] = useState(null);

    const handleStartNewGame = () => {
        setshowForm(true);
    };

    const [list, setlist] = useState(null);
    const [loadlist, setloadlist] = useState(false);

    useEffect(() => {
        getResults(setlist, setloadlist);
    }, [])

    return (
        <Row gutter={[24, 0]} className="home">
            <Header />
            {
                players === null ?
                    <Col xs={24}>
                        <Card
                            hoverable
                            title={<Title handleStartNewGame={handleStartNewGame} />}
                            className="card"
                            style={{ width: isMobile ? "100%" : "70%" }}
                        >
                            <Results list={list} gameScores={gameScores} setgameScores={setgameScores} loadlist={loadlist} />
                        </Card>
                    </Col>
                    :
                    <TicTacToe players={players} setplayers={setplayers} setlist={setlist} setloadlist={setloadlist} />
            }
            {/**Form Modal */}
            <ModalForm showForm={showForm} setshowForm={setshowForm} setplayers={setplayers} />
        </Row>
    );
};

export const Title = (props: any) => {

    return <Row>
        <Col xs={24} lg={12} md={24} className="title">
            <span style={{ fontSize: isMobile? 15 : 25 }}>List of Game Results</span>
        </Col>
        <Col xs={24} lg={12} md={24}>
            <Button
                type="primary"
                className="start-btn"
                onClick={props.handleStartNewGame}
            >
                Start New Game
            </Button>
        </Col>
    </Row>
};

export const Results = (props: any) => {
    const { list, loadlist, gameScores, setgameScores } = props;

    const calculateWinner = (val: any, scores: any) => {
        try {
            var x = 0;
            var o = 0;
            var draw = 0;
            for (let i = 0; i < scores.length; i++) {
                const score = scores[i];
                if (score.winner === "X") {
                    x += 1;
                }
                if (score.winner === "O") {
                    o += 1;
                }
                if (score.winner === "Draw") {
                    draw += 1;
                }
            }
            const xIsWinner = x > o;
            const isDraw = x === o;
            return isDraw ? "Draw" : xIsWinner ? `${val.playerX} Win!` : `${val.playerX} Win!`;
        } catch (err: any) {
            console.log(err.message);
            return ""
        }
    };

    const columns: Array<Object> = [
        {
            title: 'Date',
            render: (val: any) => (
                <span>{moment(val.createdAt).format("MMM DD, YYYY @ hh:mm A")}</span>
            ),
            width: "25%"
        },
        {
            title: 'Player X',
            dataIndex: "playerX"
        },
        {
            title: 'Player O',
            dataIndex: "playerO"
        },
        {
            title: 'Game Results',
            render: (val: any) => (
                <Row gutter={[24, 0]}>
                    <Col xs={24} lg={12}>
                        <Button type={"link"}>
                            {calculateWinner(val, val.scores)}
                        </Button>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Button
                            type={"primary"}
                            onClick={()=>{
                                setgameScores(val);
                            }}
                        >
                            View Results
                        </Button>
                    </Col>
                </Row>
            )
        }
    ];
    const mobileColumns: Array<Object> = [
        
        {
            title: <center>Game Results</center>,
            render: (val: any) => (
                <Row gutter={[24, 0]}>
                    <Col xs={24} lg={12}>
                        <b>Players: </b> <br/>
                       <center> <b>X</b>: {val.playerX} vs <b>O</b>: {val.playerO} </center>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Button type={"link"} style={{ float: "right"}}>
                            {calculateWinner(val, val.scores)}
                        </Button>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Button
                            type={"primary"}
                            style={{ float: "right"}}
                            onClick={()=>{
                                setgameScores(val);
                            }}
                        >
                            View Results
                        </Button>
                    </Col>
                </Row>
            )
        }
    ];

    return <>
    <Table
        columns={isMobile? mobileColumns: columns}
        size="large"
        className="ant-list-box table-responsive bg-white"
        dataSource={list}
        loading={loadlist}
    />
    {
        gameScores!==null&&<ViewResults gameScores={gameScores} setgameScores={setgameScores} />
    }
    </>
}

export const ViewResults = (props: any) => {
    const { gameScores, setgameScores } = props;
    const { playerX, playerO, scores } = gameScores;

    return (
        <Modal
            bodyStyle={{overflowX: 'scroll'}}
            open={gameScores!==null}
            onCancel={()=>{
                setgameScores(null);
            }}
            footer={null}
            title={"View Game Result"}
            width={isMobile? "100%" : "80%"}
        >
            <ViewGame isXTurn={null} playerX={playerX} playerO={playerO} scores={scores} />
        </Modal>
    );
}

export const ModalForm = (props: any) => {
    const { showForm, setshowForm, setplayers } = props;

    const closeForm = () => {
        setshowForm(false);
    };

    const [form] = Form.useForm();

    const initialValues = {
        playerX: "",
        playerO: ""
    };

    const handleStart = async (values: Object) => {
        await createAuth(values);
        setplayers(values);
        setshowForm(false);
        form.resetFields();
    };


    return <Modal
        //centered
        open={showForm}
        onCancel={closeForm}
        footer={<Button
            type={'primary'}
            onClick={() => { form.submit(); }}
        >
            {"Start >>"}
        </Button>}
        title={"Enter Players Name:"}
    >
        <Form
            form={form}
            initialValues={initialValues}
            onFinish={values => {
                handleStart(values);
            }}
            onFinishFailed={err => {
                console.log(err);

            }}
            layout="vertical"
        >
            <Form.Item
                name={"playerX"}
                label={"Player X :"}
                rules={[
                    { required: true, message: "Please enter playerX name!" },
                ]}
            >
                <Input placeholder="Player X name " />
            </Form.Item>

            <Form.Item
                name={"playerO"}
                label={"Player O :"}
                rules={[
                    { required: true, message: "Please enter playerO name!" },
                ]}
            >
                <Input placeholder="Player O name " />
            </Form.Item>
        </Form>

    </Modal>
}