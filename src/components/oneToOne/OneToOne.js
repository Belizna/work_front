import { useEffect, useState, useRef } from "react";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Form, Input, Popconfirm, Table, Space, Select, Typography, Card, Button, DatePicker } from 'antd';
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
        value: 'Обработано',
        label: 'Обработано',
      },
      {
        value: 'Не Обработано',
        label: 'Не Обработано',
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

const OneToOne = ({ assignment_employee }) => {
  const [countSave, setCountSave] = useState(0);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/oneToOne/${assignment_employee}`)
      .then((res) => setData(res.data.oneToOne))
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
    await axios.delete(`${process.env.REACT_APP_API_URL}/oneToOne/delete/${record._id}`)
    setData(newData);
  };

  const add = (record) => {
    form.setFieldsValue({
      oneToOne_agenda: '',
      oneToOne_protocol: '',
      ...record,
    });
    setEditingKey(record._id);
  };

  const edit = (record) => {
    form.setFieldsValue({
      oneToOne_date: (dayjs.utc(record.oneToOne_date, dateFormat)),
      oneToOne_agenda: record.oneToOne_agenda,
      oneToOne_protocol: record.oneToOne_protocol,
      oneToOne_status: record.oneToOne_status,
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
        typeof _id === 'number' ? await axios.post(`${process.env.REACT_APP_API_URL}/oneToOne/add/${assignment_employee}`, row)
          : await axios.patch(`${process.env.REACT_APP_API_URL}/oneToOne/edit/${_id}`, row)
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
      dataIndex: 'oneToOne_date',
      width: '10%',
      editable: true,
      ...getColumnSearchProps('oneToOne_date')
    },
    {
      title: 'Повестка встречи',
      dataIndex: 'oneToOne_agenda',
      width: '25%',
      editable: true,
      ...getColumnSearchProps('oneToOne_agenda'),
      render: (text) => (
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {text}
        </div>
      )
    },
    {
      title: 'Протокол встречи',
      dataIndex: 'oneToOne_protocol',
      width: '25%',
      editable: true,
      ...getColumnSearchProps('oneToOne_protocol'),
      render: (text) => (
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {text}
        </div>
      )
    },
    {
      title: 'Статус',
      dataIndex: 'oneToOne_status',
      width: '7%',
      editable: true,
      defaultFilteredValue: ['Не Обработано'],
      filters: [
        {
          text: 'Обработано',
          value: 'Обработано'
        },
        {
          text: 'Не Обработано',
          value: 'Не Обработано'
        }
      ],
      onFilter: (value, record) => record.oneToOne_status.startsWith(value)
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
        inputType: col.dataIndex === 'oneToOne_status' ?
          'select' : col.dataIndex === 'oneToOne_date' ?
            'date' : 'text',
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
      oneToOne_agenda: `🧑‍💻 Про задачи и работу:
        • Какие задачи приносят тебе больше всего удовольствия?
        • Есть ли что-то рутинное/бесполезное, от чего хотелось бы избавиться?
        • Что в работе даётся сложнее всего?
        •  Есть ли сейчас блокеры, которые мешают двигаться быстрее?
        •  Что бы ты изменил в нашем рабочем процессе?

🤝 Про команду и коммуникацию:"
        •  Как тебе работать с командой?
        •  С кем взаимодействовать проще всего? С кем сложнее?
        •  Чувствуешь ли ты поддержку от коллег?
        •  Есть ли конфликты или недопонимания, о которых стоит поговорить?
        •  Что бы улучшило нашу командную работу?

🎯 Про развитие и мотивацию:"
        •  Какие навыки ты хотел бы развить в ближайшие 6–12 месяцев?
        •  Хочешь ли попробовать новые роли или задачи?
        •  Как ты видишь своё развитие в компании?
        •  Что помогает тебе быть мотивированным?
        •  Есть ли что-то, что наоборот демотивирует?

🗣 Про обратную связь"
        •  Как ты оцениваешь мою работу как руководителя?
        •  Чего бы тебе хотелось больше/меньше от меня?
        •  Есть ли что-то, что я мог бы делать иначе, чтобы тебе было комфортнее работать?
        •  Получаешь ли ты достаточно обратной связи?
        •  Какую обратную связь ты хотел бы получить сегодня?

🌱 Личное и баланс"
        •  Как ты себя чувствуешь в целом (энергия, настроение)?
        •  Удаётся ли держать баланс между работой и личной жизнью?
        •  Есть ли у тебя хобби/интересы, которые помогают разгрузиться?
        •  Чувствуешь ли ты усталость или выгорание?
        •  Как мы можем помочь тебе чувствовать себя комфортнее на работе?
        
⚡ Формат «блиц» (если мало времени)"
        •  Что тебе больше всего нравится в работе сейчас?
        •  Что бесит сильнее всего?
        •  Где я могу помочь прямо сейчас?
        •  Если бы у тебя была «волшебная палочка» — что бы ты изменил в компании?`,
      oneToOne_protocol: '',
      oneToOne_status: 'Не Обработано'
    };
    setData([...data, newData])
    add(newData)
  };
  return (
    <div className="assignment">
      <Card title={assignment_employee} style={{ width: 1180 }}>
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
          Добавить повестку
        </Button>
      </Card>
    </div>

  );
}

export default OneToOne;