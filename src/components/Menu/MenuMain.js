import {
  BarChartOutlined,
  CarryOutOutlined,
  ProfileOutlined,
  TeamOutlined,
  SunOutlined,
  AudioOutlined,
  EditOutlined,
  ScheduleOutlined,
  KubernetesOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom'
import "./menu.css"


const MenuMain = () => {

  const navigate = useNavigate();

  const items = [
    //главная страница с основной важной информацией
    { key: '/main', icon: <BarChartOutlined />, label: 'Главная страница' },
    //задачи сотрудников
    { key: '/assignment', icon: <CarryOutOutlined />, label: 'Поручения' },
    //поручения для меня
    { key: 'assignmentMe', icon: <ProfileOutlined />, label: 'Мои задачи' },
    //повестка для дейли
    { key: '/daily', icon: <AudioOutlined />, label: 'Дейли' },
    //итоги встреч (дейли, кластерная встреча и тд)
    { key: '/meeting', icon: <EditOutlined />, label: 'Протоколы встреч' },
    //календарь с основными встречами, которые нельзя пропускать
    { key: '/meetingCalendar', icon: <ScheduleOutlined />, label: 'Календарь встреч' },
    //отпуск команды
    { key: '/vocation', icon: <SunOutlined />, label: 'Отпуск' },
    //встречи один на один - итоги разговора
    { key: '/onetoone', icon: <TeamOutlined />, label: 'One to One' },
    //выходы в выходные
    { key: '/release', icon: <KubernetesOutlined />, label: 'Релизы' },
    //команда
    { key: '/user', icon: <UserOutlined />, label: 'Команда' },
  ];


  const onClick = (e) => {
    navigate(e.key);
  };

  return (
    <>
      <div style={{ width: 200, background: '#d8ffdeff' }}>
        <Menu className="menu"
          onClick={onClick}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
      </div>
    </>
  );
};
export default MenuMain;

