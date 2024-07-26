# Project Title
 ShelterShare

![img_9.png](img_9.png)

## Description
ShelterShare is a Django application designed to connect disaster victims with shelter providers.


## Features

ShelterShare offers features designed to connect disaster victims with shelter providers. Key features include:

- **User Authentication:** Secure login and logout functionality for users, including shelter providers and victims.

![img.png](img.png)

- **Shelter Requests:** Register new shelter requests and check status of requests.

![img_1.png](img_1.png)

- **Shelter Provider Management:** Register and update shelter provider information.

![img_10.png](img_10.png)

- 
- **Request Management:** Submit and track shelter requests from victims, including managing and updating request details.

![img_12.png](img_12.png)


![img_8.png](img_8.png)

- **Questions and Answers:** Handle questions and answers related to victim requests, allowing for better communication and clarity.

![img_5.png](img_5.png)

- **Request Status:** Update and view the status of requests and offers.

![img_13.png](img_13.png)

**Database Integration:** ShelterShare uses InterSystems IRIS as its database system.

![img_7.png](img_7.png)

These features are designed to ensure an efficient and effective connection between disaster victims and shelter providers.

## Online Demo

https://sheltershare.zsucic.com/

## Installation and Setup

Follow these steps to set up ShelterShare locally.


### Clone the Repository

Clone the ShelterShare repository:
https://github.com/zsucic/sheltershare.git

Navigate to sheltershare folder:
`cd sheltershare`

Build and start the Docker containers:
`docker compose up`


Web Interface: http://localhost:8000

Django Admin Interface: http://localhost:8000/admin/



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
- **View Victim Request:** `/victim_request/<int:pk>/` - View details of a specific victim request.

### Miscellaneous
- **Generate Data:** `/generate/` - Generate random victim data (for testing purpose).
- **Home Page:** `/` - Home page.


## Contact
For further questions, support, or inquiries regarding ShelterShare, please contact HealthInnova team:

- **Zeljko:** [zeljko@healthinnova.com](mailto:zeljko@healthinnova.com)
- **Damir:** [damir@healthinnova.com](mailto:damir@healthinnova.com)

