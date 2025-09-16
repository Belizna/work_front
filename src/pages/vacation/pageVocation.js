import Vocation from "../../components/Vocation/Vocation";
import { Tabs } from 'antd';
import TableVocation from "../../components/Vocation/TableVocation";
import './vocation.css'

const pageVocation = () => {


    const items = [
        {
            key: '1',
            label: 'График',
            children: <>
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

    return (
        <div className="tabs">
            <Tabs size="small" defaultActiveKey="1" items={items} />
        </div>
    );
}

export default pageVocation;
