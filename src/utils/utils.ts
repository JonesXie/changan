interface IParams {
  url?: string;
  name?: string;
}

export function getUrlParams(props: IParams): string | Record<string, any> {
  const { url = window.location.href, name } = props;

  const queryParams: Record<string, string> = {};
  const queryString = url.split('?')[1];
  if (!queryString) return queryParams;

  const pairs = queryString.split('&');
  pairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });

  if (name) {
    return queryParams[name];
  }

  return queryParams;
}
