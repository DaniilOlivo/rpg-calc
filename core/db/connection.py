from playhouse.db_url import connect
import os

try:
    connectionString = os.environ["DATABASE_URL"]
except:
    connectionString = "postgresql://postgres:admin@localhost:5432/postgres"

db = connect(connectionString)
