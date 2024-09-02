import { Flex } from 'antd';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import InfoCard from '../../components/InfoCard';

const LiveSession = () => {
  return (
    <>
      <Breadcrumb pageName="Live Session" textSize="md" />
      <Flex gap={20} wrap>
        <InfoCard
          name="Dhanesh Verma"
          email="Designation"
          description="How to Focus on your future goals"
          buttonLabel="Scheduled On: 24th August |  8:00 PM"
          tagName='Faculty'
        />
        <InfoCard
          name="Shishir Shekhar"
          email="Designation"
          description="How to Focus on your future goals"
          buttonLabel="Scheduled On: 24th August |  8:00 PM"
          tagName='Faculty'
        />
      </Flex>
    </>
  );
};

export default LiveSession;
