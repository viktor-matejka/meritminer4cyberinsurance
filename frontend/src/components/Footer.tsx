import React from "react";
import {Container} from "react-bootstrap";

export const Footer = () => {
    return (
        <footer className="footer px-0 px-lg-3">
            <Container fluid>
                <nav>
                    <ul className="footer-menu">
                        <li>
                            <a href="https://www.csg.uzh.ch/csg/en/" target="_blank" rel="noreferrer">CSG UZH</a>
                        </li>
                    </ul>
                    <p className="copyright text-center">
                        MeritMiner4CI
                        © {new Date().getFullYear()}{" "}
                        Viktor Matejka
                    </p>
                    <p className="copyright text-center">
                        SecRiskAI
                        © {new Date().getFullYear()}{" "}
                        Erion Sula
                    </p>
                </nav>
            </Container>
        </footer>
    )
}
