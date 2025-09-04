import Assignment from "../../components/Assignment/Assignment";
import GanttManager from "../../components/Gantt/Gantta";
import { Tabs } from 'antd';

const pageAssignmentMe = () => {

  const items = [
    {
      key: '1',
      label: 'Задачи',
      children: <>
        <div>
          <Assignment assignment_employee={"Ермолаев Ян Александрович"} />
        </div>
      </>,
    },
    {
      key: '2',
      label: 'Ганта',
      children: <>
        <div>
          <GanttManager assignment_employee={"Ермолаев Ян Александрович"} />
        </div>
      </>,
    },
  ];

  return (
    <>
      <div className="tabs">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </>
  );
};

export default pageAssignmentMe;

