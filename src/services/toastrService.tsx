import { notification } from 'antd';

export function open(title: string, msg: string) {
    notification.open({
        message: title,
        description: msg,
        placement: 'topRight',
    });
};

export function error(msg: string) {
    notification.error({
        message: 'Error',
        description: msg,
        placement: 'topRight',
    });
};

export function success(msg: string) {
    notification.success({
        message: 'Success',
        description: msg,
        placement: 'topRight',
    });
};

export function info(msg: string) {
    notification.info({
        message: 'Info',
        description: msg,
        placement: 'topRight',
    });
};

export function warning(msg: string) {
    notification.warning({
        message: 'Warning',
        description: msg,
        placement: 'topRight',
    });
};
