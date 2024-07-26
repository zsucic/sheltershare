# Project Title
 ShelterShare

## Description
ShelterShare is a Django application designed to connect disaster victims with shelter providers.

The application aims to streamline the process of finding and offering shelter during times of disaster, ensuring that victims can quickly and easily access safe places to stay.

## Features

ShelterShare offers a comprehensive suite of features designed to connect disaster victims with shelter providers. Key features include:

- **User Authentication:** Secure login and logout functionality for users, including shelter providers and victims.
- **Victim Management:** Register new victims, update their information, and manage their profiles.
- **Shelter Provider Management:** Register and update shelter provider information.
- **Request Management:** Submit and track shelter requests from victims, including managing and updating request details.
- **Shelter Offers:** Shelter providers can submit and manage their offers, and victims can view available offers.
- **Questions and Answers:** Handle questions and answers related to victim requests, allowing for better communication and clarity.
- **Request Status:** Update and view the status of requests and offers.
- **Final Discharge:** Manage the final discharge process for completed requests.

**Database Integration:** ShelterShare uses InterSystems IRIS as its database system, providing robust and scalable data management capabilities.

These features are designed to ensure an efficient and effective connection between disaster victims and shelter providers.



## Installation and Setup

Follow these steps to set up ShelterShare locally.

### Prerequisites
## For running in a Docker Container
- Docker
- Docker Compose

## For running as a standalone app
- Python 3.x
- **Django 5.0.7**
- **gunicorn**
- **uvicorn[standard]**
- **channels**
- **Faker**
- **django-iris**
- InterSystems IRIS


### Clone the Repository

Clone the ShelterShare repository:
https://github.com/zsucic/sheltershare.git

cd sheltershare


Build and start the Docker containers:

docker-compose up --build -d

Access the Application
Once the containers are running, access ShelterShare at:

Web Interface: http://localhost/8080
Django Admin Interface: http://localhost/8080/admin/



## URL Patterns and Views

ShelterShare includes various endpoints to manage users, victims, requests, offers, and communications. Below is a summary of the key URL patterns and their corresponding views:

### Authentication
- **Login:** `/login/` - User login view.
- **Logout:** `/logout/` - User logout view.

### User and Victim Management
- **Update User Info:** `/update_user_info/` - Update user information.
- **Update Victim Info:** `/update_victim/` - Update victim information.
- **Register Victim:** `/register_victim/` - Register a new victim.
- **Register Shelter Provider:** `/register_shelter_provider/` - Register a new shelter provider.

### Victim Requests
- **Update Request Discharge:** `/update_request_discharge/` - Update request discharge information.
- **Update Shelter Request:** `/update_request_shelter/` - Update shelter request information.
- **View Victim Request:** `/victim_request/<int:pk>/` - View details of a specific victim request.
- **View Victim Request Questions:** `/get_victim_request_questions/<int:pk>/` - View questions related to a specific victim request.

### Shelter Offers
- **Submit Shelter Offer:** `/submit_offer/` - Submit a shelter offer.
- **Accept Offers:** `/accept_offers/` - Accept shelter offers.

### Communication
- **Submit Question:** `/submit_question/` - Submit a question related to a shelter request.
- **Submit Answers:** `/submit_answers/` - Submit answers to questions.

### Status Management
- **Move Status:** `/move_status/` - Move status of a request or offer.
- **Final Discharge:** `/perform_final_discharge/` - Perform final discharge of a request.

### Miscellaneous
- **Generate Data:** `/generate/` - Generate some data (purpose not clear from name alone).
- **Q&A Count:** `/get_pv_qa_count/` - Get count of Q&A pairs.
- **View Victim Info:** `/victim_info/<int:victim_id>/` - View information of a specific victim.
- **Home Page:** `/` - Home page.

## Templates

ShelterShare uses a variety of HTML templates and associated JavaScript and CSS files to manage user interfaces and interactions. Below is a summary of the key template files used in the application:

### HTML Templates

- **`editDischarge.html`**: Template for editing discharge details.
- **`editStatus.html`**: Template for editing request or offer status.
- **`editUserModal.html`**: Modal for editing user information.
- **`editVictimDetail.html`**: Template for editing victim details.
- **`editVisitExtraInfo.html`**: Template for editing additional visit information.
- **`finalDischarge.html`**: Template for final discharge of a request.
- **`index.html`**: Home page of the application.
- **`login.html`**: Login page for users.
- **`offer.html`**: Template for viewing and managing shelter offers.
- **`qa.html`**: Template for viewing and managing questions and answers.
- **`registerVictim.html`**: Template for registering a new victim.
- **`selectShelterRequests.html`**: Template for selecting shelter requests.
- **`victim_info.html`**: Template for viewing victim information.
- **`viewoffers.html`**: Template for viewing shelter offers.

### JavaScript Files

- **`finaldischarge.js`**: JavaScript for final discharge functionality.
- **`qa.js`**: JavaScript for handling Q&A interactions.
- **`submitoffer.js`**: JavaScript for submitting shelter offers.
- **`updatedischargedata.js`**: JavaScript for updating discharge data.
- **`updateextrainfo.js`**: JavaScript for updating extra visit information.
- **`updateshelterdata.js`**: JavaScript for updating shelter request data.
- **`updatestatus.js`**: JavaScript for updating status information.
- **`updatevictimdata.js`**: JavaScript for updating victim data.
- **`viewShelterOffers.js`**: JavaScript for viewing shelter offers.

### CSS Files

- **`main.css`**: Main stylesheet for the application.

### Description

- **`index.html`**: Serves as the landing page of ShelterShare, providing an overview and access to different parts of the application.
- **`login.html`**: Provides the login form for users to access their accounts.
- **`editUserModal.html`**: A modal dialog for editing user details, typically used within other pages.
- **`registerVictim.html`**: Form for registering new victims, capturing necessary personal and contact details.
- **`offer.html`** and **`viewoffers.html`**: Interfaces for managing and viewing shelter offers respectively.
- **`finalDischarge.html`**: Used for handling the final discharge process of a victim's request.
- **`editVictimDetail.html`** and **`editDischarge.html`**: Templates for editing detailed information of victims and discharge data.
- **`editVisitExtraInfo.html`**: Allows users to input additional information about a visit.
- **`selectShelterRequests.html`**: For selecting and managing shelter requests.
- **`qa.html`**: Handles the questions and answers related to victim requests.

These templates are used in conjunction with the associated JavaScript and CSS files to provide a comprehensive user experience within ShelterShare. For detailed usage and customization, you may refer to the specific file contents and application flow.


## Contact

For further questions, support, or inquiries regarding ShelterShare, please contact:

- **Zeljko:** [zeljko@healthinnova.com](mailto:zeljko@healthinnova.com)
- **Damir:** [damir@healthinnova.com](mailto:damir@healthinnova.com)

