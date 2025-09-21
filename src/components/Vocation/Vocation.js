import React, { useRef, useState, useEffect } from "react";
import { Gantt } from "gantt-task-react";
import { Select, Typography } from 'antd';
import "gantt-task-react/dist/index.css";
import axios from "axios";

import './vocation.css'

const currentYear = new Date().getFullYear()

const { Title } = Typography;

const Vocation = () => {

    const [vacationsRaw, setVacationsRaw] = useState([]);
    const [isYear, setIsYear] = useState(currentYear);

    const fetchStatic = async (isYear) => {
        axios.get(`${process.env.REACT_APP_API_URL}/vocation/gantt/${isYear}`)
            .then((res) => [setVacationsRaw(res.data.vocation)])
    }

    const handleChange = async (value) => {
        await axios.get(`${process.env.REACT_APP_API_URL}/vocation/gantt/${value}`)
            .then(res => [setVacationsRaw(res.data.vocation),
            setIsYear(value)])
    }

    useEffect(() => {
        fetchStatic(isYear)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const vacations = vacationsRaw.map(v => ({
        ...v,
        start: new Date(v.start),
        end: new Date(v.end),
    }));

    const monthRange = (year, m) => ({
        start: new Date(year, m, 1, 0, 0, 0, 0),
        end: new Date(year, m + 1, 0, 23, 59, 59, 999), // последний день месяца
    });

    const overlapsMonth = (v, year, m) => {
        const { start, end } = monthRange(year, m);
        return v.start <= end && v.end >= start;
    };

    const wrapperRef = useRef(null);

    const months = Array.from({ length: 12 }, (_, i) => i); // 0..11

    const monthTasks = months.map((m) =>
        vacations
            .filter((v) => overlapsMonth(v, isYear, m))
            .map((v, i) => {
                return {
                    start: v.start,
                    end: v.end,
                    name: v.empId,
                    id: `${v.empId}-${isYear}-${m}-${i}`,
                    type: "task",
                    progress: 100,
                    isDisabled: true,
                };
            })
    );

    return (
        <>
            <Title level={5}>Сводка за <Select
                defaultValue={isYear}
                onChange={handleChange}
                style={{ width: 85 }}
                options={[
                    { value: '2025', label: '2025 г.' },
                    { value: '2026', label: '2026 г.' },
                    { value: '2027', label: '2027 г.' },
                ]}
            /> </Title>
            <div className="months-grid">
                {months.map((m) => (
                    <div key={m} className="month-card">
                        <h3 className="month-title">
                            {new Date(isYear, m, 1).toLocaleString("ru-RU", {
                                month: "long",
                                year: "numeric",
                            })}
                        </h3>

                        {monthTasks[m].length > 0 ? (
                            <div className="gantt-wrapper">
                                <div ref={wrapperRef}
                                    className="gantt-swipe">
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
                                            <Gantt
                                                tasks={monthTasks[m]}
                                                viewMode="Day"
                                                listCellWidth=""
                                                columnWidth={45}
                                                rowHeight={48}
                                                barHeight={20}
                                                locale="ru"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-month">Нет отпусков</div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Vocation;
