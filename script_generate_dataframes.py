from datetime import datetime

import pandas as pd
import numpy as np

from modules.database_connector import Database
from modules.read_dataframe import Comments
from modules.retrieve_users_data import Users
from modules.retrieve_votes_data import Votes


print('-> Configuring database...')
database = Database()
conn = database.get_connection()
print('-> Database setup is done!')

today = datetime.now().strftime("%d-%m-%Y")
print('-> Generating labeled_comments dataframe...')
comments = Comments(conn, remake=True, dataframe_path=f'./data/{today}_labeled_comments.csv')
print('-> Done!')

print('-> Generating users dataframe...')
users = Users(conn, remake=True, dataframe_path=f'./data/{today}_users_df.csv')
print('-> Done!')

print('-> Generating votes dataframe...')
votes = Votes(conn, remake=True, dataframe_path=f'./data/{today}_votes_per_user.csv')
print('-> Done!')