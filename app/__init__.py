from flask import Flask

app = Flask(__name__)

# Import routes after creating the app instance
from app import routes
