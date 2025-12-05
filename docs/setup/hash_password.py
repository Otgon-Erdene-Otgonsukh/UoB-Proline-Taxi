# Use this script on your system to generate a hashed password from your input.
# You can then put this in the database, and use this until we have a register / working password reset.

# CLI Usage: python3 hash_password.py <password>

import bcrypt
import sys

password = sys.argv[1]

print(bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode())