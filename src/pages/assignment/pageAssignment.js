import Assignment from "../../components/Assignment/Assignment";
import GanttManager from "../../components/Gantt/Gantta";
import { Tabs } from 'antd';
import "./pageAssignment.css";

const pageAssignment = () => {

  const employee = [
    { assignment_employee: "Жданов Александр Евгеньевич" },
    { assignment_employee: "Тарасенко Сергей Вячеславович" },
    { assignment_employee: "Ерофеева Татьяна Евгеньевна" },
    { assignment_employee: "Прохваткин Алексей Олегович" },
    { assignment_employee: "Шарафадинов Аскар Калиевич" },
    { assignment_employee: "Салеев Илья Александрович" }
  ]

  const items = [
    {
      key: '1',
      label: 'Задачи',
      children: <>
        <div>
          {
            employee.map(obj =>
              <Assignment assignment_employee={obj.assignment_employee} />
            )
          }
        </div>
      </>,
    },
    {
      key: '2',
      label: 'Ганта',
      children: <>
        <div>
          {
            employee.map(obj =>
              <GanttManager assignment_employee={obj.assignment_employee} />
            )
          }
        </div>
      </>,
    },
  ];

  return (
    <div className="tabs">
      <Tabs defaultActiveKey="1" items={items}/>
    </div>
  );
};

export default pageAssignment;

