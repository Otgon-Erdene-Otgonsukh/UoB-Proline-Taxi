# Task based usability testing report

## Introduction
This report aims to provide guidance on areas of improvement for the UoB Sustainable Transport project, following data collected in a task based usability study. In this study, four participants were asked to complete a range of tasks, vocalising their thought processes, which alongside the screen were captured for analysis. The report will showcase a breakdown of key usability issues discovered and recommend actions on how to improve the user experience.

## Study method
The study was designed for the primary users of our platform: university department finance staff. However, despite extensive communication, I was unable to recruit any finance staff to complete the study. Consequently, I recruited other university staff with experience in similar systems; unfortunately, these participants were unfamiliar with the current booking procedure agreed upon by Proline Taxi and the University.

Every user completed five tasks, and each task was categorised into four groups: Log-in/Log-out, Booking Creation, Booking Approval/Rejection, and Miscellaneous tasks.

The Booking Creation tasks varied between users; some were asked to complete airport transfers, while others performed less complicated bookings. Similarly, the Booking approval/rejection tasks varied between users, with some users being given different sets of information used to locate a booking. An additional miscellaneous task was added to test functions of the system outside of the primary functionality; this included tasks such as asking the user to change their profile's phone number. The task list can be found in the project repository [here](task_sheet.md). 

When taking part in the study, the users were prompted to use the think-aloud protocol, narrating their thoughts while their voices were captured for future analysis. This provided qualitative data and highlighted the points at which the application didn’t align with the user's expectations, causing friction.

From the screen captures of each participant's session, quantitative data was extracted in the form of task completion rates and the time taken per task. Task completion was divided into three categories: success, success with assistance, and failure. This categorisation will aid in identifying workflows within the application that need further consideration. Additionally, the time taken per task will allow for comparisons between task categories, facilitating further optimization of user flows for the tasks taking the longest time.

When conducting the study, strong ethical standards were followed. This included providing all participants with an information sheet outlining the study’s requirements. Once read and understood, participants were given time to ask questions or express any concerns they might have regarding their participation in the study. Participants were then asked to sign a consent form confirming their willingness to participate and informing them of their right to withdraw from the study at any time. all participant’s data is anonymised with no record of participants personal details being stored alongside the data collected. Participants may however be recognised by voice; this risk was clearly outlined in the documentation which all participants agreed to. These procedures ensured that the study followed university ethical frameworks and data protection standards.
 
## Qualitative findings
When analysing the videos, quotes and sentiment were documented and compiled, this document can be found [here](video_analysis.md). Analysis of participant recordings revealed an overall positive reception however most users experienced friction in completing tasks. 

When completing the Log-in/Log-out tasks no users experienced any friction, with one user commenting “The login screen was very straight forward”. All users completed the task without hesitation, when switching accounts the log-out button was located promptly, with users finding it in the first checked location.

During the booking creation task most users completed this task without assistance, however some design choices resulted in significant friction for some users. Multiple users expressed visible and vocal confusion as they couldn’t find their pickup location in the common pickup location box, with multiple users attempting to type in it. A user also mistook the greyed out “Bristol Airport” suggestive text to be already filled in as this was their pickup location. Another area of friction was the address boxes, whilst all users were able to find their location, multiple users expressed dissatisfaction and suggested a list of suggested locations be given dynamically whilst filling out the field. With one user saying, “When you start typing in location names and not having things come up”. Another user expressed interest in reformatting the address boxes suggesting it take a form similar to an “online shopping system of having everything in different blocks” for clarity of correctness. When completing this task one user experienced an error regarding form submission, the form’s additional information box highlighted despite it not being the cause for the error. This caused the user to wrongfully believe that their written contents of the field were causing the error despite it being an internal bug. This bug has since been fixed. Finally, one user failed to identify the need to deselect the “I’m the lead passenger” toggle instead putting the passenger’s information in the additional information text field.

When completing the booking approval/rejection task, every participant expressed confusion regarding where to find bookings for approval. This was highlighted the by feedback, “I didn't feel I was aware of how the platform was set up”, and the observation that “it was unclear the need to go to the dashboard to approve/reject bookings”. As a result, most users required assistance to navigate to the dashboard page. Search functionality served as an area of friction, a user failed to click the search button after entering a date, leading to confusion when the table did not update. This individual also found the "clear selection" icon misleading, as the red cross gave the false impression that the filter had worked. Another individual who independently navigated to the dashboard was initially met with a list of bookings without attached prices, leading them to comment, “I don't know how to approve it”. Despite this, once the dashboard was correctly accessed, all participants were able to locate and action bookings successfully. The feedback regarding the interface was constructive as one user appreciated the clean layout, mentioning they liked “viewing the booking and there not being any buttons at the bottom”, they also provided a valuable suggestion to include a “text box allowing the finance staff to attach a reason for the rejection”.

All users successfully completed their miscellaneous task with one user being “very happy with the profile side of the system”. Interestingly, a participant completed the “Find the email and phone number of Proline taxi” in an alternative method than intended by navigating to prolines website using the proline logo in the navigation bar.

The users also provided additional comments about the application, one of which was the suggestion of using university “house styles” to format the data in a familiar way for the users. Some users were excited by notifications received upon specific actions. Another user questioned how they would be notified of bookings awaiting action from the finance staff landing page. Finally, a user suggested inbuilt university guidance defining which and how university staff could use the platform.
 
## Quantitative findings 
The usability of the platform was quantified using two primary metrics, task success rate and mean time on task. These metrics provide an insight into the efficiency and intuitiveness of the platform. Tasks were timed from the end of comprehension up to the point of task completion. Whilst this data was collected, as the study only has a sample of four participants the data is highly susceptible to outliers. The raw data can be found at the bottom of this document [here](video_analysis.md#time-per-Task).

The task which on average took the longest time was the booking creation, this is however very heavily affected by participant two taking 4 minutes and 45 seconds to complete this task due to the technical error experienced when submitting the form. More concerningly, the booking approval/rejection task had an average completion time of 2 minutes and 55 seconds, 4 seconds faster than the slowest task. This time is higher than expected for this task as the time encapsulates all users’ confusion on the differentiation of the dashboard to the home page. Positively both the log-in/log-out and miscellaneous tasks were all completed with an average time of under 30 seconds. Another metric to consider is the success rate, 75% of tasks were completed independently, with the overall success rate being 100% when assistance was given.

## Recommendations for continued development
The following are recommendations given the analysis of user feedback, the recommendations given are not conclusive and further considerations would need to be made as to how to implement them into the project. 

All users experienced no friction when logging in or switching accounts, additionally users didn’t face any issues when completing the miscellaneous tasks given to them. Therefore, there will be no recommendations as to these tasks directly.  

Many users experienced some friction with the booking page; this friction could be lowered by:
* Implementing auto complete on the address fields.
* Separating the address field to multiple sections (like online booking platforms).
* Removing the common pickup location dropdown or allowing for a user to type directly into it as if it were a text field, therefore removing the need for the “manually enter” toggle.
* Improve failed form submission errors, especially the false highlighting of the final field in the form on unrelated errors.
* When the “I am the lead passenger” toggle is selected, the passenger details should remain visible however be greyed out preventing a user from booking a taxi under the wrong name.
* Before submission, give a booking summary to the user allowing them to catch unwanted errors.
* The labels at the top of the home page for normal users should be interactable or present in a way as to not confuse the user into thinking they are buttons.

Lots of users experienced friction when completing the Booking approval/rejection task, some recommendations would be:
* The landing page of the finance staff accounts should be the dashboard page to prevent unnecessary confusion and to prioritise finance staffs’ most likely action.
* Strong consideration should be taken as to whether finance staff accounts need the ability to book taxis. Removing this feature would remove confusion as to the differences between the home and dashboard page.
* To extend of the last recommendation a “switch account” or multiple account management system could allow finance staff to switch accounts to book taxis faster.
* The search filters could dynamically apply allowing users to identify mistakes in their search queries as they make them.
* Refinement of the date “clear field” button to be less visually striking.
* Finance staff should be given a text field upon rejecting a booking allowing the system to relay the reason for booking rejection, reducing manual communication.
* Collaboration with the university could be investigated to provide inbuilt information on university staff guidance for taxi requests. 

Great consideration should be made to align the application with the university's “house styles” where possible. These changes however should not negatively impact usability of the software, such as making information slower to comprehend, so are to be applied where appropriate.

Implementing these changes will greatly improve the usability of the platform for all stakeholders. Normal users would benefit from the increased clarity when making bookings, making them less likely to make mistakes when creating a booking. For all finance staff, and particularly finance staff who are new to the platform, these changes would reduce off platform communication and increase booking accuracy. The super admin will also benefit from increased booking accuracy as they would be responsible for identifying and correcting errors in created bookings.

## Conclusion
The task based usability study proved to be very effective at exposing areas of improvement for our project. Additionally, it confirmed that the platform can progress to small scale test deployment, with all suggested changes being refinements to the user experience as opposed to critical errors with platform functionality. Whilst no tasks were failed by users, it would be important to use the findings of this study to create platform onboarding documentation to promote the smooth adoption of the platform. Based on participant feedback, all participants indicated that the platform would be a viable tool. The proposed refinements will cement this statement and reduce the learning curve for new users of the system. Furthermore, the continued assessment of usability will enable the fast and continued adoption of the platform as staff share their positive experiences with it.

## Review of the study
The study was a broad success, highlighting pitfalls in usability, however some key alterations could be made to improve the relevance and quality of the findings. 

The study utilised proxy users, whilst the users who participated were all university staff, none of them were responsible for taxi booking administration. This could have a noticeable effect on the outcome of the study as they would have a better understanding of the differentiation between the booking creation and administration workflows.  

Similarly, due to time constraints only four participants were able to complete the study. Whilst valuable feedback was collected in the qualitative findings the quantitative conclusions lacked academic relevance. Increasing the sample size would allow further statistical analysis of the time and success rate of the user group.

Alongside more participants, the study could be improved by a wider range of tasks covering all workflows within the application. To extend this idea, randomised scenario generation could be implemented using Large Language Models to eliminate the need for manual task creation for a large study sample size.

Whilst all staff were given the option to use a mouse, an improvement to the method of the study could be if participants could use their work computer when participating. This would allow the participant to be familiar with their peripherals, resulting in an increase in real-world accuracy in time per task measurements.

In an ideal scenario, it would be more appropriate to compensate participants for their time and feedback. This would have increased the participants commitment to the project and study. Unfortunately, this wasn’t an option as the project is unfunded.

Throughout conducting the study, I made subtle but substantial changes to how I led the sessions, I became clearer when I explained the tasks vocally and gave better clarifications to tasks without unintentionally providing hints to the users.

As well as the form error mentioned earlier, when logging-in with the normal user account details provided, a google chrome alert triggered regarding the password being involved in a data breach. This distracted users from the tasks and interrupted the user experience and therefore test accounts should have passwords which aren’t going to cause this to happen.

Reviewing all the videos took a lot of time, the review methods should be improved if the study were to be repeated with a larger sample size. Research should be conducted with the assistance of tools which would aid this process. The sessions should be adapted for these tools if necessary.