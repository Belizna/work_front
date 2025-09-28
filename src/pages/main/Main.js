import { useEffect, useState } from "react";
import { Card, Typography, Collapse } from 'antd';
import axios from "axios";

import './main.css'

const { Text } = Typography;

const MainPage = () => {

    var items = []
    var itemsMe = []


    const [releaseTeams, setReleaseTeams] = useState([]);
    const [assignmentMe, setAssignmentMe] = useState([]);
    const [assignmentTeams, setAssignmentTeams] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL}/main`)
            .then((res) => [
                setReleaseTeams(res.data.releaseTeams),
                setAssignmentMe(res.data.assignmentMe),
                setAssignmentTeams(res.data.assignmentTeams),
                setEvents(res.data.events)
            ])
    }, [])

    return (

        <>
            <div className="assignment">
                <div className="eventsAndReleaseTeams">
                    <>
                        {
                            events.length > 0 ?
                                <Card style={{ width: 560 }} title="Ближайшие события"> <div className="eventsTeams">
                                    <Collapse defaultActiveKey="1" items={[
                                        {
                                            key: '1',
                                            label: `${events[0]?.title}`,
                                            children: <div className="releaseTeams">
                                                {events[0].events?.map(arr =>
                                                    <div style={{ marginBottom: 10 }}>
                                                        <Text>{arr.days + " " + arr.title + " "
                                                            + arr.fio_user + " " + arr.diff}
                                                        </Text>
                                                    </div>
                                                )}
                                            </div>,
                                        },
                                        {
                                            key: '2',
                                            label: `${events[1]?.title}`,
                                            children: <div className="releaseTeams">
                                                {events[1].events?.map(arr =>
                                                    <div style={{ marginBottom: 10 }}>
                                                        <Text>{arr.assignment_employee + " c " + arr.employee_vocation_from + " по "
                                                            + arr.employee_vocation_to}
                                                        </Text>
                                                    </div>
                                                )}
                                            </div>,
                                        }]} />
                                </div>
                                </Card> : <></>
                        }
                    </>
                    <>
                        {
                            releaseTeams.length > 0 ?
                                <Card style={{ width: 560 }} title="График релизов"> <div>
                                    <Collapse defaultActiveKey="1" items={[
                                        {
                                            key: '1',
                                            label: `${releaseTeams[0].title}`,
                                            children: <div className="releaseTeams">
                                                {releaseTeams[0].release?.map(arr =>
                                                    <div className="releaseTeamsBlock">
                                                        <div>
                                                            {arr.assignment_employee}
                                                        </div>
                                                        <div>
                                                            {arr.release_date}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>,
                                        },
                                        {
                                            key: '2',
                                            label: `${releaseTeams[1]?.title}`,
                                            children: <div className="releaseTeams">
                                                {releaseTeams[1].release?.map(arr =>
                                                    <div className="releaseTeamsBlock">
                                                        <div>
                                                            {arr.assignment_employee}
                                                        </div>
                                                        <div>
                                                            {arr.release_date}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>,
                                        }]} />
                                </div>
                                </Card> :
                                <>
                                </>
                        }
                    </>
                </div>
                <div className="eventsAndReleaseTeams">
                    <Card style={{ width: 560 }} title="Просроченные поручения">
                        <div>
                            {
                                assignmentTeams.map(arr => {
                                    items.push({
                                        label: `${arr._id} количество: ${arr.count}`,
                                        children: <div className="eventsTeams">
                                            {arr.tasks.map(tsk =>
                                                <div className="assignmentTeamsBlock">
                                                    <div >
                                                        {tsk.assignment_date}
                                                    </div>
                                                    <div style={{ width: 250 }}>
                                                        {tsk.assignment_name}
                                                    </div>
                                                    <div>
                                                        {tsk.assignment_task}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    })
                                    return true
                                })
                            }
                            <Collapse items={items} />
                        </div>
                    </Card>
                    <Card style={{ width: 560 }} title="Просроченные задачи">
                        <div>
                            {
                                assignmentMe.map(arr => {

                                    itemsMe.push({
                                        label: `${arr._id} количество: ${arr.count}`,
                                        children: <div className="eventsTeams">
                                            {arr.tasks.map(tsk =>
                                                <div className="assignmentTeamsBlock">
                                                    <div>
                                                        {tsk.assignment_date}
                                                    </div>
                                                    <div>
                                                        {tsk.assignment_name}
                                                    </div>
                                                    <div>
                                                        {tsk.assignment_task}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    })
                                    return true
                                })
                            }
                            <Collapse items={itemsMe} />
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default MainPage;