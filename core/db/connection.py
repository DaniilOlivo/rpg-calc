from playhouse.db_url import connect

connectionString = "postgresql://postgres:admin@localhost:5432/postgres"

db = connect(connectionString)
