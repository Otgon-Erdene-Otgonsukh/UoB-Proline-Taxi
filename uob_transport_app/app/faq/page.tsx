"use client"; // Needed for useState.

import DdInfoBox from "@/components/Dropdown_info_box";
import Image from "next/image";
import { useState } from "react"; // For updates to UI when items are changed/clicked.

export default function FAQPage() {
  // State do decide which item / question is open by its index (key), by default null as all closed.
  const [open, setOpen] = useState<number | null>(null);

  // FAQs as list of dictionaries, consisting of:
  // (q) Question: Shows on list of cards.
  // (a) Answer: Shows once card dropdown has been clicked.
  // (open) State: Whether that item is open or not.
  const faqs = [
    {
      q: "What fleet options are there?",
      a: "Proline taxi offers 5 fleet options ranging from luxurious to eco friendly.",
    },
    { q: "How can I book a taxi?", a: "You can book via our app or website." },
    {
      q: "How do I sign up?",
      a: "Your head of school/faculty/team administrator will need to invite you in order to create an account.",
    },
    {
      q: "How do bookings get approved?",
      a: "When you submit your planned route/time/date, it will be sent to your team's/faculty's approval member(s), where they can either approve or deny your taxi booking.",
    },
  ];

  return (
    <main className="flex flex-col lg:flex-row min-h-screen">
      {/* Left hand side of page on lg screen, FAQs. */}
      <div className="lg:w-1/2 flex flex-col max-w-3xl mb-auto mx-auto lg:mt-35 py-6 px-20">
        <h1 className="text-3xl font-bold mb-8 text-center text-shadow-lg text-gray-900 font-aleo">
          Frequently Asked Questions
        </h1>
        <div className="w-full lg:pt-10 pt-5">
          {faqs.map((faq, i) => (
            // Creating a list of dropdown/item boxes, onClick (inside DdInfoBox element) is bound to setOpen to update the state of the dropdwons.
            <DdInfoBox
              key={i}
              title={faq.q}
              description={faq.a}
              open={open === i}
              click={() => setOpen(open === i ? null : i)}
            ></DdInfoBox>
          ))}
        </div>
      </div>

      {/* Right hand side of page on lg screen, contact info. */}
      <div className="lg:w-1/2 flex items-center justify-center lg:border-l border-black my-auto lg:py-40 py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold mb-8 text-center text-shadow-lg text-gray-900 font-aleo">
            Contact Proline Taxi
          </h1>
          <div className="mt-5 lg:mt-10 mb-12 flex flex-row gap-8 pl-8">
            <Image src="/map.png" alt="map logo" width="80" height="80" data-testid="logos"></Image>
            <h2 className="text-xl font-medium pt-5">
              17 Kings Head Ln, Bishopsworth, <br /> Bristol BS13 7DB
            </h2>
          </div>

          <div className="mb-12 flex flex-row gap-15">
            <Image src="/Group.png" alt="Logo" width="50" height="50" data-testid="logos"></Image>
            <div>
              <h2 className="text-xl font-bold">
                <a href="tel:+447904459504">+44 7904 459 504</a>
              </h2>
              <p className="text-xl">Mon - Sat: 09:00 - 20:00</p>
            </div>
          </div>

          <div className="flex flex-row gap-15">
            <Image src="/mail.png" alt="mail envelope logo" width="53" height="53" data-testid="logos"></Image>
            <h2 className="text-xl font-medium pt-8 pr-2">
              <a href="mailto:sales@prolinetaxi.com">sales@prolinetaxi.com</a>
            </h2>
          </div>
        </div>
      </div>
    </main>
  );
}
