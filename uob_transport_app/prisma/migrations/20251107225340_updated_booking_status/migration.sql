-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "dep_id" INTEGER,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "surname" VARCHAR(100),
    "phone_number" VARCHAR(20),
    "time_created" BIGINT DEFAULT (EXTRACT(epoch FROM now()))::bigint,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "booking" (
    "booking_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "trip_id" INTEGER,
    "booking_status" TEXT DEFAULT 'Pending',
    "time_created" BIGINT DEFAULT (EXTRACT(epoch FROM now()))::bigint,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "department" (
    "dep_id" SERIAL NOT NULL,
    "dep_name" VARCHAR(100) NOT NULL,
    "manager_id" INTEGER,

    CONSTRAINT "department_pkey" PRIMARY KEY ("dep_id")
);

-- CreateTable
CREATE TABLE "departmentusermap" (
    "map_id" SERIAL NOT NULL,
    "dep_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "departmentusermap_pkey" PRIMARY KEY ("map_id")
);

-- CreateTable
CREATE TABLE "trip" (
    "trip_id" SERIAL NOT NULL,
    "icabbi_booking_id" INTEGER,
    "pickup_location" TEXT,
    "pickup_latitude" INTEGER,
    "pickup_longitude" INTEGER,
    "dropoff_location" TEXT,
    "dropoff_latitude" INTEGER,
    "dropoff_longitude" INTEGER,
    "pickup_time" BIGINT,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("trip_id")
);

-- CreateTable
CREATE TABLE "user_address" (
    "user_id" INTEGER NOT NULL,
    "address" TEXT,
    "latitude" INTEGER,
    "longitude" INTEGER,

    CONSTRAINT "user_address_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_booking_user_id" ON "booking"("user_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_dep_id_fkey" FOREIGN KEY ("dep_id") REFERENCES "department"("dep_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("trip_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
