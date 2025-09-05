import { useState } from 'react';
import axios from 'axios'
import { Layout, Form, Input, Button } from 'antd';
import { Route, Routes, Navigate } from 'react-router-dom';

import MenuMain from './components/Menu/MenuMain';
import PageAssignment from './pages/assignment/pageAssignment.js';
import PageAssignmentMe from './pages/assignmentMe/pageAssignmentMe.js';
import PageDaily from './pages/daily/pageDaily.js';
import PageMeeting from './pages/meeting/pageMeeting.js';
import PageCalendarMeeting from './pages/calendarMeeting/pageCalendarMeeting.js';

import "./App.css"

const { Sider, Content } = Layout;


const App = () => {
  const onFinish = (values) => {
    axios.post(`${process.env.REACT_APP_API_URL}/auth/login/`, values)
      .then(res => setAuth(res.data))
  }

  const [auth, setAuth] = useState(null)
  return (
    <>
      {!auth ?

        <Routes>
          <Route path="/auth" element={
            <div className="form_auth">
              <h2>Войти в аккаунт</h2>
              <p>Пожалуйста, войдите в свой аккаунт</p>
              <Form onFinish={onFinish} className="login-form">
                <Form.Item name={['email']}>
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item name={['password']}>
                  <Input.Password placeholder="Пароль" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Войти в аккаунт
                  </Button>
                </Form.Item>
              </Form>
            </div>
          } exact />
          <Route
            path="*"
            element={<Navigate to="/auth" replace />}
          />

        </Routes>
        :
        <Layout hasSider>
          <Sider
            style={{
              background: '#000000',
              overflow: 'auto',
              height: '100vh',
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <MenuMain />
          </Sider>
          <Layout
            style={{
              marginLeft: 20,
            }}
          >
            <Content
              style={{
                margin: '24px 0 0',
                overflow: 'initial',
              }}
            >
              <Routes>
                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />
                <Route path='/assignment' element={<PageAssignment/>} exact />
                <Route path='/assignmentMe' element={<PageAssignmentMe/>} exact />
                <Route path='/daily' element={<PageDaily/>} exact />
                <Route path='/meeting' element={<PageMeeting/>} exact />
                <Route path='/meetingCalendar' element={<PageCalendarMeeting/>} exact />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      }
    </>
  );
};
export default App;