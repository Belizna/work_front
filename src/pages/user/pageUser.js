import { useEffect, useState, useRef } from "react";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Form, Input, Popconfirm, Table, Space, Select, Typography, Button, DatePicker } from 'antd';
import axios from "axios";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc);

const { TextArea } = Input;
const dateFormat = 'DD-MM-YYYY'

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
        options={[
            {
                value: 'Прикладной администратор',
                label: 'Прикладной администратор',
            },
            {
                value: 'Старший прикладной администратор',
                label: 'Старший прикладной администратор',
            },
            {
                value: 'Ведущий прикладной администратор',
                label: 'Ведущий прикладной администратор',
            },
            {
                value: 'Главный прикладной администратор',
                label: 'Главный прикладной администратор',
            },
        ]} /> : inputType === 'date' ?
        <DatePicker format={{ format: dateFormat }} />
        : inputType === 'input' ? <Input /> : <TextArea />;
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

const PageUsers = () => {
    const [countSave, setCountSave] = useState(0);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/teams`)
            .then((res) => setData(res.data.teams))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countSave])

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record._id === editingKey;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Поиск задачи`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Поиск
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Сброс
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleDelete = async (record) => {
        const newData = data.filter((item) => item._id !== record._id);
        await axios.delete(`${process.env.REACT_APP_API_URL}/teams/${record._id}`)
        setData(newData);
    };

    const add = (record) => {
        form.setFieldsValue({
            fio_user: '',
            ...record,
        });
        setEditingKey(record._id);
    };

    const edit = (record) => {
        form.setFieldsValue({
            birthday: (dayjs.utc(record.birthday, dateFormat)),
            date_employment: (dayjs.utc(record.date_employment, dateFormat)),
            fio_user: record.fio_user,
            user_position: record.user_position,
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
                typeof _id === 'number' ? await axios.post(`${process.env.REACT_APP_API_URL}/teams/add`, row)
                    : await axios.patch(`${process.env.REACT_APP_API_URL}/teams/edit/${_id}`, row)
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
            title: 'Сотрудник',
            dataIndex: 'fio_user',
            width: '18%',
            editable: true,
            ...getColumnSearchProps('fio_user')
        },
        {
            title: 'День рождения',
            dataIndex: 'birthday',
            width: '12%',
            editable: true,
        },
        {
            title: 'Трудоустройство',
            dataIndex: 'date_employment',
            width: '12%',
            editable: true,
        },
        {
            title: 'Должность',
            dataIndex: 'user_position',
            width: '20%',
            editable: true,
            filters: [
                {
                    text: 'Прикладной администратор',
                    value: 'Прикладной администратор'
                },
                {
                    text: 'Старший прикладной администратор',
                    value: 'Старший прикладной администратор'
                },
                {
                    text: 'Ведущий прикладной администратор',
                    value: 'Ведущий прикладной администратор'
                },
                {
                    text: 'Главный прикладной администратор',
                    value: 'Главный прикладной администратор'
                }
            ],
            onFilter: (value, record) => record.user_position.startsWith(value)
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
                inputType: col.dataIndex === 'user_position' ?
                    'select' : col.dataIndex === 'fio_user' ?
                        'text' :
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
            fio_user: '',
            birthday: '',
            date_employment: '',
            user_position: 'Прикладной администратор'
        };
        setData([...data, newData])
        add(newData)
    };
    return (
        <div className="assignment">
            <Form form={form} component={false}>
                <Table style={{ width: 1200 }}
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
                Добавить сотрудника
            </Button>
        </div>

    );
}

export default PageUsers;