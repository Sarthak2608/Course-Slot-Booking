# NotchUp-Web-Challenge
## Project Link: https://sheltered-falls-91179.herokuapp.com/

## Problem Statement:
Part 1A) Build a webpage with a form that people can use to book a trial class on notchup.co. The form should be able to capture the following details:
* Parent's Name
* Parent's Contact Number
* Parent's Email ID
* Child's Name
* Child's Age
* Course Name
* Suitable Date for a trial class
* Suitable Time Slot for the trial class

#### Things to note:
There are 6 courses available at NotchUp. Check the website for details. Each trial slot is for 1 hour duration.
Slots are fetched from a GET request (Details below) and each timeslot is in unixtime format.
Earliest slot we can show should be minimum 4 hours from now.
Latest slot should be maximum 7 days from now.
On submitting the form, you may simply clear the form without needing to post that data.
API Contract for fetching available slots
API URL: https://script.google.com/macros/s/AKfycbzJ8Nn2ytbGO8QOkGU1kfU9q50RjDHje4Ysphyesyh-osS76wep/exec
METHOD: GET

Sample Response:
A series of courses with available slots details:

[{"course_id":1,"course_name":"Scratch Junior","slots":[{"slot":"1588422600000","instructor_count":2},{"slot":"1588424400000","instructor_count":2},{"slot":"1588426200000","instructor_count":2},{"slot":"1588480200000","instructor_count":6},{"slot":"1588482000000","instructor_count":2}]},

{"course_id":2,"course_name":"Web Development","slots":[{"slot":"1588422600000","instructor_count":2},{"slot":"1588424400000","instructor_count":2},{"slot":"1588426200000","instructor_count":2},{"slot":"1588480200000","instructor_count":6},{"slot":"1588482000000","instructor_count":2}]}]

 

Part 1B) The data submitted through the form needs to be sent to a server which is responsible for sending out confirmation email to the users.
Set up an API on a node JS server that can take the form submission fields as an input.
On each submission, the server should send out an email on the given parent's email id.
The email should be formatted as follows:

Title: NotchUp Trial Class Booked successfully
Body:

Dear {{ParentName}}

{{StudentName}}'s class at {{SlotTime}} has been successfully booked.
On successful submission of an email, send a success response back to your web app



---
## Tools and Technologies Used: 
* HTML
* CSS
* Bootstrap
* MongoDB
* NodeJS
---

## Screenshots of the output:
![i1](https://user-images.githubusercontent.com/48095368/111901591-2a3b7d00-8a5f-11eb-91c9-e75d71f64046.png)
---
![i2](https://user-images.githubusercontent.com/48095368/111901595-30c9f480-8a5f-11eb-8f0e-d2a25e244bc9.png)
---
![i3](https://user-images.githubusercontent.com/48095368/111901599-36273f00-8a5f-11eb-9eaf-68d2b102c9f8.png)
---
![i4](https://user-images.githubusercontent.com/48095368/111901605-3aebf300-8a5f-11eb-8a96-7ffe7f79e368.png)
---
![i5](https://user-images.githubusercontent.com/48095368/111901608-3fb0a700-8a5f-11eb-98ee-0f0f12f117cc.png)
---
