import styled from 'styled-components';

export const Container = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  min-width: 900px;
  margin: 20px 100px 20px 100px;
  text-align: justify;

  div {
    border: 1px solid #f5f5fa;
    background: #f5f5fa;
    border-radius: 10px;
    margin: 10px 0;
    padding: 0 20px;

    h1 {
      margin-bottom: 25px;
      color: #DC73A5;
    }

    p {
      margin-bottom: 15px
    }
  }

  @media(max-width: 900px) {
    flex-direction: column;
    min-width: auto;
    margin: 20px;
  }
`;
