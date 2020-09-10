# Basic User Credential System
A secure login/credentials system meant to keep all data away from servers

**NOTE: This project is still in alpha stage, it is highly subject to change, and the security it aims to achieve is not yet fully implemented!**
## What it Does
This system keeps all unencrypted data on the client side, so that the server only deals with encrypted data. This way any attack to the server could not reveal user's data.
This is achieved by encrypting, hashing, and processing all user data on the client side, and then sending that encrypted data back to the server over a secure websocket.

## FAQ
- **How does keeping encryption on the client's end help security?**

    By keeping encryption on the client's end, we can ensure that any data the server processes is safe and unable to be read by any malicious software or man-in-the-middle attacks.
 - **Will this system improve client side safety?**

    Sadly not, any malicious code on the client side will still be able to mess with the data, but if the site gets a cross-site scripting attack there's likely more data, and a bigger problem to worry about.
- **Why do you code in pug insted of html?**

    The choice to code in pug is completely by personal preference, and does nothing in terms of security. I find that pug code is generally easier to read and has additional functionality similar to PHP, but the whole site could be done in html if you so chose.

## To-Do
- Add MongoDB functionality
- Add SQL functionality
- Add config file to chose between different hashing and encryption algorithms, and database types
- Make it look pretty
