"use client"; // Needed for useState.

import DdInfoBox from "@/components/Dropdown_info_box";
import { useState } from "react"; // For updates to UI when items are changed/clicked.

// Colorful inline SVG icons
const MapIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="logos"
  >
    <circle cx="40" cy="34" r="26" fill="#FF6B6B" opacity="0.15" />
    <path
      d="M40 10C29.5 10 21 18.5 21 29C21 42.25 40 62 40 62C40 62 59 42.25 59 29C59 18.5 50.5 10 40 10Z"
      fill="#FF6B6B"
      stroke="#E53E3E"
      strokeWidth="2"
    />
    <circle cx="40" cy="29" r="8" fill="white" />
    <circle cx="40" cy="29" r="5" fill="#E53E3E" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="logos"
  >
    <circle cx="25" cy="25" r="25" fill="#4ECDC4" opacity="0.15" />
    <rect x="17" y="8" width="16" height="28" rx="3" fill="#4ECDC4" stroke="#2AB0A8" strokeWidth="1.5" />
    <rect x="20" y="11" width="10" height="18" rx="1" fill="white" />
    <circle cx="25" cy="32" r="2" fill="white" />
    <path
      d="M15 38 C15 38 17 34 21 33 C23 32.5 25 33 25 33 C25 33 27 32.5 29 33 C33 34 35 38 35 38"
      stroke="#2AB0A8"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    width="53"
    height="53"
    viewBox="0 0 53 53"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="logos"
  >
    <circle cx="26.5" cy="26.5" r="26.5" fill="#A78BFA" opacity="0.15" />
    <rect x="10" y="17" width="33" height="22" rx="3" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.5" />
    <path
      d="M10 20 L26.5 31 L43 20"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="13" y="20" width="27" height="16" rx="1" fill="white" opacity="0.2" />
  </svg>
);

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
    <main className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Left hand side of page on lg screen, FAQs. */}
      <div className="lg:w-1/2 flex flex-col justify-center mx-auto w-full px-20 py-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-shadow-lg text-gray-900 font-aleo">
          Frequently Asked Questions
        </h1>
        <div className="w-full pt-4">
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
      <div className="lg:w-1/2 flex items-center justify-center lg:border-l border-black py-6 px-20">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold mb-4 text-center text-shadow-lg text-gray-900 font-aleo">
            Contact Proline Taxi
          </h1>
          <div className="mt-4 mb-6 flex flex-row gap-8 items-center w-full">
            <div className="flex-shrink-0 flex justify-center" style={{ width: 80 }}>
              <MapIcon />
            </div>
            <h2 className="text-xl font-medium text-left">
              17 Kings Head Ln, Bishopsworth, <br /> Bristol BS13 7DB
            </h2>
          </div>

          <div className="mb-6 flex flex-row gap-8 items-center w-full">
            <div className="flex-shrink-0 flex justify-center" style={{ width: 80 }}>
              <PhoneIcon />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold">
                <a href="tel:+447904459504">+44 7904 459 504</a>
              </h2>
              <p className="text-xl">Mon - Sat: 09:00 - 20:00</p>
            </div>
          </div>

          <div className="flex flex-row gap-8 items-center w-full">
            <div className="flex-shrink-0 flex justify-center" style={{ width: 80 }}>
              <MailIcon />
            </div>
            <h2 className="text-xl font-medium text-left">
              <a href="mailto:sales@prolinetaxi.com">sales@prolinetaxi.com</a>
            </h2>
          </div>
        </div>
      </div>
    </main>
  );
}