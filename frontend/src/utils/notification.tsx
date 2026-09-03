import { notifications } from '@mantine/notifications';
import IconX from '@tabler/icons-react/dist/esm/icons/IconX.mjs';
import IconCheck from '@tabler/icons-react/dist/esm/icons/IconCheck.mjs';
import IconAlertTriangle from '@tabler/icons-react/dist/esm/icons/IconAlertTriangle.mjs';
import i18n from '../i18n';

export const showErrorToast = (message: string, title: string = i18n.t('others.notification.errorTitle')) => {
  notifications.show({
    title,
    message,
    color: 'red',
    icon: <IconX size={28} />,
    autoClose: 4000,
  });
};

export const showSuccessToast = (message: string, title: string = i18n.t('others.notification.errorTitle')) => {
  notifications.show({
    title,
    message,
    color: 'green',
    icon: <IconCheck size={28} />,
    autoClose: 3000,
  });
};

export const showWarningToast = (message: string, title: string = i18n.t('others.notification.warningTitle')) => {
  notifications.show({
    title,
    message,
    color: 'yellow',
    icon: <IconAlertTriangle size={28} />,
    autoClose: 3500,
  });
};