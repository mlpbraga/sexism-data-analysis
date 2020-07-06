import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #DC73A5;
  height: 56px;
  border-radius: 10px;
  border: 0;
  color: #f5f5fa;
  padding: 0 16px;
  width: 100%;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#DC73A5')};
  }
`;
