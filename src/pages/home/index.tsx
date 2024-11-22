import { getList } from '@/services/index';
import { getUrlParams } from '@/utils';
import { Card, Empty, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import Detail from './detail';
import styles from './index.less';

const HomePage: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [list, setList] = useState<string[]>([]);
  const _data: any = getUrlParams({ name: 'data' });
  const getListFn = async () => {
    const {
      data: { data = [], message: msg, code },
    } = await getList(_data);
    if (code === '200') {
      setList(data);
    } else {
      message.error(msg);
    }
  };
  useEffect(() => {
    getListFn();
  }, []);
  return (
    <>
      <div>
        <Space
          direction="vertical"
          className={styles.container}
          style={{ display: 'flex' }}
        >
          {list.length > 0 ? (
            <>
              {list.map((item: string) => (
                <Card
                  key={item}
                  onClick={() => {
                    setShowDetail(true);
                    setId(item);
                  }}
                  className={styles['card-wrap']}
                >
                  <p className={styles['card-container']}>{item}</p>
                </Card>
              ))}
            </>
          ) : (
            <Empty description="暂无数据" />
          )}
        </Space>
      </div>

      {showDetail && (
        <Detail
          code={_data}
          id={id}
          close={() => {
            setShowDetail(false);
          }}
        />
      )}
    </>
  );
};

export default HomePage;
