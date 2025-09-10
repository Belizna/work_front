import { useEffect, useState } from "react";
import { Form, Input, Popconfirm, Table, Select, Typography, Button, DatePicker, Card } from 'antd';
import axios from "axios";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc);

const { TextArea } = Input;
const dateFormat = 'DD-MM-YYYY'


const TableVocation = () => {
    const [countSave, setCountSave] = useState(0);
    const [employeeSelector, setEmployeeSelector] = useState([])
    const [employeeFilterSelector, setEmployeeFilterSelector] = useState([])
    const [data, setData] = useState([]);
    const [dataDays, setDataDays] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/vocation`)
            .then((res) => [setEmployeeSelector(res.data.employeeSelector),
            setEmployeeFilterSelector(res.data.employeeFilterSelector),
            setData(res.data.vocation),
            setDataDays(res.data.vocationGroupDays)
            ])
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
        const inputNode = inputType === 'select' ? <Select
            options={employeeSelector} /> :
            inputType === 'date' ?
                <DatePicker format={{ format: dateFormat }} /> : <TextArea />;
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
    const [pageSize, setPageSize] = useState(6);


    const handleDelete = async (record) => {
        const newData = data.filter((item) => item._id !== record._id);
        await axios.delete(`${process.env.REACT_APP_API_URL}/vocation/delete/${record._id}`)
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
            employee_vocation_from: (dayjs.utc(record.employee_vocation_from, dateFormat)),
            employee_vocation_to: (dayjs.utc(record.employee_vocation_to, dateFormat)),
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
                typeof _id === 'number' ? await axios.post(`${process.env.REACT_APP_API_URL}/vocation/add/`, row)
                    : await axios.patch(`${process.env.REACT_APP_API_URL}/vocation/edit/${_id}`, row)
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

    const columnsTableDays = [
        {
            title: 'Сотдруник',
            dataIndex: 'assignment_employee',
            width: '30%',
            editable: true,
        },
        {
            title: 'Количество дней',
            dataIndex: 'days_vocation',
            width: '30%',
            editable: true,
        },
    ];

    const columns = [
        {
            title: 'Сотрудник',
            dataIndex: 'assignment_employee',
            width: '15%',
            editable: true,
            filters: employeeFilterSelector,
            onFilter: (value, record) => record.assignment_employee.startsWith(value)
        },
        {
            title: 'Начало',
            dataIndex: 'employee_vocation_from',
            width: '18%',
            editable: true,
        },
        {
            title: 'Окончание',
            dataIndex: 'employee_vocation_to',
            width: '18%',
            editable: true,
        },
        {
            title: 'Действия',
            dataIndex: 'operation',
            width: '10%',
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
                inputType: col.dataIndex === 'assignment_employee' ? 'select' :
                    'date',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleAdd = async () => {
        setPage(Math.ceil((data.length + 1) / pageSize))
        const newData = {
            _id: Math.random(),
        };
        setData([...data, newData])
        add(newData)
    };
    return (
        <Card >
            <div className="cardTable">
                <div className="tableVotation">
                    <Table columns={columnsTableDays} dataSource={dataDays} />
                </div>
                <div style={{ width: 700, marginLeft: 30 }}>

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
                        Добавить отпуск
                    </Button>
                </div>
            </div>
        </Card>

    );
}

export default TableVocation;