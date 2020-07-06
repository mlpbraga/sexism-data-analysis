import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isInvalid: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #f5f5fa;
  border-radius: 10px;
  border: 2px solid #f5f5fa;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.isInvalid &&
    css`
      border-color: #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      color: #DC73A5;
      border-color: #DC73A5;
    `}


  input {
    flex: 1;
    border: 0;
    background: transparent;
    color: #3D3D4D;
    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
    color: #666360;
    ${props =>
      (props.isFocused || props.isFilled) &&
      css`
        color: #DC73A5;
      `}
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;
  svg {
    margin: 0;
  }
  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
