import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewDialog from "@/app/super/userManageComponents/viewDialog";
import type { UserRecord } from "@/model/models";

//const

const baseUser: UserRecord = {
  time_created: "2025-06-01T12:00:00.000Z",
  user_id: 42,
  department: { dep_id: 1, dep_name: "Computer Science" } as UserRecord["department"],
  email: "bob.myers@example.com",
  full_name: "Bob Myers",
  phone_number: "+441234567890",
  role: "normal_user",
  user_status: 1,
};

