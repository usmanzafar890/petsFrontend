import api from "../utils/axios-config";

export default api;

export const postApi = async (url: string, data: any) => {
  try {
    const res = await api.post(url, data)
    return res
  } catch (error) {
    throw error
  }
}

export const getApi = async (url: string, params = {}) => {
  try {
    const res = await api.get(url, { params: params })
    return res
  } catch (error) {
    throw error
  }
}

export const putApi = async (url: string, data: any, params?: any) => {
  try {
    const res = await api.put(url, data, params)
    return res
  } catch (error) {
    throw error
  }
}

export const deleteApi = async (url: string) => {
  try {
    const res = await api.delete(url)
    return res
  } catch (error) {
    throw error
  }
}
