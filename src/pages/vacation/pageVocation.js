import React from "react";
import Vocation from "../../components/Vocation/Vocation";
import { Tabs, Typography, Select } from 'antd';
import TableVocation from "../../components/Vocation/TableVocation";
import './vocation.css'

const { Title } = Typography;


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
                        { value: '2027', label: '2027 г.' },
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
            <TableVocation />
        </>,
    }
];

const pageVocation = () => {

    return (
        <div className="tabs">
            <Tabs size="small" defaultActiveKey="1" items={items} />
        </div>
    );
}

export default pageVocation;
