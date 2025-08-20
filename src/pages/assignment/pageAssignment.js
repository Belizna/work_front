import Assignment from "../../components/Assignment/Assignment";

import "./pageAssignment.css"

const pageAssignment = () => {

  const employee = [
    { assignment_employee: "Жданов Александр Евгеньевич" },
    { assignment_employee: "Тарасенко Сергей Вячеславович" },
    { assignment_employee: "Ерофеева Татьяна Евгеньевна" },
    { assignment_employee: "Прохваткин Алексей Олегович" },
    { assignment_employee: "Шарафадинов Аскар Калиевич" },
    { assignment_employee: "Салеев Илья Александрович" }
  ]

  return (
    <>
      <div>
        {
          employee.map(obj =>
            <Assignment assignment_employee={obj.assignment_employee} />
          )
        }
      </div>
    </>
  );
};

export default pageAssignment;

