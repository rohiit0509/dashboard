import styled from 'styled-components';
export const TableWrapper = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  .ant-table-wrapper .ant-table-thead > tr > th {
    background-color: #f3f5ff;
  }
`;

export const CardWrapper = styled.div`
  .ant-card .ant-card-cover > * {
    padding: 15px;
    border-radius: 20px;
  }
  .ant-card .ant-card-body {
    padding-top: 0;
    padding-bottom: 10px;
  }
  .ant-card .ant-card-meta-detail > div:not(:last-child) {
    margin-bottom: 0;
  }
  .ant-card .ant-card-actions {
    border-top: 0;
  }
  .ant-card .ant-card-actions > li {
    margin: 10px;
  }

  .ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
    background-color: #c4ed2f;
    color: #000;
    border: 1px solid #ededed;
  }
`;
export const OfferContainer = styled.div`
  .ant-typography {
    margin-bottom: 0;
  }
  Text {
    font-size: 11px;
  }
`;
