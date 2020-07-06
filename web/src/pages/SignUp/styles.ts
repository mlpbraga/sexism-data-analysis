import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';
import backgroundImg from '../../assets/sign-up-background.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  @media(max-width: 900px) {
    flex-direction: column;
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${backgroundImg}) no-repeat center;
  background-size: cover;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 700px;
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimatedContainer = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;

  animation: ${appearFromRight} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #DC73A5;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#DC73A5')};
      }
    }
  }

  > a {
    color: #DC73A5;
    display: flex;
    align-items: center;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#DC73A5')};
    }

    svg {
      margin-right: 6px;
    }
  }
`;


export const GenderInput = styled.div`
  background: #f5f5fa;
  border-radius: 10px;
  border: 2px solid #f5f5fa;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;
