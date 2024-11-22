import { ERROR_IMG } from '@/constants';
import { getDetail } from '@/services/index';
import { FileExclamationTwoTone, RollbackOutlined } from '@ant-design/icons';
import { Card, Empty, Image, message, Space } from 'antd';
import dayjs from 'dayjs';
import React, { Fragment, useEffect, useState } from 'react';
import styles from './index.less';

const TimeFormate = 'YYYY/MM/DD HH:mm:ss';

interface IProps {
  code: string;
  id: string;
  close: () => void;
}

const Detail: React.FC<IProps> = (props) => {
  const { code, id, close } = props;
  const [list, setList] = useState<any[]>([]);
  const getDetailFn = async () => {
    const {
      data: { data = [], message: msg, code: status },
    } = await getDetail({ data: code, createDate: id });
    if (status === '200') {
      setList(data);
    } else {
      message.error(msg);
    }
  };

  useEffect(() => {
    getDetailFn();
  }, [id]);

  const getNickName = (item: any, logs: any): string => {
    /// 访客/坐席/系统
    if (logs?.side === '访客') {
      return item?.visitorName ?? '访客';
    } else if (logs?.side === '坐席') {
      return logs?.agentNickname ?? '坐席';
    } else {
      return '系统';
    }
  };

  const getFormateTime = (logs: any): string => {
    if (logs?.timestamp) {
      return dayjs(logs?.timestamp).format(TimeFormate);
    } else {
      return '';
    }
  };

  const getChats = (logs: any) => {
    //1 文本（包括富文本），2 图片，3 音频，4 视频， 7 附件，8 图文
    let body: any = {};

    try {
      body = JSON.parse(logs?.body);
    } catch (error) {}

    switch (body?.type) {
      case 1:
        return <span dangerouslySetInnerHTML={{ __html: body?.msg }}></span>;
      case 2:
        return (
          <Image preview={false} src={body?.remoteurl} fallback={ERROR_IMG} />
        );
      case 3:
        return (
          <audio controls>
            <source src={body?.remoteurl} />
          </audio>
        );
      case 4:
        return <video controls src={body?.remoteurl} />;
      case 7:
        return (
          <Card>
            <FileExclamationTwoTone />
            <a
              style={{ marginLeft: '5px' }}
              href={body?.remoteurl ?? '#'}
              target="_blank"
              rel="noreferrer"
            >
              {body?.filename}
            </a>
          </Card>
        );
      case 8:
        return (
          <>
            <div>
              <span dangerouslySetInnerHTML={{ __html: body?.msg }}></span>
            </div>
            <Image preview={false} src={body?.remoteurl} fallback={ERROR_IMG} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.details}>
      <div className="detail-header">
        <div className="h-left" onClick={close}>
          <RollbackOutlined />
          <span style={{ marginLeft: '8px' }}>返回</span>
        </div>
        <div className="h-title">会话</div>
      </div>
      <div className="detail-wrap">
        <Space direction="vertical" style={{ display: 'flex' }}>
          {list.length > 0 ? (
            <>
              {list.map((item: any, index: number) => {
                let arr = [];
                try {
                  arr = JSON.parse(item?.chatLogs) || [];
                } catch (error) {}
                if (arr?.length === 0) {
                  return null;
                }
                return (
                  <Fragment key={index}>
                    {arr.map((logs: any, inx: number) => {
                      return (
                        <div className={styles['session']} key={inx}>
                          <div className={styles['session-head']}>
                            <div className="sh-name">
                              {getNickName(item, logs)}
                            </div>
                            <div className="sh-name">
                              {getFormateTime(logs)}
                            </div>
                          </div>
                          <div>
                            <span className={styles['session-content']}>
                              {getChats(logs)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </Fragment>
                );
              })}
            </>
          ) : (
            <Empty description="暂无数据" />
          )}
        </Space>
      </div>
    </div>
  );
};

export default Detail;
