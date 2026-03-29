import "@testing-library/jest-dom";


// ================= mocks =================

// next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));


// next/navigation
const redirectMock = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}));

// request
jest.mock("@/utils/easyRequest", () => ({
  easyGetRequest: jest.fn(),
}));

// map
jest.mock("@/components/ui/map", () => ({
  Map: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map">{children}</div>
  ),
  MapMarker: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  MapRoute: () => <div>route</div>,
  MarkerContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  MarkerLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
