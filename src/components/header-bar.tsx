import SearchBar from './searchbar';

export function HeaderBar({ pageName }: { pageName: string }) {
    function getTodaysDate() {
        const today = new Date();
        // const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthsOfYear = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        // const dayOfWeek = daysOfWeek[today.getDay()];
        const month = monthsOfYear[today.getMonth()];
        const dayNumber = today.getDate();
        const year = today.getFullYear();

        return `${todaysDay()} ${month} ${dayNumber}, ${year}`;
    }

    return (
        <div className='flex justify-between'>
            <div className='flex items-baseline'>
                <h1 className='text-3xl w-32'>{pageName}</h1>
                <div className='text-sm text-neutral-400'>{getTodaysDate()}</div>
            </div>
            <div className='flex gap-5 items-baseline'>
                <SearchBar />
            </div>
        </div>
    );
}

export function todaysDay() {
    const today = new Date();
    const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const dayOfWeek = daysOfWeek[today.getDay()];
    return dayOfWeek;
}
