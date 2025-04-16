import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export function checkValueNumber(value: any) {
    var result = parseFloat(value)
    return (value == null || isNaN(result)) ? 0 : result
}

export function safeDivide(numerator: number, denominator: number) {
    if (!denominator || isNaN(numerator / denominator)) {
        return 0
    }

    return numerator / denominator;
}


