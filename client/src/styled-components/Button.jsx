import styled, { css } from 'styled-components';

const primaryStyles = css`
  color: #fff;
  background: #DC5F00;

  &:hover {
    background-color: rgb(59, 59, 59);
  }
`;

const secondaryStyles = css`
  color: #DC5F00;
  background: #fff;

  &:hover {
    background-color: rgb(59, 59, 59);
    color: #eeeeee;
  }
`;

const Button = styled.button`
  width: ${(props) => props.width || '200px'};
  height: ${(props) => props.height || '40px'};
  margin: ${(props) => props.margin || '6px auto'};
  font-size: ${(props) => props.fontSize || '1rem'};
  font-weight: ${(props) => props.fontWeight || 'bold'};
  border: ${(props) => props.border || 'none'};
  border-radius: ${(props) => props.borderRadius || '4px'};
  cursor: ${(props) => props.cursor || 'pointer'};
  transition: ${(props) => props.transition || 'background-color 0.2s ease-in'};
  ${(props) => (props.primary ? primaryStyles : secondaryStyles)};
  text-align: center;
`;



export default Button;
