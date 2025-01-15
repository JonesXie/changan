import axios from 'axios';

const base = '/api';

const headers = {
  'Content-Type': 'application/json',
};

export const getList = (data: string) =>
  axios(`${base}/getClusterChatMsgsDays`, {
    method: 'POST',
    data: {
      data,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const getDetail = (data: { data: string; createDate: string }) =>
  axios(`${base}/getClusterChatMsgs`, {
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });

//会话列表查询接口
export const getListChat = (data: {
  data: string;
  questionType?: string | null;
  read?: string;
  pageNo?: number;
  pageSize?: number;
}) =>
  axios(`${base}/chat/listChat`, {
    method: 'POST',
    data,
    headers,
  });

//记录进入会话
export const enterDialogue = (id: string) =>
  axios(`${base}/chat/enterDialogue?id=${id}`, {
    method: 'POST',
    headers,
  });

//查询自动回复总空开关查询接口
export const queryMasterControlSwitch = (data: { data: string }) =>
  axios(`${base}/chat/queryMasterControlSwitch`, {
    method: 'POST',
    data,
    headers,
  });

//自动回复总控开关接口
export const masterControlSwitch = (data: { data: string; flag: boolean }) =>
  axios(`${base}/chat/masterControlSwitch`, {
    method: 'POST',
    data,
    headers,
  });

//查询个人自动回复开关查询接口
export const querySingleControlSwitch = (data: { data: string }) =>
  axios(`${base}/chat/querySingleControlSwitch`, {
    method: 'POST',
    data,
    headers,
  });

//单用户自动回复开关接口
export const singleControlSwitch = (data: { data: string; flag: boolean }) =>
  axios(`${base}/chat/singleControlSwitch`, {
    method: 'POST',
    data,
    headers,
  });
