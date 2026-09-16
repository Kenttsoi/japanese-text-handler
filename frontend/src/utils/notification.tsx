import { notifications } from '@mantine/notifications';
import IconX from '@tabler/icons-react/dist/esm/icons/IconX.mjs';
import IconCheck from '@tabler/icons-react/dist/esm/icons/IconCheck.mjs';
import IconAlertTriangle from '@tabler/icons-react/dist/esm/icons/IconAlertTriangle.mjs';
import i18n from '../i18n';

export const showErrorToast = (message: string, title: string = i18n.t('others.notification.errorTitle'), autoClose: number = 4000) => {
  notifications.show({
    title,
    message,
    color: 'red',
    icon: <IconX size={20} />,
    autoClose: autoClose,
  });
};

export const showSuccessToast = (message: string, title: string = i18n.t('others.notification.successTtile'), autoClose: number = 3000) => {
  notifications.show({
    title,
    message,
    color: 'green',
    icon: <IconCheck size={20} />,
    autoClose: autoClose,
  });
};

export const showWarningToast = (message: string, title: string = i18n.t('others.notification.warningTitle'), autoClose: number = 3500) => {
  notifications.show({
    title,
    message,
    color: 'yellow',
    icon: <IconAlertTriangle size={20} />,
    autoClose: autoClose,
  });
};