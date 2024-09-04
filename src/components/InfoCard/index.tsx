import { Avatar, Button, Flex, Typography } from 'antd';
import {
  ButtonWrapper,
  InfoCardContainer,
  TagContainer,
  TagName,
} from '../../styles/infoCard';
import SmallTickIcon from '../../assets/svgs/SmallTickIcon';
import TeacherTag from '../../assets/svgs/TeacherTag';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
const { Title, Text } = Typography;

interface InfoCardProps {
  name: string;
  email: string;
  description?: string;
  buttonLabel: string;
  tagName: string;
  buttonAction?: string;
  extra?: ReactNode;
  buttonType?: 'link' | 'text' | 'default' | 'primary' | 'dashed' | undefined;
  avatarSize?: number;
  icon?:ReactNode;
  hover?:boolean
  onClick?:()=>void
}
const InfoCard = ({
  name,
  email,
  description,
  buttonLabel,
  tagName,
  buttonAction,
  extra,
  buttonType = 'default',
  avatarSize = 50,
  icon,
  hover =false,
  onClick
}: InfoCardProps) => {
  return (
    <InfoCardContainer>
      <Flex>
        <Flex align="center" gap={10} style={{ width: '100%' }}>
          <Avatar icon={<UserOutlined />} shape="square" size={avatarSize} />
          <Flex vertical>
            <Title level={5}>{name}</Title>
            <Text type="secondary">{email}</Text>
            {extra && extra}
          </Flex>
        </Flex>
        {tagName !== '' && (
          <TagContainer>
            <TeacherTag />
            <TagName>{tagName}</TagName>
          </TagContainer>
        )}
      </Flex>
      {description && <Text>Interaction On: {description}</Text>}
      <ButtonWrapper hover={hover}>
      <Button type={buttonType} icon={icon} onClick={onClick} block>
        {buttonAction ? (
          <Link to={buttonAction} target="_blank">
            {buttonLabel}
          </Link>
        ) : (
          buttonLabel
        )}
      </Button>
      </ButtonWrapper>
    </InfoCardContainer>
  );
};

export default InfoCard;
