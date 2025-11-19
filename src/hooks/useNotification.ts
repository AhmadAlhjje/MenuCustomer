import toast from 'react-hot-toast';
import { useI18n } from './useI18n';

export const useNotification = () => {
  const { t } = useI18n();

  const success = (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#16A34A',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  const error = (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#EF4444',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  const info = (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#3A86FF',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  return { success, error, info };
};
