export function HeaderBar({pageName}: {pageName: string}) {
    function getTodaysDate(){
        const today = new Date();
        // const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
        // const dayOfWeek = daysOfWeek[today.getDay()];
        const month = monthsOfYear[today.getMonth()]; 
        const dayNumber = today.getDate();
        const year = today.getFullYear();
    
        return `${todaysDay()} ${month} ${dayNumber}, ${year}`;
      }
    
      return (
        // <span className='text-sm text-gray-500'>{getTodaysDate()}</span>
        // <div className='text-sm text-gray-500'>{getTodaysDate()}</div>
        <div className='flex items-baseline'>
          <div className='w-40'>
            <h1 className='text-3xl'>{pageName}</h1>
          </div>
          <div className='text-sm text-gray-500'>{getTodaysDate()}</div>
        </div>
      )
};

export function todaysDay(){
    const today = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[today.getDay()];
    return dayOfWeek;
  }