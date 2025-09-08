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
        value: 'Подготовлено',
        label: 'Подготовлено',
      },
      {
        value: 'Не подготовлено',
        label: 'Не подготовлено',
      },
    ]} /> :
    inputType === 'priority' ? <Select
      options={[
        {
          value: 'Высокий',
          label: 'Высокий',
        },
        {
          value: 'Средний',
          label: 'Средний',
        },
        {
          value: 'Низкий',
          label: 'Низкий',
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

const PageEvents = () => {
  const [countSave, setCountSave] = useState(0);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/events`)
      .then((res) => setData(res.data.events))
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
    await axios.delete(`${process.env.REACT_APP_API_URL}/events/delete/${record._id}`)
    setData(newData);
  };

  const add = (record) => {
    form.setFieldsValue({
      events_agenda: '',
      events_protocol: '',
      ...record,
    });
    setEditingKey(record._id);
  };

  const edit = (record) => {
    form.setFieldsValue({
      events_date: (dayjs.utc(record.events_date, dateFormat)),
      events_agenda: record.events_agenda,
      meetingCalendar_protocol: record.meetingCalendar_protocol,
      meetingCalendar_status: record.meetingCalendar_status,
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
        typeof _id === 'number' ? await axios.post(`${process.env.REACT_APP_API_URL}/meetingCalendar/add`, row)
          : await axios.patch(`${process.env.REACT_APP_API_URL}/meetingCalendar/edit/${_id}`, row)
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
      title: 'Дата встречи',
      dataIndex: 'meetingCalendar_date',
      width: '9%',
      editable: true,
      ...getColumnSearchProps('meetingCalendar_date')
    },
    {
      title: 'Повестка встречи',
      dataIndex: 'meetingCalendar_agenda',
      width: '15%',
      editable: true,
      ...getColumnSearchProps('meetingCalendar_agenda'),
      render: (text) => (
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {text}
        </div>
      )
    },
    {
      title: 'Задача встречи',
      dataIndex: 'meetingCalendar_protocol',
      width: '27%',
      editable: true,
      ...getColumnSearchProps('meetingCalendar_protocol'),
      render: (text) => (
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {text}
        </div>
      )
    },
    {
      title: 'Статус',
      dataIndex: 'meetingCalendar_status',
      width: '10%',
      editable: true,
      defaultFilteredValue: ['Не подготовлено'],
      filters: [
        {
          text: 'Подготовлено',
          value: 'Подготовлено'
        },
        {
          text: 'Не подготовлено',
          value: 'Не подготовлено'
        }
      ],
      onFilter: (value, record) => record.meetingCalendar_status.startsWith(value)
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
        inputType: col.dataIndex === 'meetingCalendar_status' ?
          'select' : col.dataIndex === 'meetingCalendar_date' ?
            'date' : col.dataIndex === 'meetingCalendar_agenda' ?
              'input' :
              'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleAdd = async () => {
    setPage(Math.ceil((data.length + 1) / 15))
    const newData = {
      _id: Math.random(),
      meetingCalendar_agenda: '',
      meetingCalendar_protocol: '',
      meetingCalendar_status: 'Не подготовлено'
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
        Добавить событие
      </Button>
    </div>

  );
}

export default PageEvents;