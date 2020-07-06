import styled from 'styled-components';

import loadingSpinner from '../../assets/loading.svg';

export const Container = styled.div`
  justify-content: space-between;
  margin: 20px auto 0;
  padding: 0 20px;
  text-align: center;
  align-items: center;
  max-width: 900px;

  p {
    margin: 20px auto 0;
    text-align: center;
  }
`;

export const Content = styled.div`
  background: #f5f5fa;
  font-size: 15px;
  border-radius: 10px;
  padding: 0 0 20px;
  margin: 15px;

  header {
    padding: 5px;
    width: 100%;
    border-radius: 10px 10px 0 0;
    background-color: #e6cbd8;
    margin-bottom: 10px;

    strong {
      color: #3D3D4D;
    }
  }
  h2 {
    padding: 0 20px;
    margin-bottom: 4px;
  }
  p {
    padding: 0 20px;
  }
  a {
    color: #b05c84
  }
  small {
    color: #a6a6a6;
  }
  div {
    margin: 15px 15px 0;
  }
  button {
    margin-top: 20px;
    color: #b05c84;
    font-size: 15px;
    text-decoration: underline;
    background: transparent;
    border: none;
  }
`;

export const Loading = styled.div`
  background: url(${loadingSpinner}) no-repeat center;
  color: transparent;
  height: 80px;
  background-size: 10%;
`;

export const VoteOptions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  button {
    max-width: 200px;
  }
`;
