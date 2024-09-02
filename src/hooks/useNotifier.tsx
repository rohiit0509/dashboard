import { notification } from 'antd'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

const useNotification = () => {
  const openNotification = (
    type: NotificationType,
    message: string,
    description: string,
  ) => {
    if (!message) return
    notification[type]({
      message,
      description,
      key: `${type}-${message}`,
      duration: 1.5,
    })
  }

  return {
    openNotification,
  }
}

export default useNotification
