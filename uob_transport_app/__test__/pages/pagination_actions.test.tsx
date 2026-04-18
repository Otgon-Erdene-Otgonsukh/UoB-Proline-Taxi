import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TablePaginationActions } from "@/components/paginationActions";

const renderActions = (page: number, count = 50, rowsPerPage = 10) => {
  const onPageChange = jest.fn();
  const utils = render(
    <TablePaginationActions
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
    />,
  );
  return { ...utils, onPageChange };
};

describe("TablePaginationActions", () => {
  test("first page button jumps to page 0", async () => {
    const { onPageChange } = renderActions(3);
    await userEvent.click(screen.getByLabelText(/first page/i));
    expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 0);
  });

  test("previous page button decrements the page", async () => {
    const { onPageChange } = renderActions(3);
    await userEvent.click(screen.getByLabelText(/previous page/i));
    expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 2);
  });

  test("next page button increments the page", async () => {
    const { onPageChange } = renderActions(1);
    await userEvent.click(screen.getByLabelText(/next page/i));
    expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 2);
  });

  test("last page button jumps to the final page", async () => {
    const { onPageChange } = renderActions(0, 50, 10);
    await userEvent.click(screen.getByLabelText(/last page/i));
    expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 4);
  });

  test("first/previous disabled on page 0; next/last disabled on last page", () => {
    const { unmount } = renderActions(0);
    expect(screen.getByLabelText(/first page/i)).toBeDisabled();
    expect(screen.getByLabelText(/previous page/i)).toBeDisabled();
    unmount();

    renderActions(4, 50, 10);
    expect(screen.getByLabelText(/next page/i)).toBeDisabled();
    expect(screen.getByLabelText(/last page/i)).toBeDisabled();
  });
});
