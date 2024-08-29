import styled from 'styled-components';
export const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  min-width: 350px;
  padding: 40px;
`;

export const MainContainer = styled.div<{ justifyContent: string }>`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: center;
  height: 100vh;
  padding: 0 30px;
  background-color: #fff;
  button {
    border-radius: 15px;
    padding: 0;
  }
`;
export const ImageContainer = styled.div`
  img {
    object-fit: contain;
    min-width: 300px;
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 996px;
  min-width: 600px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 24px 50px 0px #4e8ae21a;
`;