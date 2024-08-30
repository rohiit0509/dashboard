import { Button, Col, Flex, Form, Input, Row, Typography } from 'antd';
import SignupImage from '../../assets/svgs/SignupImage';
import { FormContainer, FormWrapper, MainContainer } from '../../styles/signup';
const { Title } = Typography;

const SignUp = () => {
  const submitData = (values: any) => {
    console.log(values);
  };
  return (
    <MainContainer justifyContent="center">
      <FormWrapper>
        <FormContainer>
          <Row>
            <img src="signup-logo-image.png" alt="logo-image-singup" />
          </Row>
          <Flex
            vertical
            style={{
              marginBottom: '15px',
              marginTop: '12px',
              paddingLeft: '9px',
            }}
          >
            <Title level={3}>User Onboarding</Title>
          </Flex>
          <Form layout="vertical" onFinish={submitData}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please enter your Name',
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter Name" />
            </Form.Item>
            <Form.Item
              label="Occupation"
              name="occupation"
              rules={[
                {
                  required: true,
                  message: 'Please enter your Occupation',
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Student" />
            </Form.Item>
            <Row gutter={5}>
              <Col sm={10}>
              <Form.Item
                  label="Education Institute"
                  name="educationInstitute"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your Institute',
                      whitespace: true,
                    },
                  ]}
                >
                  <Input type="email" placeholder="Institute Name"
                      
                  />
                </Form.Item>
              </Col>
              <Col sm={7}>
                <Form.Item
                  label="Class"
                  name="class"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Class',
                      whitespace: true,
                    },
                  ]}
                >
                  <Input placeholder="9th Standard" />
                </Form.Item>
              </Col>
              <Col sm={7}>
                <Form.Item
                  label="Subject"
                  name="college"
                >
                  <Input placeholder="Math-Science" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your Email',
                  whitespace: true,
                },
              ]}
            >
              <Input type="email" placeholder="example@gmail.com" />
            </Form.Item>
            <Form.Item label="Link" name="link">
              <Input placeholder="Student" />
            </Form.Item>
            <Form.Item label="About Yourself (Optional)" name="description">
              <Input.TextArea
                rows={4}
                placeholder="e.g. I joined Stripe’s Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Create Account
              </Button>
            </Form.Item>
          </Form>
        </FormContainer>
        <SignupImage />
      </FormWrapper>
    </MainContainer>
  );
};

export default SignUp;
