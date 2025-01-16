import {
  enterDialogue,
  getListChat,
  masterControlSwitch,
  queryMasterControlSwitch,
} from '@/services/index';
import { getUrlParams } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  ConfigProvider,
  Divider,
  Empty,
  Form,
  Pagination,
  Segmented,
  Select,
  Spin,
  Switch,
  Typography,
  message,
} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

const Options: any = {
  1: '抱怨投诉',
  2: '咨询-试驾/订单/交付(包含地名)',
  3: '咨询-转人工',
  4: '向量检索低于阈值（包含照片、视频等）',
};

interface IItemProps {
  cb: (type: 'btn', data: any) => void;
  content: Record<string, any>;
}

const RenderItem: React.FC<IItemProps> = (props) => {
  const { content, cb } = props;

  return (
    <>
      <div className="item-wrap">
        <div className="item">
          <div className="item-left">
            <Avatar
              shape="square"
              size={64}
              icon={<UserOutlined />}
              src={content?.headImgUrl}
            />
          </div>
          <div className="item-content">
            <Typography.Title level={5}>{content?.nickname}</Typography.Title>
            <Typography.Paragraph ellipsis={true}>
              {content?.content}
            </Typography.Paragraph>
          </div>
          <div className="item-tips">{Options[content?.questionType]}</div>
          <div className="item-right">
            <Button onClick={() => cb('btn', content)}>进入会话</Button>
          </div>
        </div>
        <Typography.Text type="secondary">{content?.sendTime}</Typography.Text>
      </div>
      <Divider />
    </>
  );
};

const controllerDefault = false;
const isReadDefault = '0';
const isTypeDefault = null;
const pageDefault = 1;
const pageSizeDefault = 10;
const totalDefault = 0;

const ReplyPage: React.FC = () => {
  const urlParams: any = getUrlParams({});

  const [controller, setController] = useState<boolean>(controllerDefault);
  const [controllerLoading, setControllerLoading] = useState<boolean>(false);
  const controllerFn = async () => {
    setControllerLoading(true);
    const {
      data: { data, message: msg, code },
    } = await queryMasterControlSwitch({ ...urlParams });
    if (code === '200') {
      setController(data?.flag ?? controller);
    } else {
      message.error(msg);
    }
    setControllerLoading(false);
  };
  const changeControllerFn = async (checked: boolean) => {
    setControllerLoading(true);
    const {
      data: { message: msg, code, data },
    } = await masterControlSwitch({ ...urlParams, flag: checked });
    if (code === '200') {
      message.success(data);
      controllerFn();
    } else {
      message.error(msg);
    }
  };

  const controllerChange = (checked: boolean) => {
    changeControllerFn(checked);
  };

  const [isRead, setIsRead] = useState<'0' | '1'>(isReadDefault);
  const [isType, setIsType] = useState<string | null>(isTypeDefault);
  const [page, setPage] = useState<number>(pageDefault);
  const [pageSize, setPageSize] = useState<number>(pageSizeDefault);
  const [total, setTotal] = useState<number>(totalDefault);

  const resetDefault = async () => {
    setIsType(() => isTypeDefault);
    setPage(() => pageDefault);
    setPageSize(() => pageSizeDefault);
    setTotal(() => totalDefault);
    return {
      page: pageDefault,
      pageSize: pageSizeDefault,
      isType: isTypeDefault,
    };
  };
  const [listLoading, setListLoading] = useState<boolean>(false);

  const [list, setList] = useState<Record<string, any>[]>([]);
  const getListFn = async (params: Record<string, any> = {}) => {
    setListLoading(true);
    let _params = {
      ...urlParams,
      questionType: isType ?? '',
      read: isRead,
      pageNo: page,
      pageSize: pageSize,
    };
    Object.assign(_params, params);
    const {
      data: { data, message: msg, code },
    } = await getListChat(_params);
    setListLoading(false);
    if (code === '200') {
      setList(data?.results ?? []);
      setTotal(data?.total ?? total);
      setPage(_params?.pageNo ?? page);
      setPageSize(_params?.pageSize ?? pageSize);
    } else {
      message.error(msg);
    }
  };

  useEffect(() => {
    controllerFn();
    getListFn({ pageNo: page, pageSize });
  }, []);

  const isReadChange = async (value: '0' | '1') => {
    const { page, pageSize, isType } = await resetDefault();
    setIsRead(value);
    getListFn({ pageNo: page, pageSize, read: value, questionType: isType });
  };

  const isTypeChange = (value: string) => {
    setIsType(value);
    getListFn({ pageNo: page, pageSize, questionType: value });
  };

  const paginationChange = (page: number, pageSize: number) => {
    getListFn({ pageNo: page, pageSize });
  };

  const recordEnter = async (id: string) => {
    if (!id) return;
    const {
      data: { message: msg, code },
    } = await enterDialogue(id);
    if (code === '200') {
      isReadChange('1');
    } else {
      message.error(msg);
    }
  };
  const itemCallBackFn = (type: 'btn', data: any) => {
    if (type === 'btn') {
      window.parent.postMessage(
        {
          // cmd：需要执行的操作
          cmd: 'openChatWindow',
          // data：操作需要的参数
          data: {
            // 开放平台获取的企微号 id
            personalId: data?.personalId,
            // 开放平台获取的 targetId
            targetId: data?.targetId,
            // targetTye 1：私聊，2：群聊
            targetType: data?.targetType,
          },
        },
        '*',
      );
      recordEnter(data?.id);
    }
  };

  return (
    <ConfigProvider locale={zhCN} componentSize="small">
      <div className={styles.container}>
        <Form labelCol={{ span: 4 }}>
          <Form.Item label="总控开关">
            <Switch
              loading={controllerLoading}
              value={!controller}
              onChange={controllerChange}
            ></Switch>
            <span className="controller-tips">
              开启后所有的好友和群聊的自动回复将开启
            </span>
          </Form.Item>
          <Form.Item>
            <Segmented
              block
              options={[
                { label: '待介入会话', value: '0' },
                { label: '历史会话', value: '1' },
              ]}
              value={isRead}
              onChange={isReadChange}
            />
          </Form.Item>
          <Form.Item label="筛选消息类型">
            <Select
              style={{ width: 290 }}
              onChange={isTypeChange}
              options={Object.entries(Options).map(([key, value]) => ({
                label: value,
                value: key,
              }))}
              value={isType}
              placeholder="选择转人工类型"
              allowClear
            />
          </Form.Item>
        </Form>
        <div className="content">
          <Spin spinning={listLoading}>
            {list.length > 0 ? (
              <>
                {list.map((item) => (
                  <RenderItem
                    key={item?.id}
                    content={item}
                    cb={itemCallBackFn}
                  />
                ))}
                <Pagination
                  showQuickJumper
                  showSizeChanger
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={paginationChange}
                  pageSizeOptions={[5, 10, 20]}
                  align="center"
                />
              </>
            ) : (
              <Empty description="暂无数据" />
            )}
          </Spin>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ReplyPage;
