import {
  querySingleControlSwitch,
  singleControlSwitch,
} from '@/services/index';
import { getUrlParams } from '@/utils';
import { Form, Switch, message } from 'antd';
import React, { useEffect, useState } from 'react';

const controllerDefault = false;

const ReplyPage: React.FC = () => {
  const urlParams: any = getUrlParams({});

  const [controller, setController] = useState<boolean>(controllerDefault);
  const [controllerLoading, setControllerLoading] = useState<boolean>(false);
  const controllerFn = async () => {
    setControllerLoading(true);
    const {
      data: { data, message: msg, code },
    } = await querySingleControlSwitch({ ...urlParams });
    if (code === '200') {
      let _controller = data?.flag === false;
      setController(_controller);
    } else {
      message.error(msg);
    }
    setControllerLoading(false);
  };
  const changeControllerFn = async (checked: boolean) => {
    setControllerLoading(true);
    const {
      data: { message: msg, code, data },
    } = await singleControlSwitch({ ...urlParams, flag: !checked });
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

  useEffect(() => {
    controllerFn();
  }, []);

  return (
    <div style={{ fontSize: '16px', boxSizing: 'border-box', padding: '2px' }}>
      <Form>
        <Form.Item label="自动回复">
          <Switch
            loading={controllerLoading}
            value={controller}
            onChange={controllerChange}
          ></Switch>
        </Form.Item>
        <span className="controller-tips">
          开启后，该客户/群聊将会进行自动回复
        </span>
      </Form>
    </div>
  );
};

export default ReplyPage;
