import { Avatar, Button, Flex, Typography } from 'antd';
import {
  InfoCardContainer,
  TagContainer,
  TagName,
} from '../../styles/infoCard';
import SmallTickIcon from '../../assets/svgs/SmallTickIcon';
import TeacherTag from '../../assets/svgs/TeacherTag';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Title, Text } = Typography;

interface InfoCardProps {
  name: string;
  email: string;
  description?: string;
  buttonLabel: string;
  tagName: string;
  buttonAction?: string;
}
const InfoCard = ({
  name,
  email,
  description,
  buttonLabel,
  tagName,
  buttonAction,
}: InfoCardProps) => {
  return (
    <InfoCardContainer>
      <Flex>
        <Flex align="center" gap={10} style={{ width: '100%' }}>
          <Avatar icon={<UserOutlined />} shape="square" size={50} />
          <Flex vertical>
            <Title level={5}>{name}</Title>
            <Text type="secondary">{email}</Text>
          </Flex>
        </Flex>
        <TagContainer>
          <TeacherTag />
          <TagName>{tagName}</TagName>
        </TagContainer>
      </Flex>
      {description && <Text>Interaction On: {description}</Text>}
      <Button type="default" icon={<SmallTickIcon />}>
        {buttonAction ? (
          <Link to={buttonAction} target="_blank">
            {buttonLabel}
          </Link>
        ) : (
          buttonLabel
        )}
      </Button>
    </InfoCardContainer>
  );
};

export default InfoCard;
