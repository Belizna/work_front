import React, { useRef, useState, useEffect } from "react";
import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import axios from "axios";

import './vocation.css'

const YEAR = 2025;


const Vocation = () => {

    const [vacationsRaw, setVacationsRaw] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/vocation/gantt`)
            .then((res) => [
                setVacationsRaw(res.data.vocation)
            ])
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
            .filter((v) => overlapsMonth(v, YEAR, m))
            .map((v, i) => {
                return {
                    start: v.start,
                    end: v.end,
                    name: v.empId,
                    id: `${v.empId}-${YEAR}-${m}-${i}`,
                    type: "task",
                    progress: 100,
                    isDisabled: true,
                };
            })
    );

    return (
        <div className="months-grid">
            {months.map((m) => (
                <div key={m} className="month-card">
                    <h3 className="month-title">
                        {new Date(YEAR, m, 1).toLocaleString("ru-RU", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h3>

                    {monthTasks[m].length > 0 ? (
                        <div className="gantt-wrapper">
                            <div ref={wrapperRef}
                                className="gantt-swipe">
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
                    ) : (
                        <div className="empty-month">Нет отпусков</div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Vocation;
