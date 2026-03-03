"use client";

import DdInfoBox from "@/components/Dropdown_info_box";
import { useState } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

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
      <div className="lg:w-1/2 flex flex-col justify-center mx-auto w-full px-20 py-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-shadow-lg text-gray-900 font-aleo">
          Frequently Asked Questions
        </h1>
        <div className="w-full pt-4">
          {faqs.map((faq, i) => (
            <DdInfoBox
              key={i}
              title={faq.q}
              description={faq.a}
              open={open === i}
              click={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>

      <div className="lg:w-1/2 flex items-center justify-center lg:border-l border-black py-6 px-20">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold mb-25 text-center text-shadow-lg text-gray-900 font-aleo">
            Contact Proline Taxi
          </h1>

          <div className="-mt-8 w-full">
            <div className="mt-4 mb-12 flex flex-row gap-8 items-center w-full">
              <div className="flex-shrink-0 flex justify-center" style={{ width: 80 }}>
                <LocationOnIcon
                  data-testid="logos"
                  sx={{ fontSize: 55, color: '#E53E3E' }}
                />
              </div>
              <h2 className="text-xl font-medium text-left">
                17 Kings Head Ln, Bishopsworth, <br /> Bristol BS13 7DB
              </h2>
            </div>

            <div className="mb-12 flex flex-row gap-8 items-center w-full">
              <div className="flex-shrink-0 flex justify-center" style={{ width: 80 }}>
                <PhoneIcon
                  data-testid="logos"
                  sx={{ fontSize: 55, color: '#2AB0A8' }}
                />
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
                <EmailIcon
                  data-testid="logos"
                  sx={{ fontSize: 55, color: '#7C3AED' }}
                />
              </div>
              <h2 className="text-xl font-medium text-left">
                <a href="mailto:sales@prolinetaxi.com">sales@prolinetaxi.com</a>
              </h2>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}