import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import { Navbar }  from "@/src/components/Navbar";

describe("make sure the links are there", () => {
    render(<Navbar/>)

    test("all the tab texts are rendered", () => {
        expect(screen.getByText(/Home/i)).toBeInTheDocument()
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/About/i)).toBeInTheDocument();
        expect(screen.getByText(/Help/i)).toBeInTheDocument();
    })
})