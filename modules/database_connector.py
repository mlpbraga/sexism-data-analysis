import datetime
import psycopg2
import time

DB_NAME = 'templatedb'
DB_USER = 'template'
DB_HOST = 'ec2-54-84-35-171.compute-1.amazonaws.com'
DB_PORT = 5432
DB_TIME = 240
DB_PASS = 'templatedb'

class Database:
    conn = None

    def __init__(self):
        try:  # connect to postgres
            self.conn = psycopg2.connect(
                dbname=DB_NAME,
                user=DB_USER,
                host=DB_HOST,
                port=DB_PORT,
                password=DB_PASS,
                connect_timeout=DB_TIME
            )
            tm = time.time()
            print('Connected to database: [%s] @ %d seconds' %
                (DB_HOST, time.time() - tm))
        except Exception as e:
            print('Cannot connect to Postgres [%s]' % DB_HOST)
            print(str(e))

    def get_connection(self):
        return self.conn

    def close_connection(self):
        return self.conn.close()