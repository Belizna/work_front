import React from "react";
import Vocation from "../../components/Vocation/Vocation";
import { Tabs, Typography, Select, Card, Table } from 'antd';
import './vocation.css'

const { Title } = Typography;

const data = [
    {
        assignment_employee: 'Тарасенко',
        days_vocation: 28
    },
    {
        assignment_employee: 'Жданов',
        days_vocation: 28
    },
    {
        assignment_employee: 'Прохваткин',
        days_vocation: 56
    },
    {
        assignment_employee: 'Ерофеева',
        days_vocation: 38
    }
]
const columns = [
    {
        title: 'Сотдруник',
        dataIndex: 'assignment_employee',
        width: '50%',
        editable: true,
    },
    {
        title: 'Количество дней отпуска',
        dataIndex: 'days_vocation',
        width: '27%',
        editable: true,
    },
];

const items = [
    {
        key: '1',
        label: 'График',
        children: <>
            <div className="tab1_1">
                <Title level={5}>Сводка за <Select
                    defaultValue={"2025"}

                    style={{ width: 85 }}
                    options={[
                        { value: '2024', label: '2024 г.' },
                        { value: '2025', label: '2025 г.' },
                        { value: '2026', label: '2026 г.' },
                    ]}
                /> </Title>

            </div>
            <Vocation />
        </>,
    },
    {
        key: '2',
        label: 'Статистика',
        children: <>
            <Card >
                <Table columns={columns} dataSource={data}/>
            </Card>
        </>,
    },
    {
        key: '3',
        label: 'Админка',
        children: <>
        </>,
    },
];

const pageVocation = () => {

    return (
        <div className="tabs">
            <Tabs size="small" defaultActiveKey="1" items={items} />
        </div>
    );
}

export default pageVocation;
