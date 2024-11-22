import axios from 'axios';

const base = '/api';

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
