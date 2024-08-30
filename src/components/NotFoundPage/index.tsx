import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleBackButton = () => navigate('/dashboard');
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleBackButton}>
          Back Home
        </Button>
      }
    />
  );
};

export default NotFoundPage;
