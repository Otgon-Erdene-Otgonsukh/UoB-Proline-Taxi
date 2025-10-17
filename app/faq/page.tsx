"use client"; // Needed for useState.

import DdInfoBox from "@/component/Dropdown_info_box";
import { useState } from "react"; // For updates to UI when items are changed/clicked.

export default function FAQPage() {
    // State do decide which item / question is open by its index (key), by default null as all closed.
    const [open, setOpen] = useState<number | null>(null);

    // FAQs as list of dictionaries, consisting of:
    // (q) Question: Shows on list of cards.
    // (a) Answer: Shows once card dropdown has been clicked.
    // (open) State: Whether that item is open or not.
    const faqs = [
        { q: "What fleet options are there?", a: "Proline taxi offers 5 fleet options ranging from luxurious to eco friendly." },
        { q: "How can I book a taxi?", a: "You can book via our app or website." },
        { q: "How do I sign up?", a: "Your head of school/faculty/team administrator will need to invite you in order to create an account." },
        { q: "How do bookings get approved?", a: "When you submit your planned route/time/date, it will be sent to your team's/faculty's approval member(s), where they can either approve or deny your taxi booking." },
    ];

    return (
        <main className="flex flex-col md:flex-row min-h-screen">
            {/* Left hand side of page on md screen, FAQs. */}
            <div className="md:w-1/2 flex flex-col max-w-3xl mb-auto mx-auto mt-10 md:mt-50 p-6">
                <h1 className="text-3xl font-bold mb-8 text-center text-shadow-lg">Frequently Asked Questions</h1>
                <div className="w-full">
                    {faqs.map((faq, i) => (
                        // Creating a list of dropdown/item boxes, onClick (inside DdInfoBox element) is bound to setOpen to update the state of the dropdwons.
                        <DdInfoBox key={i} title={faq.q} description={faq.a} open={open === i} click={() => setOpen(open === i ? null : i)}></DdInfoBox>
                    ))}
                </div>
            </div>

            {/* Right hand side of page on md screen, contact info. */}
            <div className="md:w-1/2 flex items-center justify-center md:border-l border-black my-auto py-40">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-8 text-center text-shadow-lg">Contact Proline Taxi</h1>
                    <h2 className="text-2xl font-bold"><a href="tel:+447904459504">+44 7904 459 504</a></h2>
                    <p className="text-xl">Mon - Sat: 09:00 - 20:00</p>
                    <h2 className="text-2xl font-bold pt-8"><a href="sales@prolinetaxi.com">sales@prolinetaxi.com</a></h2>
                </div>
            </div>
        </main>
    );
}