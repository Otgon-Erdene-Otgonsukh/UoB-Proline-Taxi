-- ==============================
-- DATABASE SCHEMA: iCab Booking System
-- ==============================

-- Delete old databases
DROP TABLE IF EXISTS Trip CASCADE;
DROP TABLE IF EXISTS Booking CASCADE;
DROP TABLE IF EXISTS User_Address CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS Department CASCADE;

-- ==============================
-- TABLE: Department
-- ==============================
CREATE TABLE Department (
    dep_id SERIAL PRIMARY KEY,
    dep_name VARCHAR(100) NOT NULL,
    manager_id INT
);

-- ==============================
-- TABLE: User
-- ==============================
CREATE TABLE "User" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    dep_id INT REFERENCES Department(dep_id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- hashed + salted
    name VARCHAR(100),
    surname VARCHAR(100),
    phone_number VARCHAR(20),
    time_created BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- ==============================
-- TABLE: DepartmentUserMap
-- ==============================
CREATE TABLE DepartmentUserMap (
  map_id SERIAL PRIMARY KEY,
  dep_id INT,
  user_id INT
);

-- ==============================
-- TABLE: User_Address
-- ==============================
CREATE TABLE User_Address (
    user_id INT PRIMARY KEY REFERENCES "User"(user_id) ON DELETE CASCADE,
    address TEXT,
    latitude INT,
    longitude INT
);

-- ==============================
-- TABLE: Trip
-- ==============================
CREATE TABLE Trip (
    trip_id SERIAL PRIMARY KEY,
    icabbi_booking_id INT, -- external booking ID (nullable)
    pickup_location TEXT,
    pickup_latitude INT,
    pickup_longitude INT,
    dropoff_location TEXT,
    dropoff_latitude INT,
    dropoff_longitude INT,
    pickup_time BIGINT
);

-- ==============================
-- TABLE: Booking
-- ==============================
CREATE TABLE Booking (
    booking_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "User"(user_id) ON DELETE CASCADE,
    trip_id INT REFERENCES Trip(trip_id) DEFERRABLE INITIALLY DEFERRED,
    booking_status INT DEFAULT 0 CHECK (booking_status IN (0, 1, 2)), -- e.g. 0=awaiting, 1=approved, 2=rejected
    time_created BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Change the foreign key dependent (Booking references Trip)
ALTER TABLE Booking
ADD CONSTRAINT fk_booking_trip
FOREIGN KEY (trip_id) REFERENCES Trip(trip_id) ON DELETE SET NULL;

-- ==============================
-- Indexes (for performance)
-- ==============================
CREATE INDEX idx_user_dep_id ON "DepartmentUserMap"(dep_id);
CREATE INDEX idx_user_dep_id ON "DepartmentUserMap"(user_id);
CREATE INDEX idx_booking_user_id ON Booking(user_id);

