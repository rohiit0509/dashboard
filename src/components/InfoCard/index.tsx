import { Avatar, Button, Flex, Typography } from 'antd';
import {
  InfoCardContainer,
  TagContainer,
  TagName,
} from '../../styles/infoCard';
import SmallTickIcon from '../../assets/svgs/SmallTickIcon';
import TeacherTag from '../../assets/svgs/TeacherTag';
import { UserOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

interface InfoCardProps {
  name: string;
  email: string;
  description?: string;
  buttonLabel: string;
  tagName:string
}
const InfoCard = ({ name, email, description, buttonLabel, tagName}: InfoCardProps) => {
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
        {buttonLabel}
      </Button>
    </InfoCardContainer>
  );
};

export default InfoCard;
