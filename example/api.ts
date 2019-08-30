import { TUser } from "./types";

function request<T>(...args: any[]): Promise<T> {
  return new Promise(r => {
    setTimeout(r, 2000);
  });
}

export function loadUserInfo(name: string, id: number) {
  return request<TUser>({
    url: "/info",
    name,
    id
  });
}
