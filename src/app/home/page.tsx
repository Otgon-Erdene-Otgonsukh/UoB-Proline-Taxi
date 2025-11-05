'use client';

import { useRouter } from "next/navigation";

type Location = {
  name: string;
  longitude: string;
  latitude: string;
}

type BookingStatus = 'Approved' | 'Rejected' | 'Pending'

type BookingRecord = {
  id: number;
  timeCreated: string;
  from: Location;
  to: Location;
  bookingStatus: BookingStatus;
}

const page = () => {

  const router = useRouter();

  const handleClick = () => {
    router.push("/book")
  }

  const data: BookingRecord[] = [{
    id: 1,
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
    id: 2,
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
    id: 3,
    timeCreated: '2025-10-18 21:39:23',
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
    <div className="flex min-h-screen justify-center items-center font-inter p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-6xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-aleo text-2xl sm:text-3xl font-semibold text-shadow-lg/20">
            MY BOOKINGS
          </h1>
          <button 
            onClick={handleClick} 
            className="bg-[#2c2c2c] text-white py-2 px-6 rounded-md hover:bg-[#474747] hover:scale-101 transition-all duration-200 text-sm font-light"
          >
            + New Booking
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-2 border-gray-900 px-4 py-3 text-center text-md font-bold text-gray-900">Time Created</th>
                <th className="border-2 border-gray-900 px-4 py-3 text-center text-md font-bold text-gray-900">From</th>
                <th className="border-2 border-gray-900 px-4 py-3 text-center text-md font-bold text-gray-900">To</th>
                <th className="border-2 border-gray-900 px-4 py-3 text-center text-md font-bold text-gray-900">Booking Status</th>
                <th className="border-2 border-gray-900 px-4 py-3 text-center text-md font-bold text-gray-900">Operation</th>
              </tr>
            </thead>
            <tbody>
              {data.map((e, index) => {
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors text-center">
                    <td className="border-2 border-gray-900 px-4 py-3 text-sm">{e.timeCreated}</td>
                    <td className="border-2 border-gray-900 px-4 py-3 text-sm">{e.from.name}</td>
                    <td className="border-2 border-gray-900 px-4 py-3 text-sm">{e.to.name}</td>
                    <td className="border-2 border-gray-900 px-4 py-3 text-sm text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        e.bookingStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                        e.bookingStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {e.bookingStatus}
                      </span>
                    </td>
                    <td className="border-2 border-gray-900 px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button className="bg-[#2c2c2c] text-white py-1.5 px-4 rounded-md hover:bg-[#414040] hover:scale-101 transition-all duration-200 text-sm font-light">
                          View
                        </button>
                        <button className="bg-white border-2 border-[#2c2c2c] text-[#2c2c2c] py-1.5 px-4 rounded-md hover:bg-gray-50 hover:scale-101 transition-all duration-200 text-sm font-light">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default page