import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import Land from "@/src/components/Landing_page"

describe("Landing page", () => {

    beforeEach(() => {
        render(<Land/>)
    })
    
    test("should have image", () => {
        const image = screen.getByRole("img");
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", "/landpic.svg")
    })

    test("should have text", () => {
        expect(screen.getByRole("heading", {level: 1})).toBeInTheDocument();
    })

    // button tests
    test("should have 2 button", () => {
        const buttons = screen.getAllByRole("button");
        buttons.map(b => {
            expect(b).toBeInTheDocument()
        })
        expect(buttons.length).toEqual(2)
    })

    test("both buttons should navigate to their respective pages", () => {
        const links = screen.getAllByRole("link")
        expect(links[0]).toHaveAttribute("href", "/login")
        expect(links[1]).toHaveAttribute("href", "/about")
    })
})
