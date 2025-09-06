import React, { useRef, useState } from "react";
import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

import './vocation.css'

const YEAR = 2025;

const employees = [
    { id: "1", name: "Иванов Иван" },
    { id: "2", name: "Петров Петр" },
    { id: "3", name: "Сидоров Сидор" },
];

const vacationsRaw = [
    { empId: "1", start: "2025-06-10", end: "2025-06-20" },
    { empId: "2", start: "2025-07-05", end: "2025-07-14" },
    { empId: "3", start: "2025-07-10", end: "2025-07-20" },
    { empId: "3", start: "2025-12-01", end: "2025-12-15" },
];

// ✅ важная конвертация: строки → Date
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

const Vocation = () => {

    const wrapperRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDown(true);
        setStartX(e.pageX - wrapperRef.current.offsetLeft);
        setScrollLeft(wrapperRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDown(false);
    const handleMouseUp = () => setIsDown(false);

    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapperRef.current.offsetLeft;
        const walk = (x - startX) * 1; // коэффициент чувствительности
        wrapperRef.current.scrollLeft = scrollLeft - walk;
    };

    // поддержка тач-свайпа
    const handleTouchStart = (e) => {
        setIsDown(true);
        setStartX(e.touches[0].pageX - wrapperRef.current.offsetLeft);
        setScrollLeft(wrapperRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - wrapperRef.current.offsetLeft;
        const walk = (x - startX) * 1;
        wrapperRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => setIsDown(false);

    const months = Array.from({ length: 12 }, (_, i) => i); // 0..11

    const monthTasks = months.map((m) =>
        vacations
            .filter((v) => overlapsMonth(v, YEAR, m))
            .map((v, i) => {
                const emp = employees.find((e) => e.id === v.empId);
                return {
                    start: v.start,
                    end: v.end,
                    name: emp?.name || `Сотрудник ${v.empId}`,
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
                                className="gantt-swipe"
                                onMouseDown={handleMouseDown}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}>

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
