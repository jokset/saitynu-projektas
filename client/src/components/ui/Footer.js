import styled from "styled-components";

const StyledFooter = styled.footer`
    background-color: #29374a;
    color: #fff;
    min-height: 180px;
    margin-top: 6rem;
    bottom: 0;
    position: absolute;
    width: 100%;
    margin-top: 180px;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
        color: #fff;

        strong {
            color: #fff;
        }

        a {
            color: #87baff;
        }
    }
`

const Footer = () => {
    return (
        <StyledFooter class="footer">
            <div class="content has-text-centered">
                <p>
                    <strong>Events System</strong> by <a href="https://setkauskas.lt">Jokūbas Setkauskas</a>
                </p>
            </div>
        </StyledFooter>
    )
}

export default Footer;