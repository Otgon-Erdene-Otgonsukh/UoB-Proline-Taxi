type Location = {
  name: string;
  longitude: string;
  latitude: string;
}

type BookingStatus = 'Approved' | 'Rejected' | 'Pending'

type BookingRecord = {
  timeCreated: string;
  from: Location;
  to: Location;
  bookingStatus: BookingStatus;
}

const page = () => {

  const data: BookingRecord[] = [{
    timeCreated: '2025-10-18 19:39:23',
    from: {
      name: 'Booking 1 from',
      longitude: '',
      latitude: ''
    },
    to: {
      name: 'Booking 1 to',
      longitude: '',
      latitude: ''
    },
    bookingStatus: 'Approved'
  }, {
    timeCreated: '2025-10-18 19:40:23',
    from: {
      name: 'Booking 2 from',
      longitude: '',
      latitude: ''
    },
    to: {
      name: 'Booking 2 to',
      longitude: '',
      latitude: ''
    },
    bookingStatus: 'Rejected'
  }, {
    timeCreated: '2025-10-18 19:39:23',
    from: {
      name: 'Booking 2 from',
      longitude: '',
      latitude: ''
    },
    to: {
      name: 'Booking 2 to',
      longitude: '',
      latitude: ''
    },
    bookingStatus: 'Pending'
  }]

  return (
    <div>
      <button className="bg-blue-300  text-gray-700 py-1 px-4 rounded-md hover:bg-yellow-500 hover:scale-103 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-extrabold m-1 float-end cursor-pointer">+ New Booking</button>
      <table className="table-auto md:table-fixed w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300">Time Created</th>
            <th className="border border-gray-300">From</th>
            <th className="border border-gray-300">To</th>
            <th className="border border-gray-300">Booking Status</th>
            <th className="border border-gray-300">Operation</th>
          </tr>
        </thead>
        <tbody>
          {data.map(e => {
            return (
              <tr className="table-row border border-gray-300">
                <td className="border border-gray-300 text-center">{e.timeCreated}</td>
                <td className="border border-gray-300 text-center">{e.from.name}</td>
                <td className="border border-gray-300 text-center">{e.to.name}</td>
                <td className="border border-gray-300 text-center">{e.bookingStatus}</td>
                <td className="border border-gray-300 text-center">
                  <button className=" bg-green-300  text-gray-700 py-1 px-4 rounded-md hover:bg-yellow-500 hover:scale-103 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-extrabold cursor-pointer">view</button>
                  <button className=" bg-red-300  text-gray-700 py-1 px-4 rounded-md hover:bg-yellow-500 hover:scale-103 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-extrabold mx-1 cursor-pointer">cancel</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default page