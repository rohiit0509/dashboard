import { LockOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Typography } from 'antd';
const { Title, Text } = Typography;
const PurchaseModal = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <Flex vertical align="center" gap={20}>
      <Button icon={<LockOutlined />} />
      <img
        src="vector.png"
        alt="vector-image"
        style={{ border: '1px solid rgba(0, 0, 0, 0.10)', borderRadius: '8px' }}
      />
      <Title level={4}>Unlock Our Course</Title>
      <Text>
        And get privilege to talk in a 1:1 Session with our most experienced
        Mentors
      </Text>
      <Row gutter={10}>
        <Col sm={12}>
          <Button type="default" block onClick={handleClose}>
            Cancel
          </Button>
        </Col>
        <Col sm={12}>
          <Button type="primary">Explore courses</Button>
        </Col>
      </Row>
    </Flex>
  );
};

export default PurchaseModal;
