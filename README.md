# TripMaster

TripMaster is a trip planning app which is designed to take the stress out of organising and planning trips all over the world. The app is targeted towards users who like to travel.


The live link can be found here - 


## Table of Contents


  
## User Experience (UX)


### User Stories

- As a Site User I can register an account so that I can



### Design



#### Colour Scheme


#### Imagery


#### Fonts


#### Wireframes



## Agile Methodology

Github projects was used to manage the development process using an agile approach. Please see link to project board 



## Data Model
models



## Testing

Testing and results can be found 

## Security Features

### User Authentication



### Form Validation
If incorrect or empty data 

### Database Security
The database url and secret key are stored in the .env file to 

Cross-Site Request Forgery (CSRF) tokens were used on all forms throughout this site.


## Features

### Header


**Logo**


**Navigation Bar**



### Footer


### Home Page






### User Account Pages

**Sign Up**


**Log In**


**Log Out**

- Django allauth was installed and used to create the Sign up, Log in and Log out functionality. 
- Success messages inform the user if they have logged in/ logged out successfully.
















### CRUD

 

### Page



### Page



### Error Pages

Custom Error Pages were created to give the user more information on the error 

### Future Features


## Deployment - Heroku

To deploy this page to Heroku from its GitHub repository, the following steps were taken:

### Create the Heroku App:

### Attach the Postgres database:






### Update Heroku Config Vars


### Deploy

## Forking this repository


## Cloning this repository
To clone this repository follow the below steps: 


## Languages

- Python
- HTML
- CSS
- Javascript

## Frameworks - Libraries - Programs Used
- [Django](https://www.djangoproject.com/): Main python framework used in the development of this project
- [Django-allauth](https://django-allauth.readthedocs.io/en/latest/installation.html): authentication library used to create the user accounts
- [PostgreSQL](https://www.postgresql.org/) was used as the database for this project.
- [Heroku](https://dashboard.heroku.com/login) - was used as the cloud based platform to deploy the site on.
- [Balsamiq](https://balsamiq.com/) - Used to generate Wireframe images.
- [Chrome Dev Tools](https://developer.chrome.com/docs/devtools/) - Used for overall development 
- [GitHub](https://github.com/) - Used for version control and agile tool.
- [Google Fonts](https://fonts.google.com/) - Used to import and alter fonts on the page.
- [W3C](https://www.w3.org/) - Used for HTML & CSS Validation.
- [PEP8 Online](http://pep8online.com/) - used to validate all the Python code
- [Jshint](https://jshint.com/) - used to validate javascript
- [Grammerly](https://app.grammarly.com/) - used to proof read the README.md
- [Crispy Forms](https://django-crispy-forms.readthedocs.io/en/latest/) used to manage Django Forms


## Credits

- [W3Schools](https://www.w3schools.com/)

- [Pexels](https://www.pexels.com/): All imagery on the site was sourced from Pexels.com

- [Code Institute - Blog Walkthrough Project](https://github.com/Code-Institute-Solutions/Django3blog)
- 

## Acknowledgments

































Views : https://simpleisbetterthancomplex.com/tutorial/2017/02/18/how-to-create-user-sign-up-view.html
Form create trip inspo: https://www.youtube.com/watch?v=X8ECf3Ow3ww&t=1116s
JS progress bar: https://stackoverflow.com/questions/49460091/javascript-progressbar-update-on-the-fly
and https://www.youtube.com/watch?v=CCtgLbL4qE8 
JS Dynamic form: https://medium.com/@AlexanderObregon/beginners-guide-to-creating-dynamic-forms-with-javascript-10aef6a8843d
Date picker: https://stackoverflow.com/questions/47066555/remove-time-after-converting-date-toisostring
https://javascript.plainenglish.io/why-cloning-html-templates-is-a-must-know-trick-425be9ee664b
EVENTUALLY USED: https://www.youtube.com/watch?v=8xb9s3jnRF8&t=499s  wizard

USED:
https://www.pexels.com/search/vacation/?color=fff3cd&orientation=landscape
https://fonts.google.com/selection/embed
https://imageresizer.com/



BUGS= getting 405 error when clicking logout, fixed by changing the url
some users do not have a Profile associated with them- fixed by using django signals to auto make profile when sign up.
couldnt get the country form field to work with google api- reliased i was using the wrong ID