# Shortbreaks codetest - Web Development API

An API to manage a user persistence layer.

The user model has the following attributes:

**id** - *A unique user id*  
**email** - *A users email address*  
**forename** - *A users first name* (3-200 characters, `[a-zA-Z\'- ]`)  
**surname** - *A users last name* (3-200 characters, `[a-zA-Z\'- ]`)  
**created** - *The date and time the user was added*  

The API exposes functionality to create, read, update and delete (CRUD) models, and also includes a request to list users, optionally filtered on properties.

Built with swagger / node / express / mongodb.

## API documentation
Documented (and testable) with swagger at https://swaggerhub.com/apis/david-r-edgar/hx_sb_codetest/0.0.1


## To do

- Allow non-Latin UTF-8 characters in email, forename and surname, to permit other languages
- Check for email uniqueness
