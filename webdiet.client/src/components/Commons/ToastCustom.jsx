import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function ToastCustom({ text, show, onClose }) {
    return (
        <Row>
            <Col xs={6}>
                <ToastContainer
                className="toast-container-custom"
                    position="top-center">
                    <Toast onClose={onClose}
                        show={show}
                        delay={3000}
                        autohide
                        
                        animation
                        className="toast-custom"
                        bg="success"
                    >
                        <Toast.Header>
                            <img
                                src="holder.js/20x20?text=%20"
                                className="rounded me-2"
                                alt=""
                            />
                            <strong className="me-auto">Success</strong>
                        </Toast.Header>
                        <Toast.Body>{text}</Toast.Body>
                    </Toast>
                </ToastContainer>
               
            </Col>
        </Row>
    );
}


export default ToastCustom;