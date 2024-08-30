import { Flex } from 'antd';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import InfoCard from '../../components/InfoCard';

const UserDashboard = () => {
  return (
    <Flex vertical gap={50}>
      <div>
        <Breadcrumb pageName="Dashboard" textSize="md" />
        <InfoCard name="Rohit Mandal" email="Rohit@gmail.com" buttonLabel='Verified'/>
      </div>
      {/* <Breadcrumb pageName="On Going Courses" textSize="sm" />
      <Breadcrumb pageName="Scheduled Sessions" textSize="sm" /> */}
    </Flex>
  );
};

export default UserDashboard;
