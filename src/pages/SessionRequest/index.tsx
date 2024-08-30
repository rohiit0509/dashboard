import { Flex, Table, Typography } from 'antd';
const { Title } = Typography;
const SessionRequest = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'College',
      dataIndex: 'college',
      key: 'college',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Share Schedule Link',
      dataIndex: 'shareScheduleLink',
      key: 'shareScheduleLink',
    },
  ];
  const dataSource = [
    {
      key: '1',
      name: 'John Doe',
      college: 'Harvard University',
      email: 'john.doe@example.com',
      title: 'Professor',
      description: 'Expert in Artificial Intelligence',
      shareScheduleLink: 'http://example.com/schedule/johndoe',
    },
    {
      key: '2',
      name: 'Jane Smith',
      college: 'Stanford University',
      email: 'jane.smith@example.com',
      title: 'Associate Professor',
      description: 'Researcher in Machine Learning',
      shareScheduleLink: 'http://example.com/schedule/janesmith',
    },
    {
      key: '3',
      name: 'Alice Johnson',
      college: 'MIT',
      email: 'alice.johnson@example.com',
      title: 'Lecturer',
      description: 'Specialist in Robotics',
      shareScheduleLink: 'http://example.com/schedule/alicejohnson',
    },
    {
      key: '4',
      name: 'Bob Brown',
      college: 'Caltech',
      email: 'bob.brown@example.com',
      title: 'Postdoctoral Fellow',
      description: 'Focused on Quantum Computing',
      shareScheduleLink: 'http://example.com/schedule/bobbrown',
    },
  ];
  

  return (
    <Flex vertical>
      <Flex justify="center">
        <Title level={4}>Request List</Title>
      </Flex>
      <Table columns={columns} dataSource={dataSource} />
    </Flex>
  );
};

export default SessionRequest;
