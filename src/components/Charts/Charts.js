import React, { useState, useEffect } from "react";
import axios from "axios";
import PieCharts from "./Pie";
import {
    Card, Typography
} from 'antd'

import './charts.css'

export default function Charts({ assignment_employee }) {

    const [dataPriority, setDataPriority] = useState([]);
    const [dataTasks, setDataTasks] = useState([]);
    const { Text } = Typography;

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/assignment/charts/${assignment_employee}`)
            .then((res) => [setDataTasks(res.data.chartsTasks), setDataPriority(res.data.chartsPriority)])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {dataTasks.length === 0 ? <><div className="assignment">
                <Card title={assignment_employee} style={{ width: 1200 }}>
                </Card>
            </div>
            </> :
                <div className="assignment">
                    <Card title={assignment_employee} style={{ width: 1200 }}>
                        <div className="charts">
                            <div className="pieCharts">
                                <PieCharts data={dataTasks} />
                            </div>
                            <div className="pieCharts">
                                <PieCharts data={dataPriority} />
                            </div>
                            <Card title="Статистика:" variant="borderless" style={{ width: 300, marginTop: 70 }}>
                                <div className="title">
                                    <Text style={{ fontSize: 17 }}>• всего задач:
                                        <Text type="success" style={{ fontSize: 17 }}> {dataTasks[0].value + dataTasks[1].value}</Text>
                                    </Text>
                                    <Text style={{ fontSize: 17 }}>• задач выполнено:
                                        <Text type="success" style={{ fontSize: 17 }}> {dataTasks[0].value}</Text>
                                    </Text>
                                    <Text style={{ fontSize: 17 }}>• задач в работе:
                                        <Text type="success" style={{ fontSize: 17 }}> {dataTasks[1].value}</Text>
                                    </Text>
                                    <Text style={{ fontSize: 17 }}>• задач приоритет Низкий:
                                        <Text type="success" style={{ fontSize: 17 }}> {dataPriority[0].value}</Text>
                                    </Text>
                                    <Text style={{ fontSize: 17 }}>• задач приоритет Средний:
                                        <Text type="success" style={{ fontSize: 17 }}> {dataPriority[1].value}</Text>
                                    </Text>
                                    <Text style={{ fontSize: 17 }}>• задач приоритет Высокий:
                                        <Text type="success" style={{ fontSize: 17 }}> {dataPriority[2].value}</Text>
                                    </Text>
                                </div>
                            </Card>
                        </div>
                    </Card>
                </div>
            }
        </>);
}
