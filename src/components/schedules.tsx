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
        return 'milkbread';
    } else if (todaysDow === 4){
        return 'milk'
    } else {
        return 'none'
    }
}