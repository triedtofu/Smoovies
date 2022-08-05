ServiceInputChecks.java

checkId:

Ids are valid if they are an integer > 0

checkName:

Names are valid as long as they only contain letters

checkEmail:

Emails are valid as long as they contain the '@' character

checkPassword:

Passwords are valid as long as they meet all the following requirements-
  * between 6 and 16 characters long (inclusive)
  * have at least 1 upper case character
  * have at least 1 lower case character
  * have at least 1 number
  
checkMovie:

Not yet implemented

checkUniqueEmail:

Emails are unique if there does not already exist the same email in the database
