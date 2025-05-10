import clsx from 'clsx';
import styles from './styles.module.scss';

export const Colors = {
    primary: styles.primary,
    secondary: styles.secondary,
    blue: styles.blue,
    green: styles.green,
    success: styles.green,
    red: styles.red,
    danger: styles.red,
    orange: styles.orange,
    warning: styles.orange,
    gray: styles.gray,
    lightBlue: styles.lightBlue,
    info: styles.gray,
    black: styles.black
};
export type Color = keyof typeof Colors;

export const ButtonColors: { [key in Color]: string } = {
    primary: 'button--primary',
    secondary: 'button--secondary',
    blue: 'button--primary',
    green: 'button--success',
    success: 'button--success',
    red: 'button--danger',
    danger: 'button--danger',
    orange: 'button--warning',
    warning: 'button--warning',
    gray: 'button--secondary',
    lightBlue: 'button--info',
    info: 'button--info',
    black: 'button--primary'
};

export const getColorClass = (color: Color | string | undefined, defaultColor?: Color) => {
    return Colors[color as Color] || Colors[defaultColor as Color];
};

export const getButtonColorClass = (color: Color | string | undefined, defaultColor?: Color) => {
    return clsx(
        ButtonColors[color as Color] || ButtonColors[defaultColor as Color],
        color === 'blue' && styles.buttonBlue,
        color === 'black' && styles.buttonBlack
    );
};
