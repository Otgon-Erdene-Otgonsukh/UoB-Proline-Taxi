## Introduction
Proline taxi focuses on luxury taxi transport for airport transfers, private medical appointments, university staff, and C-suite personnel.

## The current system
The booking process for university staff needs modernisation with a scalable solution.
Currently to get a taxi, you need to go through a process of getting in contact with a supervisor, going back and forth between documents, different platforms and emails, get relevant codes, authorisation, flight numbers, and a lot of time is wasted before even creating a booking request to send to Proline. It takes time from wanting a taxi to getting it approved and booked.

Solutions such as icabbi exist, except solutions like this would mean users of the platform would need training, and have access to items or features in that platform that are not applicable to their use case.

## The new system
The platform needs to be secure, designed with the idea of eventually being run within the University Intranet. The user logs into the platform (provided by the manager). Various checkpoints / auto-fill suggestions will be tailored to include university buildings and airports. An automated process needs to request this ride to the manager, and if it's approved, get a purchase order number generated, sent to Proline via the icabbi (or similar) API, and exportable receipts to send to financing or management at UoB. Live tracking can be done through the driver's phone and update the user on how far away their taxi is, and we would also like a way to present this to the user of the platform when managing or viewing their booking, possibly via email or SMS.

We should aim to make the UI as intuitive as possible.

For more optimisation, purchase orders can start being created before it's approved, it does not have to be displayed, but the process to generate different projects or posting data to the database right when someone requests the ride, removing it if it gets rejected.
 
The system, if the destination or pickup is an airport, will ask for a flight number and extract data automatically. An extra info field where the user can ask for other information will also be present.
 
## Key Objectives
Demonstrate the ability to work in a team and our skills, with a project outlined from high level business requirements and translating them into an end product.

Building a cloud based system for the university to automate the taxi booking process from ~30 minutes to ~4 minutes for instance. Perhaps the project could be leased or sold to other companies or universities. In business terms: Better, faster, and cheaper.

Environmentally friendly, such as joining rides together. Insights into reduced CO2 emissions, cost savings, or time savings.
User-friendly interface, make sure the experience is simple and does not annoy or slow down users compared to the previous system. This solution needs to work for people who do not have the same skills as us - we need to make the whole system intuitive and think a lot about the UX and create hints of where to go next in the user experience.

## Survey
To be carried out within 2-3 weeks.

Questionnaire to judge the process of booking and see where improvements can be made, with pre-set or open ended answers. Make it clear that the questionnaire is filled out with the intention of improving the experience.

A simple 10 question (ish) survey to ask staff and heads of department to understand what their needs are, and the current difficulties with the system, would be suitable.
 
## Smaller development points and hints
The phone number on the system should be for the passenger, perhaps an option that shows "Are booking on behalf of someone else?".

Show the user how to use the platform, so that the first time they use the platform, they get to see how to use the platform.

The purchase order number is required in the form. The invoices for one day could be consolidated into one purchase order number. It is up to us to come up with the optimal solution. Ask this to the department heads in the survey.

Field validation, as good practice with any website, but as much validation and sanitization as possible, such as the pre-selected country prefix.

Two flows could be used, a user could be pre-approved and the head of department still sees it but does not have to approve it. Another flow is that the head of department must approve. Pre-approval would require another field in our database such as a "permission level" integer.

Take a look at icabbi for ideas on how forms should look, and how they behave such as when selecting an airport as a destination or pick up point.

In forms, Name, Time, Date, Pick up, Drop off, Flight Number*, Telephone, Email, Post Order are all mandatory, and Additional Information and Via destinations are not mandatory. They can also book on behalf of someone else. Take a look at multiple booking forms.
 
## Project Timeline and Plan
When sharing updates with the client, it's important to communicate and be transparent. Make sure to update the client unprompted and show the work in progress such as screenshots, and ask any questions that we have. Make sure to ask these questions early on.
