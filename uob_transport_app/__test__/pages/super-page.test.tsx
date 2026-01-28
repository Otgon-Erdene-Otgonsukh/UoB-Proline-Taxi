import "@testing-library/jest-dom";

// ========== mocks ==========

// next/navigation
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// request layer
jest.mock("@/app/super/request", () => ({
  getUsersAsAdmin: jest.fn(),
  updateUserAsAdmin: jest.fn(),
}));

jest.mock("@/app/super/requests", () => ({
  getDepartmentsList: jest.fn(),
}));

// dialogs (only cares about if opened or not rather than the inner implementation)
jest.mock("@/app/super/userManageComponents/viewDialog", () => {
  return function MockViewDialog({ dialogOpen }: { dialogOpen: boolean }) {
    return dialogOpen ? <div>View Dialog</div> : null;
  };
});

jest.mock("@/app/super/userManageComponents/eidtDialog", () => {
  return function MockEditDialog({ dialogOpen }: { dialogOpen: boolean }) {
    return dialogOpen ? <div>Edit Dialog</div> : null;
  };
});

jest.mock("@/components/confirmDIalog", () => {
  return function MockConfirmDialog({
    open,
    dialogTitle,
  }: {
    open: boolean;
    dialogTitle: string;
  }) {
    return open ? <div>{dialogTitle}</div> : null;
  };
});
