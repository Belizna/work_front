import { Column } from '@ant-design/plots';
import { Empty } from 'antd';

const DemoDualAxes = ({ data }) => {

    var config = {
        data,
        xField: 'type',
        yField: 'value',
        xAxis: {
            label: {
                autoRotate: false,
            },
        },
    };

    return <>
        <div style={{height: 370}}>
            {data.length < 1 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <Column {...config} />}
        </div>
    </>
};

export default DemoDualAxes