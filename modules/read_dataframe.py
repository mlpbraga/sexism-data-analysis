import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

DATAFRAME_PATH = './data/labeled-comments.csv'
TF_QUANTITY = 100


def get_vocabulary(df):
    count_vectorizer = CountVectorizer(lowercase=False, stop_words=[])
    cv_fit = count_vectorizer.fit_transform(df['content'])
    word_list = count_vectorizer.get_feature_names()
    frequecy_array = cv_fit.toarray()
    count_list = frequecy_array.sum(axis=0)
    vocabulary = (dict(zip(word_list, count_list)))
    return vocabulary, frequecy_array, word_list


def get_bigrams(df):
    count_vectorizer = CountVectorizer(
        lowercase=False, stop_words=[], ngram_range=(2, 2))
    cv_fit = count_vectorizer.fit_transform(df['content'])
    word_list = count_vectorizer.get_feature_names()
    frequecy_array = cv_fit.toarray()
    count_list = frequecy_array.sum(axis=0)
    vocabulary = (dict(zip(word_list, count_list)))
    return vocabulary, frequecy_array, word_list


def get_doc(df, chosen_words):
    return df['content'].apply(lambda y: ' '.join(
        [x for x in y.split() if x in chosen_words]))


def get_bigram_doc(df, chosen_words):
    def select_only_relevant_bigrams(text):
        bigrams_in_text = [b for l in [text]
                           for b in zip(l.split(" ")[:-1], l.split(" ")[1:])]
        return ' '.join([' '.join(w) for w in bigrams_in_text if ' '.join(w) in chosen_words])
    return df['content'].apply(select_only_relevant_bigrams)


def get_relevant_words(df):
    return list(df.sort_values(
        by=['diff'], ascending=False)['word'])


class Comments:
    def __init__(self, conn=None):
        try:
            labeled_comments = pd.read_csv(DATAFRAME_PATH)
        except:
            print('Retrieving from original database...')
            labeled_comments = pd.read_sql_query(
                'select * from results;', conn)
            labeled_comments['label'] = labeled_comments['avg'].apply(
                lambda x: 1 if x > 0.5 else 0 if x < 0.5 else -1)
            labeled_comments['char-qty'] = labeled_comments['content'].apply(
                lambda comment: len(comment))
            labeled_comments['word-qty'] = labeled_comments['content'].apply(
                lambda comment: len(comment.lower().split(' ')))
            labeled_comments.to_csv(DATAFRAME_PATH, index=False)

        self.labeled_comments = labeled_comments
        self.sexist_comments = labeled_comments[labeled_comments['avg'] > 0.5]
        self.not_sexist_comments = labeled_comments[labeled_comments['avg'] < 0.5]
        self.undefined_comments = labeled_comments[labeled_comments['avg'] == 0.5]

        self._set_vocabularies()
        self._set_word_frequencies()
        self._set_bigrams_frequencies()
        self._set_tf()
        self._set_feature_dataframe()

    def _set_vocabularies(self):
        self.vocabulary, self.freq, self.word_list = get_vocabulary(
            self.labeled_comments)
        self.sexist_vocabulary, self.sexist_frequency_array, self.sexist_word_list = get_vocabulary(
            self.sexist_comments)
        self.not_sexist_vocabulary, self.not_sexist_frequency_array, self.not_sexist_word_list = get_vocabulary(
            self.not_sexist_comments)
        self.undefined_vocabulary, self.undefined_frequency_array, self.undefined_word_list = get_vocabulary(
            self.undefined_comments)

        self.bigrams, self.freq, self.word_list = get_bigrams(
            self.labeled_comments)
        self.sexist_bigrams, self.sexist_frequency_array, self.sexist_word_list = get_bigrams(
            self.sexist_comments)
        self.not_sexist_bigrams, self.not_sexist_frequency_array, self.not_sexist_word_list = get_bigrams(
            self.not_sexist_comments)
        self.undefined_bigrams, self.undefined_frequency_array, self.undefined_word_list = get_bigrams(
            self.undefined_comments)

    def _set_bigrams_frequencies(self):
        word_freq = {
            'word': [],
            'sexist-freq': [],
            'not-sexist-freq': [],
            'undefined-freq': [],
            'diff': []
        }

        # select words that are in bolth vocabularies
        list_sexist_sorted_terms = []
        for key, value in sorted(self.sexist_bigrams.items(), key=lambda item: item[1]):
            list_sexist_sorted_terms.append(key)

        shared_words = []

        for word in list_sexist_sorted_terms:
            if word in self.not_sexist_bigrams.keys():
                shared_words.append(word)

        for word in shared_words:
            word_freq['word'].append(word)
            if word in self.sexist_bigrams.keys():
                word_freq['sexist-freq'].append(self.sexist_bigrams[word])
            else:
                word_freq['sexist-freq'].append(0)
            if word in self.sexist_bigrams.keys():
                word_freq['not-sexist-freq'].append(
                    self.not_sexist_bigrams[word])
            else:
                word_freq['not-sexist-freq'].append(0)
            if word in self.undefined_bigrams.keys():
                word_freq['undefined-freq'].append(
                    self.undefined_bigrams[word])
            else:
                word_freq['undefined-freq'].append(0)
            word_freq['diff'] = self.sexist_bigrams[word] - \
                self.not_sexist_bigrams[word]

        word_freq = pd.DataFrame(word_freq)

        # normalizind frequencies
        sum_sexist = sum(word_freq['sexist-freq'])
        word_freq['sexist-freq'] = word_freq['sexist-freq'].apply(
            lambda x: x/sum_sexist)
        sum_not_sexist = sum(word_freq['not-sexist-freq'])
        word_freq['not-sexist-freq'] = word_freq['not-sexist-freq'].apply(
            lambda x: x/sum_not_sexist)
        undefined_sexist = sum(word_freq['undefined-freq'])
        word_freq['undefined-freq'] = word_freq['undefined-freq'].apply(
            lambda x: x/undefined_sexist)
        word_freq['diff'] = word_freq['sexist-freq'] - \
            word_freq['not-sexist-freq']

        sexist_words = word_freq[word_freq['diff'] > 0]
        not_sexist_words = word_freq[word_freq['diff'] < 0]

        # most relevant words to sexist comments
        self.sexist_bigrams = sexist_words.sort_values(
            by='diff', ascending=False)

        # most relevant words to not sexist comments
        self.not_sexist_bigrams = not_sexist_words.sort_values(
            by='diff', ascending=True)

    def _set_word_frequencies(self):
        word_freq = {
            'word': [],
            'sexist-freq': [],
            'not-sexist-freq': [],
            'undefined-freq': [],
            'diff': []
        }

        # select words that are in bolth vocabularies
        list_sexist_sorted_terms = []
        for key, value in sorted(self.sexist_vocabulary.items(), key=lambda item: item[1]):
            list_sexist_sorted_terms.append(key)

        shared_words = []

        for word in list_sexist_sorted_terms:
            if word in self.not_sexist_vocabulary.keys():
                shared_words.append(word)

        for word in shared_words:
            word_freq['word'].append(word)
            if word in self.sexist_vocabulary.keys():
                word_freq['sexist-freq'].append(self.sexist_vocabulary[word])
            else:
                word_freq['sexist-freq'].append(0)
            if word in self.sexist_vocabulary.keys():
                word_freq['not-sexist-freq'].append(
                    self.not_sexist_vocabulary[word])
            else:
                word_freq['not-sexist-freq'].append(0)
            if word in self.undefined_vocabulary.keys():
                word_freq['undefined-freq'].append(
                    self.undefined_vocabulary[word])
            else:
                word_freq['undefined-freq'].append(0)
            word_freq['diff'] = self.sexist_vocabulary[word] - \
                self.not_sexist_vocabulary[word]

        word_freq = pd.DataFrame(word_freq)

        # normalizind frequencies
        sum_sexist = sum(word_freq['sexist-freq'])
        word_freq['sexist-freq'] = word_freq['sexist-freq'].apply(
            lambda x: x/sum_sexist)
        sum_not_sexist = sum(word_freq['not-sexist-freq'])
        word_freq['not-sexist-freq'] = word_freq['not-sexist-freq'].apply(
            lambda x: x/sum_not_sexist)
        undefined_sexist = sum(word_freq['undefined-freq'])
        word_freq['undefined-freq'] = word_freq['undefined-freq'].apply(
            lambda x: x/undefined_sexist)
        word_freq['diff'] = word_freq['sexist-freq'] - \
            word_freq['not-sexist-freq']

        sexist_words = word_freq[word_freq['diff'] > 0]
        not_sexist_words = word_freq[word_freq['diff'] < 0]

        # most relevant words to sexist comments
        self.sexist_words = sexist_words.sort_values(
            by='diff', ascending=False)

        # most relevant words to not sexist comments
        self.not_sexist_words = not_sexist_words.sort_values(
            by='diff', ascending=True)

    def _set_tf(self):
        sexist_vectorizer = TfidfVectorizer(
            stop_words=[],
            use_idf=False,
            norm=None,
            decode_error='replace',
            max_features=100,
        )
        not_sexist_vectorizer = TfidfVectorizer(
            stop_words=[],
            use_idf=False,
            decode_error='replace',
            max_features=100,
        )
        sexist_bigrams_vectorizer = TfidfVectorizer(
            stop_words=[],
            use_idf=False,
            ngram_range=(2, 2),
            decode_error='replace',
            max_features=100,
        )
        not_sexist_bigrams_vectorizer = TfidfVectorizer(
            stop_words=[],
            use_idf=False,
            ngram_range=(2, 2),
            decode_error='replace',
            max_features=100,
        )

        relevant_sexist_words = get_relevant_words(self.sexist_words)
        relevant_not_sexist_words = get_relevant_words(
            self.not_sexist_words)

        relevant_sexist_bigrams = get_relevant_words(self.sexist_bigrams)
        relevant_not_sexist_bigrams = get_relevant_words(
            self.not_sexist_bigrams)

        # tf sexist words in doc
        sexist_doc = get_doc(self.sexist_comments,
                             relevant_sexist_words)
        not_sexist_doc = get_doc(
            self.not_sexist_comments, relevant_sexist_words)
        sexist_tf = pd.DataFrame(
            sexist_vectorizer.fit_transform(sexist_doc).toarray())
        not_sexist_tf = pd.DataFrame(
            not_sexist_vectorizer.fit_transform(not_sexist_doc).toarray())
        self.tf_sexist_dataframe = pd.concat(
            [sexist_tf, not_sexist_tf]).fillna(0)

        sexist_doc = get_bigram_doc(self.sexist_comments,
                             relevant_sexist_bigrams)
        not_sexist_doc = get_bigram_doc(
            self.not_sexist_comments, relevant_not_sexist_bigrams)
        sexist_bigrams_tf = pd.DataFrame(
            sexist_bigrams_vectorizer.fit_transform(sexist_doc).toarray())
        not_sexist_bigrams_tf = pd.DataFrame(
            not_sexist_bigrams_vectorizer.fit_transform(not_sexist_doc).toarray())
        self.tf_sexist_bigrams_dataframe = pd.concat(
            [sexist_bigrams_tf, not_sexist_bigrams_tf]).fillna(0)

        # tf not sexist words in doc
        sexist_doc = get_doc(self.sexist_comments,
                             relevant_not_sexist_words)
        not_sexist_doc = get_doc(
            self.not_sexist_comments, relevant_not_sexist_words)
        sexist_tf = pd.DataFrame(
            sexist_vectorizer.fit_transform(sexist_doc).toarray())
        not_sexist_tf = pd.DataFrame(
            not_sexist_vectorizer.fit_transform(not_sexist_doc).toarray())
        self.tf_not_sexist_dataframe = pd.concat(
            [sexist_tf, not_sexist_tf]).fillna(0)

        sexist_doc = get_bigram_doc(self.sexist_comments,
                                    relevant_sexist_bigrams)
        not_sexist_doc = get_bigram_doc(
            self.not_sexist_comments, relevant_not_sexist_bigrams)
        sexist_bigrams_tf = pd.DataFrame(
            sexist_bigrams_vectorizer.fit_transform(sexist_doc).toarray())
        not_sexist_bigrams_tf = pd.DataFrame(
            not_sexist_bigrams_vectorizer.fit_transform(not_sexist_doc).toarray())
        self.tf_not_sexist_bigrams_dataframe = pd.concat(
            [sexist_bigrams_tf, not_sexist_bigrams_tf]).fillna(0)

    def _set_feature_dataframe(self):
        try:
            print('...')
            self.dataframe = pd.read_csv('./data/dataframe.csv')
        except:
            print('---')

            likes_df = np.array(
                pd.concat([self.sexist_comments['likes'], self.not_sexist_comments['likes']]).fillna(0))
            dislikes_df = np.array(pd.concat(
                [self.sexist_comments['dislikes'], self.not_sexist_comments['dislikes']]).fillna(0))
            char_qty_df = np.array(pd.concat(
                [self.sexist_comments['char-qty'], self.not_sexist_comments['char-qty']]).fillna(0))
            word_qty_df = np.array(pd.concat(
                [self.sexist_comments['word-qty'], self.not_sexist_comments['word-qty']]).fillna(0))
            sexist_y = self.sexist_comments['avg'].apply(lambda x: 1)
            not_sexist_y = self.not_sexist_comments['avg'].apply(lambda x: 0)
            y_df = np.array(pd.concat([sexist_y, not_sexist_y]))

            tf_dataframe = pd.concat(
                [self.tf_sexist_dataframe,
                 self.tf_not_sexist_dataframe,
                 self.tf_sexist_bigrams_dataframe,
                 self.tf_not_sexist_bigrams_dataframe], axis=1)
            dataframe = tf_dataframe
            dataframe['likes'] = likes_df
            dataframe['dislikes'] = dislikes_df
            dataframe['char-qty'] = char_qty_df
            dataframe['word-qty'] = word_qty_df
            dataframe['sexist'] = y_df
            dataframe = dataframe.fillna(0)
            dataframe = tf_dataframe.sample(frac=1)
            dataframe.to_csv('./data/dataframe.csv', index=False)
            self.dataframe = dataframe

    def print_frequecies_to_latex(self, type, limit=None):
        swicth = {
            'sexist-words': self.sexist_words,
            'sw': self.sexist_words,
            'not-sexist-words': self.not_sexist_words,
            'nsw': self.not_sexist_words,
            'sexist-bigrams': self.sexist_bigrams,
            'sb': self.sexist_bigrams,
            'not-sexist-bigrams': self.not_sexist_bigrams,
            'nsb': self.not_sexist_bigrams,
        }
        chosen = swicth[type]
        if limit is not None:
            chosen = chosen.head(limit)
        for i, r in chosen.iterrows():
            print("{%s} & {%0.6f} & {%0.6f} & {%0.6f}\\\\" %
                  (r['word'], r['sexist-freq'], r['not-sexist-freq'], r['diff']))
