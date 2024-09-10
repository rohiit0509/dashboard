import styled from 'styled-components';
export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;
`;
export const LogoContainer = styled.div`
  width: 40px;
`;

export const TrashIconWrapper = styled.div`
  svg {
    width: 60px;
    height: 60px;
  }
`;

export const SidebarFooter = styled.div<{ collapsed: boolean }>`
  width: 100%;
  max-width: 185px;
  height: 160px;
  background-color: #704fe4;
  border-radius: 15px;
  color: #fff;
  padding: 14px;
  margin: 30px 7px 0 7px;
  display: ${({ collapsed }) => (collapsed ? 'none' : 'block')};
`;
export const Top = styled.div``;
export const Bottom = styled.div`
display: flex;
flex-direction: column;
gap: 5px;
`;
