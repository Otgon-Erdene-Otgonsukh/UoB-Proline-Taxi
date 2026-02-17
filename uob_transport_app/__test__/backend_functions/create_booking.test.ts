import { prismaMock } from "@/utils/singleton";
import createBooking from "@/backend/create_booking/create_booking";

const testData = {
  userID: 3,
  pickupLocation: "Birmingham",
  pickupLatitude: null,
  pickupLongitude: null,
  dropoffLocation: "Heathrow",
  dropoffLatitude: null,
  dropoffLongitude: null,
  pickupTime: new Date("2026-05-10"),
  returnDT: undefined,
  passengerName: "Bob Wilson",
  email: "bob.wilson@example.com",
  tel_number: "+44 7700 900222",
  additional_info: "",
  via: "",
  returnTo: undefined,
  passenger_num: 1,
  airport: "Heathrow Airport",
  flight_num: "VS1234",
  dep_id: 3,
};

const testDataWithReturn = {
  userID: 4,
  pickupLocation: "Birmingham",
  pickupLatitude: 52.4508,
  pickupLongitude: -1.9305,
  dropoffLocation: "Manchester",
  dropoffLatitude: 53.3537,
  dropoffLongitude: -2.275,
  pickupTime: new Date("2026-04-20T08:30:00Z"),
  returnDT: new Date("2026-04-27T14:00:00Z"),
  passengerName: "Jane Smith",
  email: "jane.smith@example.com",
  tel_number: "+44 7700 900111",
  additional_info: "Round trip booking",
  via: "Main Gate",
  returnTo: "University of Birmingham",
  passenger_num: 2,
  airport: "Manchester Airport",
  flight_num: "EZY5678",
  dep_id: 2,
};

test("Create booking function correctly creates a trip and booking entry", async () => {
  prismaMock.trip.create.mockResolvedValue({
    trip_id: 2,
  });
  await createBooking(
    testData.userID,
    testData.pickupLocation,
    testData.pickupLatitude,
    testData.pickupLongitude,
    testData.dropoffLocation,
    testData.dropoffLatitude,
    testData.dropoffLongitude,
    testData.pickupTime,
    testData.returnDT,
    testData.passengerName,
    testData.email,
    testData.tel_number,
    testData.additional_info,
    testData.via,
    testData.returnTo,
    testData.passenger_num,
    testData.airport,
    testData.flight_num,
    testData.dep_id,
  );

  expect(prismaMock.trip.create).toHaveBeenCalledWith({
    data: {
      icabbi_booking_id: null,
      pickup_location: "Birmingham",
      pickup_latitude: null,
      pickup_longitude: null,
      dropoff_location: "Heathrow",
      dropoff_latitude: null,
      dropoff_longitude: null,
      pickup_time: new Date("2026-05-10"),
      return_pickup_time: null,
      via: "",
      passenger_num: 1,
      return_drop_loc: undefined,
      airport: "Heathrow Airport",
      flight_num: "VS1234",
    },
  });
  expect(prismaMock.booking.create).toHaveBeenCalledWith({
    data: {
      user_id: 3,
      trip_id: 2,
      time_created: expect.any(Date),
      booking_status: "Pending",
      passenger_name: "Bob Wilson",
      email: "bob.wilson@example.com",
      tel_number: "+44 7700 900222",
      additional_info: "",
      dep_id: 3,
    },
  });
});

test("Create booking function correctly includes returnDT in trip when defined", async () => {
  prismaMock.trip.create.mockResolvedValue({
    trip_id: 3,
  });
  prismaMock.booking.create.mockResolvedValue({
    booking_id: 1,
    user_id: testDataWithReturn.userID,
    trip_id: 3,
    time_created: new Date(),
    booking_status: "Pending",
    passenger_name: testDataWithReturn.passengerName,
    email: testDataWithReturn.email,
    tel_number: testDataWithReturn.tel_number,
    additional_info: testDataWithReturn.additional_info,
    dep_id: testDataWithReturn.dep_id,
  });

  await createBooking(
    testDataWithReturn.userID,
    testDataWithReturn.pickupLocation,
    testDataWithReturn.pickupLatitude,
    testDataWithReturn.pickupLongitude,
    testDataWithReturn.dropoffLocation,
    testDataWithReturn.dropoffLatitude,
    testDataWithReturn.dropoffLongitude,
    testDataWithReturn.pickupTime,
    testDataWithReturn.returnDT,
    testDataWithReturn.passengerName,
    testDataWithReturn.email,
    testDataWithReturn.tel_number,
    testDataWithReturn.additional_info,
    testDataWithReturn.via,
    testDataWithReturn.returnTo,
    testDataWithReturn.passenger_num,
    testDataWithReturn.airport,
    testDataWithReturn.flight_num,
    testDataWithReturn.dep_id,
  );

  expect(prismaMock.trip.create).toHaveBeenCalledWith({
    data: {
      icabbi_booking_id: null,
      pickup_location: "Birmingham",
      pickup_latitude: 52.4508,
      pickup_longitude: -1.9305,
      dropoff_location: "Manchester",
      dropoff_latitude: 53.3537,
      dropoff_longitude: -2.275,
      pickup_time: new Date("2026-04-20T08:30:00Z"),
      return_pickup_time: new Date("2026-04-27T14:00:00Z"),
      via: "Main Gate",
      passenger_num: 2,
      return_drop_loc: "University of Birmingham",
      airport: "Manchester Airport",
      flight_num: "EZY5678",
    },
  });

  expect(prismaMock.booking.create).toHaveBeenCalledWith({
    data: {
      user_id: 4,
      trip_id: 3,
      time_created: expect.any(Date),
      booking_status: "Pending",
      passenger_name: "Jane Smith",
      email: "jane.smith@example.com",
      tel_number: "+44 7700 900111",
      additional_info: "Round trip booking",
      dep_id: 2,
    },
  });
});
