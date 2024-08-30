import styled from 'styled-components';
export const InfoCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  height: auto;
  border-radius: 10px;
  background: #fff;
  padding: 15px;
  gap: 25px;
  .ant-typography {
    margin-bottom: 0;
  }
`;

export const TagContainer = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  gap: 5px;
  border-radius: 10px;
  box-shadow: 0px 2px 5.5px 0px rgba(0, 0, 0, 0.06);
  padding: 0 10px;
`;
export const TagName = styled.div`
  color: #2d3748;
  font-size: 10px;
  font-weight: 700;
`;
