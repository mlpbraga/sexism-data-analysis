from datetime import datetime
from nltk import agreement

import pandas as pd

DATAFRAME_PATH = './data/votes_per_user.csv'
VOTE_QUANTITY = [0,1,2,3,4,5,6,7,8,9]
COMMENT_VOTE = {
    'comment_id': [],
    'user_A': [],
    'user_B': [],
    'user_C': [],
    'user_D': [],
    'user_E': [],
    'user_F': [],
    'user_G': [],
    'user_H': [],
    'user_I': [],
    'user_J': []
}

def latex_command_format(name, value):
    return '\\newcommand{\\'+name+'}{'+str(value)+'}'

def percentage(value, total):
    percent =  '%.2F' % ((value/total)*100)
    percent = percent.replace('.', ',')
    return percent + '\\%'

def retrieve_vote_frequency(conn):
    print('Retrieving from original database...')
    vote_frequency = pd.read_sql_query('''
    with count_votes as (select count(v.vote_id) as votes,
       comments.comment_id
    from comments left join votes v on comments.comment_id = v.comment_id
    group by comments.comment_id )

    select count(comment_id), votes from count_votes group by votes order by votes desc;
    ''', conn)
    return vote_frequency

def retrieve_users_from_db(conn):
    print('Retrieving from original database...')
    votes_per_user = pd.read_sql_query('''
    with q as (
            select v.vote_id,
              c.comment_id,
              v.user_id,
              v.gender,
              date_part('year',age(v.birth)) as age,
              c.content,
              v.vote,
              v.avg as label
        from comments c
                join (select v1.comment_id,
                              r.avg,
                              v1.vote_id,
                              v1.serial_id as user_id,
                              v1.user_id as id,
                              v1.vote,
                              v1.gender,
                              v1.birth
                      from (
                            select u.serial_id,v2.vote,v2.vote_id, u.gender,v2.comment_id, u.birth, v2.user_id
                            from votes v2 join ( select ROW_NUMBER() OVER(ORDER BY (SELECT 1)) AS serial_id,* from users) u on v2.user_id = u.username
                          ) v1 join results r on v1.comment_id = r.comment_id) v on c.comment_id = v.comment_id
        )
        select * from q;
        ''', conn)
    return votes_per_user

class Votes:
    def __init__(
        self,
        conn=None,
        remake=False,
        dataframe_path=DATAFRAME_PATH,
        votes_per_user_df=None,
        vote_frequency_df=None,
    ):
        self.votes_per_user = votes_per_user_df
        self.vote_frequency = vote_frequency_df
        vote_frequency_path = dataframe_path.replace('votes_per_user','vote_frequency')
        if votes_per_user_df is None:
            if remake:  
                self.votes_per_user = retrieve_users_from_db(conn)
                self.vote_frequency = retrieve_vote_frequency(conn)
                self.votes_per_user.to_csv(dataframe_path, index=False, sep=';')
                self.vote_frequency.to_csv(vote_frequency_path, index=False, sep=';')
            else:
                try:
                    self.votes_per_user = pd.read_csv(dataframe_path, sep=';')
                    self.vote_frequency = pd.read_csv(vote_frequency_path, sep=';')
                except:
                    self.votes_per_user = retrieve_users_from_db(conn)
                    self.vote_frequency = retrieve_vote_frequency(conn)
                    self.votes_per_user.to_csv(dataframe_path, index=False, sep=';')
                    self.vote_frequency.to_csv(vote_frequency_path, index=False, sep=';')

        self.total = self.votes_per_user.shape[0]
        self.woman_total = self.count_gender_filter('fem')
        self.male_total = self.count_gender_filter('masc')
        self.other_total = self.count_gender_filter('other')
        self.woman_percentage = percentage(self.woman_total,self.total)
        self.male_percentage = percentage(self.male_total,self.total)
        self.other_percentage = percentage(self.other_total,self.total)
        self.count_votes = {}
        self.agreement = {}

        for i in self.vote_frequency['votes'].values:
            self._agreement(i);

    def _agreement(self, vote_qty):
        vote_count = self.votes_per_user.groupby(['comment_id']).agg(['count'])
        keys = list(COMMENT_VOTE.keys())
        keys = keys[:vote_qty+1]
        comment_vote = {}

        for key in keys:
            comment_vote[key] = []


        self.count_votes[vote_qty] = list(
            vote_count['user_id'][vote_count['user_id']['count'] == vote_qty].index)
      
        if self.count_votes[vote_qty] == []:
            self.count_votes[vote_qty] = list(vote_count['user_id'].index)

        for comment in self.count_votes[vote_qty]:
            df = self.votes_per_user[(self.votes_per_user['comment_id']== comment)]
            keys = list(comment_vote.keys())

            for i in range(0, len(keys)):
                import pdb; pdb.set_trace()
                if keys[i] == 'comment_id':
                    comment_vote['comment_id'].append(comment)
                else:
                    comment_vote[keys[i]].append(df.iloc[i-1].vote)
        
        comment_vote = pd.DataFrame(comment_vote)

        keys = list(comment_vote.keys())
        coders = {}
        for i in range(1, len(keys)):
            coders[i] = list(comment_vote[keys[i]])

        formatted_codes = []
        for key in list(coders.keys()):
            formatted_codes = formatted_codes + [[key,i,coders[key][i]] for i in range(len(coders[key]))]
      
        ratingtask = agreement.AnnotationTask(data=formatted_codes)
        
        if vote_qty > 1:
            kappa = ratingtask.multi_kappa()
        else:
            kappa = None
        self.agreement[vote_qty] = {
            'vote_qty': vote_qty,
            'comment_qty': len(self.count_votes[vote_qty]),
            'kappa': kappa,
        }

    def count_gender_filter(self, gender):
        count_users = self.votes_per_user.groupby(['gender'])['vote_id'].count()
        try:
            return count_users[gender]
        except:
            return 0

    def latex_variables(self):
        print(latex_command_format('totalvotes',self.total))
        print(latex_command_format('womanvotes',self.woman_total))
        print(latex_command_format('malevotes',self.male_total))
        print(latex_command_format('othervotes',self.other_total))
        print(latex_command_format('womanvotespercentage',self.woman_percentage))
        print(latex_command_format('malevotespercentage',self.male_percentage))
        print(latex_command_format('othervotespercentage',self.other_percentage))