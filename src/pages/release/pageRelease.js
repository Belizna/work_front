import Release from "../../components/Release/Release";

const pageRelease = () => {

    const employee = [
        { assignment_employee: "Ермолаев Ян Александрович" },
        { assignment_employee: "Тарасенко Сергей Вячеславович" },
        { assignment_employee: "Ерофеева Татьяна Евгеньевна" },
        { assignment_employee: "Прохваткин Алексей Олегович" },
        { assignment_employee: "Жданов Александр Евгеньевич" }
    ]

    return (
        <div className="tabs">
            {
                employee.map(obj =>
                    <Release assignment_employee={obj.assignment_employee} />
                )
            }
        </div>
    );
};

export default pageRelease;

