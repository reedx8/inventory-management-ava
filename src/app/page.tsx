export default function Home() {

  // get todays day and date
  function todaysDate(){
    const today = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayOfWeek = daysOfWeek[today.getDay()];
    const month = monthsOfYear[today.getMonth()]; 
    const dayNumber = today.getDate();
    const year = today.getFullYear();

    return `${dayOfWeek} ${month} ${dayNumber}, ${year}`;
  }

  return (
    <div className="p-4 m-4">
      <div>
        <p className="text-3xl">Home <span className="text-sm p-6">{todaysDate()}</span></p>
        {/* <p>{todaysDate()}</p> */}
      </div>
    </div>
  );
}
