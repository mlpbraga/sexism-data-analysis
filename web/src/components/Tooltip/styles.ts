import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  span {
    background: #DC73A5;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
    font-weight: 500px;
    opacity: 0;
    transition: opacity 0.4s;
    position: absolute;
    bottom: calc(100% + 12px);
    width: 160px;
    left: 50%;
    transform: translateX(-50%);
    color: #312e38;
    visibility: hidden;

    &::before {
      content: '';
      position: absolute;
      border-style: solid;
      border-color: #DC73A5 transparent;
      border-width: 6px 6px 0 6px;
      left: 50%;
      transform: translateX(-50%);
      top: 100%;
    }
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
