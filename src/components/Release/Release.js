import { useEffect, useState } from "react";
import { Form, Input, Popconfirm, Statistic, Tabs, Table, InputNumber, Select, Typography, Button, DatePicker, Card } from 'antd';
import axios from "axios";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'

import './release.css'

dayjs.extend(utc);

const { TextArea } = Input;
const dateFormat = 'DD-MM-YYYY'
const currentYear = new Date().getFullYear().toString()
const { Title } = Typography;

const Release = ({ assignment_employee }) => {

    const [countSave, setCountSave] = useState(0);
    const [data, setData] = useState([]);
    const [statiscticRelease, setStatiscticRelease] = useState([
        { date_release: 0 },
        { time_release: 0 }]);
    const [isYear, setIsYear] = useState(currentYear);

    const fetchStatic = async (isYear) => {
        const postFetch = {
            year: isYear,
            assignment_employee: assignment_employee
        }
        axios.post(`${process.env.REACT_APP_API_URL}/release/`, postFetch)
            .then((res) => [setData(res.data.releaseEntity),
            setStatiscticRelease(res.data.statiscticRelease)])
    }

    const handleChange = async (value) => {
        const postFetch = {
            year: value,
            assignment_employee: assignment_employee
        }
        await axios.post(`${process.env.REACT_APP_API_URL}/release/`, postFetch)
            .then(res => [
                setData(res.data.releaseEntity),
                setStatiscticRelease(res.data.statiscticRelease),
                setIsYear(value)])
    }

    useEffect(() => {
        fetchStatic(isYear)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countSave])

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputNode = inputType === 'date' ?
            <DatePicker format={{ format: dateFormat }} /> :
            inputType === 'number' ?
                <InputNumber min={0} step={0.5} /> : <TextArea />;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record._id === editingKey;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);


    const handleDelete = async (record) => {
        const newData = data.filter((item) => item._id !== record._id);
        await axios.delete(`${process.env.REACT_APP_API_URL}/release/delete/${record._id}`)
        setData(newData);
    };

    const add = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record._id);
    };

    const edit = (record) => {
        form.setFieldsValue({
            release_date: dayjs.utc(record.release_date, dateFormat),
            release_time: record.release_time,
            release_zni: record.release_zni,
            assignment_employee: record.assignment_employee,
        });
        setEditingKey(record._id);
    };

    const cancel = (_id) => {
        try {
            if (typeof _id === 'number') {
                const newData = data.filter((item) => item._id !== _id);
                setData(newData);
                setEditingKey('');
            }
            else setEditingKey('');
        }
        catch (errInfo) {
            console.log('Cancel error:', errInfo);
        }
    };

    const save = async (_id) => {
        try {
            const row = await form.validateFields();

            console.log(row)
            const newData = [...data];
            const index = newData.findIndex((item) => _id === item._id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
                typeof _id === 'number' ? await axios.post(`${process.env.REACT_APP_API_URL}/release/add/${assignment_employee}`, row)
                    : await axios.patch(`${process.env.REACT_APP_API_URL}/release/edit/${_id}`, row)
                setCountSave(countSave + 1)
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };


    const columns = [
        {
            title: 'Дата',
            dataIndex: 'release_date',
            width: '20%',
            editable: true,
        },
        {
            title: 'Факт',
            dataIndex: 'release_time',
            width: '5%',
            editable: true,
            sorter: {
                compare: (a, b) => a.release_time - b.release_time,
                multiple: 1,
            },
        },
        {
            title: 'ЗНИ',
            dataIndex: 'release_zni',
            width: '25%',
            editable: true,
        },
        {
            title: 'Действия',
            dataIndex: 'operation',
            width: '15%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    /* eslint-disable */
                    <span>
                        <Typography.Link
                            onClick={() => save(record._id)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Отменить редактирование?" onConfirm={() => cancel(record._id)}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{ marginRight: 8 }}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Уверен в удалении?" onConfirm={() => handleDelete(record)}>
                            <a>Delete</a>
                        </Popconfirm>
                    </>
                    /* eslint-enable */
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'release_date' ? 'date' :
                    col.dataIndex === 'release_time' ?
                        'number' :
                        'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleAdd = async () => {
        //setPage(Math.ceil((data.length + 1) / pageSize))
        const newData = {
            _id: Math.random(),
            release_time: 0.0,
            release_zni: 'C-VTB-'
        };
        setData([newData, ...data])
        add(newData)
    };

    const items = [
        {
            key: '1',
            label: 'Релизы',
            children: <>
                <div className="release">
                    <div className="tableRelease">
                        <Form form={form} component={false}>
                            <Table
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                bordered
                                dataSource={data}
                                columns={mergedColumns}
                                pagination={{
                                    current: page,
                                    pageSize: pageSize,
                                    onChange: (page, pageSize) => {
                                        setPage(page)
                                        setPageSize(pageSize)
                                    },
                                }}>
                            </Table>
                        </Form>
                        <Button
                            onClick={handleAdd}
                            type="primary"
                            style={{
                                marginTop: 10,
                            }}>
                            Добавить выход
                        </Button>
                    </div>
                    <div>
                        <Card size='small' bordered={true}>
                            <Statistic
                                title="Выходов на релизы"
                                value={statiscticRelease[0].date_release}
                                valueStyle={{
                                    color: '#13cf20ff',
                                    fontSize: 20
                                }}
                            />
                        </Card>
                    </div>
                    <div>
                        <Card size='small' bordered={true}>
                            <Statistic
                                title="Отработано времени"
                                value={statiscticRelease[1].time_release}
                                valueStyle={{
                                    color: '#13cf20ff',
                                    fontSize: 20
                                }}
                            />
                        </Card>
                    </div>
                </div>
            </>,
        },
        {
            key: '2',
            label: 'Charts',
            children: <>

            </>,
        },
    ];

    return (
        <div className="assignment">
            <Card title={assignment_employee}>
                <Title style={{ marginTop: -10 }} level={5}>Сводка за <Select
                    defaultValue={isYear}
                    onChange={handleChange}
                    style={{ width: 85 }}
                    options={[
                        { value: '2025', label: '2025 г.' },
                        { value: '2026', label: '2026 г.' },
                        { value: '2027', label: '2027 г.' },
                    ]}
                /> </Title>
                <Tabs size="small" defaultActiveKey="1" items={items} />
            </Card>
        </div>
    );
}

export default Release;