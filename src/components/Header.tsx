import { Col } from 'antd';
import tictactoe from "../assets/images/tictactoe.png";

import './Header.css';

export const Header = () => {

    return <Col xs={24} className="header">
        <img src={tictactoe} className="img" />
    </Col>
}