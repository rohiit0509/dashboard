import { Button, Col, Flex, Form, Input, Row, Typography } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import SignupImage from '../../assets/svgs/SignupImage';
import { FormContainer, FormWrapper, MainContainer } from '../../styles/signup';
import { auth, db } from '../../firebase';
import { useState } from 'react';
import useNotification from '../../hooks/useNotifier';
const { Title } = Typography;

const SignUp = () => {
  const [btnLoading, setBtnLoading] = useState(false)
  const { openNotification } = useNotification()
  const submitData = async (values: any) => {
    setBtnLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
  
      const user = userCredential.user;
  
      await setDoc(doc(db, "userDetails", user.uid), {
        name: values.name,
        occupation: values.occupation,
        educationInstitute: values.educationInstitute,
        class: values.class,
        subject: values.subject,
        email: values.email,
        bio: values.bio || "",
        role:'user',
        createdAt: new Date(),
        userId:user.uid,
        password:values.password
      });
      openNotification('success',"Account created successfully!",'')
      setBtnLoading(false)
    } catch (error) {
      const err = error as Error;
      openNotification('error',`${err.message}`,'')
      setBtnLoading(false)
    }
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
                  <Input placeholder="Institute Name" />
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
                  name="subject"
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
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please enter a Password',
                },
                {
                  min: 6,
                  message: 'Minimum 6 Characters are required',
                },
              ]}
            >
              <Input.Password placeholder="Enter Password" />
            </Form.Item>
            <Form.Item label="About Yourself (Optional)" name="bio">
              <Input.TextArea
                rows={4}
                placeholder="e.g. I joined Stripe’s Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={btnLoading}>
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
