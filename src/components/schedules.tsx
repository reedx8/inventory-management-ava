// Allow CTC/CCP&Sysco orders/stock counts if tuesday. Used in stores page -> orders due table
export function ctcCCPToday(todaysDow: number){
    // Tuesday = 2
    if (todaysDow === 2){
        return true;
    }
    return false;
}

// // Allow CCP/Sysco orders/stock counts if tuesday. Used in stores page -> orders due table
// export function ccpSyscoToday(todaysDow: number){
//     // Tuesday = 2
//     if (todaysDow === 2){
//         return true;
//     }
//     return false;
// }

// use for Sunday Close sheet (sunday-close-data.tsx)
export function weekCloseToday(todaysDow: number) {
    // sunday = 0
    if (todaysDow === 0) {
        return true;
    }
    return false;
}

// Not used yet
export function milkBreadToday(todaysDow: number) {
    if (todaysDow === 1){
        return 'both';
    } else if (todaysDow === 4){
        return 'milk'
    } else {
        return 'none'
    }
}