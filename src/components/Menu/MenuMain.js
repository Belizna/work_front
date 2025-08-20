import {
  BarChartOutlined,
  CarryOutOutlined,
  ProfileOutlined,
  TeamOutlined,
  SunOutlined,
  AudioOutlined,
  EditOutlined,
  ScheduleOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom'
import "./menu.css"


const MenuMain = () => {
  
  const navigate = useNavigate();

  const items = [
    //главная страница с основной важной информацией
    { key: '1', icon: <BarChartOutlined />, label: 'Главная страница' },
    //задачи сотрудников
    { key: '/assignment', icon: <CarryOutOutlined />, label: 'Поручения' },
    //поручения для меня
    { key: 'assignmentMe', icon: <ProfileOutlined />, label: 'Мои задачи' },
    //повестка для дейли
    { key: '4', icon: <AudioOutlined />, label: 'Дейли' },
    //итоги встреч (дейли, кластерная встреча и тд)
    { key: '5', icon: <EditOutlined />, label: 'Протоколы встреч' },
    //календарь с основными встречами, которые нельзя пропускать
    { key: '6', icon: <ScheduleOutlined />, label: 'Календарь встреч' },
    //события например др / смена сертификата и тд
    { key: '7', icon: <FieldTimeOutlined />, label: 'События' },
    //отпуск команды
    { key: '8', icon: <SunOutlined />, label: 'Отпуск' },
    //встречи один на один - итоги разговора
    { key: '9', icon: <TeamOutlined />, label: 'One to One' },
  ];


  const onClick = (e) => {
    navigate(e.key);
  };

  return (
    <>
      <div style={{ width: 256 }}>
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

