import React, { useState, useEffect } from "react";
import { Card, Button, Modal, DatePicker, Form, Input, Select, } from 'antd'
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import axios from "axios";

import './gantt.css'

const ruLocale = {
    months: [
        "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
        "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
    ],
    days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
};

export default function GanttManager({ assignment_employee }) {

    var task = []
    const EmptyTooltip = () => <></>;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [dataSelector, setDataSelector] = useState([]);
    const [countSave, setCountSave] = useState(0)

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        await axios.post(`${process.env.REACT_APP_API_URL}/gantt/add/${assignment_employee}`, values)
        setCountSave(countSave + 1)
        setIsModalOpen(false)
    };

    useEffect(() => {
        var tasks = []
        axios.get(`${process.env.REACT_APP_API_URL}/gantt/${assignment_employee}`)
            .then((res) => [tasks = res.data.gantt,
            tasks.map(arr => task.push({
                id: arr.id,
                type: arr.type,
                name: arr.name,
                start: new Date(arr.start),
                end: new Date(arr.end),
                progress: arr.progress,
                dependencies: arr.dependencies
            })), setData(task), setDataSelector(res.data.ganttSelector)])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countSave]);


    const handleSave = async (task) => {
        await axios.patch(`${process.env.REACT_APP_API_URL}/gantt/edit/${task.id}`, task)
    };

    return (
        <>
            {data.length === 0 ? <><div className="assignment">
                <Card title={assignment_employee} style={{ width: 1180 }}>
                </Card>
            </div>
            </> :
                <div className="assignment">
                    <Card title={assignment_employee} style={{ width: 1180 }}>
                        <div
                            style={{
                                width: "100%",                 // контейнер ровно по экрану
                                maxWidth: "100vw",
                                overflowX: "scroll",           // включаем горизонтальный скролл
                                overflowY: "hidden",
                                WebkitOverflowScrolling: "touch", // инерция свайпа на iOS
                                touchAction: "pan-x pan-y",          // говорим браузеру отдавать свайпы
                                overscrollBehaviorX: "contain" // не скроллим всю страницу
                            }}
                        >
                            <div style={{ minWidth: "1500px" }}>
                                <div >
                                    <Gantt
                                        todayColor="rgba(0, 255, 38, 0.3)"
                                        tasks={data}
                                        viewMode={ViewMode.Day}
                                        locale={ruLocale}
                                        TooltipContent={EmptyTooltip}
                                        onDateChange={(task) => {
                                            handleSave(task);
                                            setData((prev) =>
                                                prev.map((t) => (t.id === task.id ? task : t))
                                            );
                                        }}
                                        onProgressChange={(task) => {
                                            handleSave(task);
                                            setData((prev) =>
                                                prev.map((t) => (t.id === task.id ? task : t))
                                            );
                                        }}
                                        listCellWidth=""
                                    />
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={showModal}
                            type="primary"
                            style={{
                                marginTop: 10,
                            }}>
                            Добавить подзадачу
                        </Button>
                    </Card>
                    <Modal
                        title="Создание подзадачи"
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        <Form
                            onFinish={onFinish}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 24 }}
                            layout="horizontal"
                            style={{ maxWidth: 600 }}
                        >
                            <Form.Item name={['name']} label="Задача">
                                <Input />
                            </Form.Item>
                            <Form.Item name={['dependencies']} label="Родитель">
                                <Select
                                    options={dataSelector} />
                            </Form.Item>
                            <Form.Item name={['end']} label="Конец">
                                <DatePicker />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Сохранить
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            }
        </>);
}
