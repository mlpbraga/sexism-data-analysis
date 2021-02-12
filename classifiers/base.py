import pandas as pd
import numpy as np
import time
from modules.grid_search import grid_search
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.metrics import precision_recall_fscore_support as score

TIME = time.time()
class BaseClassifier:
    def __init__(self, classifier, data_path, nickname):
        self.classifier = classifier
        self.data_path = data_path
        self.nickname = nickname

    def train_models(self, params, features, reload=False):
        self.features = features
        self.model_tf_unigrams, self.cv_tf_unigrams = grid_search(
            f'{self.data_path}/models/tf',
            self.classifier(),
            params,
            f'{self.nickname} with TF of unigrams',
            features.tf_unigrams,
            features.y,
            reload,
        )
        self.model_tf_sexist_unigrams, self.cv_tf_sexist_unigrams = grid_search(
            f'{self.data_path}/models/tf-sexist-unigrams',
            self.classifier(),
            params,
            f'{self.nickname} with TF of 100 sexist unigrams',
            features.tf_sexist_unigrams,
            features.y,
            reload,
        )
        self.model_tf_not_sexist_unigrams, self.cv_tf_not_sexist_unigrams = grid_search(
            f'{self.data_path}/models/tf-not-sexist-unigrams',
            self.classifier(),
            params,
            f'{self.nickname} with TF of 100 not sexist unigrams',
            features.tf_not_sexist_unigrams,
            features.y,
            reload,
        )
        self.model_char_qty, self.cv_char_qty = grid_search(
            f'{self.data_path}/models/char-qty',
            self.classifier(),
            params,
            f'{self.nickname} with Char quantity',
            features.char_qty, features.y,
            reload
        )
        self.model_word_qty, self.cv_word_qty = grid_search(
            f'{self.data_path}/models/word-qty',
            self.classifier(),
            params,
            f'{self.nickname} with Word quantity',
            features.word_qty, features.y,
            reload
        )
        self.model_likes_qty, self.cv_likes_qty = grid_search(
            f'{self.data_path}/models/likes',
            self.classifier(),
            params,
            f'{self.nickname} with Likes quantity',
            features.likes, features.y,
            reload
        )
        self.model_dislikes_qty, self.cv_dislikes_qty = grid_search(
            f'{self.data_path}/models/dislikes',
            self.classifier(),
            params,
            f'{self.nickname} with Dislikes quantity',
            features.dislikes, features.y,
            reload
        )
        self.model_likes_dislikes_qty, self.cv_likes_dislikes_qty = grid_search(
            f'{self.data_path}/models/likes-dislikes',
            self.classifier(),
            params,
            f'{self.nickname} with Likes and Dislikes quantity',
            features.likes_dislikes, features.y,
            reload
        )
        self.model_chars_words_qty, self.cv_chars_words_qty = grid_search(
            f'{self.data_path}/models/chars-words',
            self.classifier(),
            params,
            f'{self.nickname} with Chars and Words quantity',
            features.chars_words_qty, features.y,
            reload
        )
        self.model_likes_dislikes_chars_words_qty, self.cv_likes_dislikes_chars_words_qty = grid_search(
            f'{self.data_path}/models/likes-dislikes-chars-words',
            self.classifier(),
            params,
            f'{self.nickname} with Likes, Dislikes, Chars and Words quantity',
            features.likes_dislike_chars_words, features.y,
            reload
        )
        self.model_tf_bigrams, self.cv_tf_bigrams = grid_search(
            f'{self.data_path}/models/tf-bigrams',
            self.classifier(),
            params,
            f'{self.nickname} with Bigrams TF',
            features.tf_bigrams, features.y,
            reload
        )
        self.model_tf_unigrams_bigrams, self.cv_tf_unigrams_bigrams = grid_search(
            f'{self.data_path}/models/tf_unigrams_bigrams',
            self.classifier(),
            params,
            f'{self.nickname} with Ngrams and Bigrams TFs',
            features.tf_unigrams_bigrams, features.y,
            reload
        )
        self.model_tf_sexist_bigrams, self.cv_tf_sexist_bigrams = grid_search(
            f'{self.data_path}/models/tf-sexist-bigrams',
            self.classifier(),
            params,
            f'{self.nickname} with Sexist Bigrams TFs',
            features.tf_sexist_bigrams, features.y,
            reload
        )
        self.model_tf_not_sexist_bigrams, self.cv_tf_not_sexist_bigrams = grid_search(
            f'{self.data_path}/models/tf-not-sexist-bigrams',
            self.classifier(),
            params,
            f'{self.nickname} with Not Sexist Bigrams TFs',
            features.tf_not_sexist_bigrams, features.y,
            reload
        )
        self.model_tf_unigrams_likes_dislikes_chars_words, self.cv_tf_unigrams_likes_dislikes_chars_words = grid_search(
            f'{self.data_path}/models/tf-unigrams_likes_dislikes_chars_words-model',
            self.classifier(),
            params,
            f'{self.nickname} with Unigrams TFs, Likes, Dislikes, Chars and Words quantity',
            features.tf_unigrams_likes_dislikes_chars_words, features.y,
            reload
        )

    def report_results(self, features):
        self.report_tf_unigrams = self.cross_validation_report(features.tf_unigrams,
                                                               features.y,
                                                               self.cv_tf_unigrams,
                                                               self.model_tf_unigrams,
                                                               f'{self.nickname} with Unigrams TFs')
        self.print_report(self.report_tf_unigrams)

        self.report_tf_sexist_unigrams = self.cross_validation_report(features.tf_sexist_unigrams,
                                                                      features.y,
                                                                      self.cv_tf_sexist_unigrams,
                                                                      self.model_tf_sexist_unigrams,
                                                                      f'{self.nickname} with TF to 100 sexist unigrams')
        self.print_report(self.report_tf_sexist_unigrams)

        self.report_tf_not_sexist_unigrams = self.cross_validation_report(features.tf_not_sexist_unigrams,
                                                                          features.y,
                                                                          self.cv_tf_not_sexist_unigrams,
                                                                          self.model_tf_not_sexist_unigrams,
                                                                          f'{self.nickname} with TF to 100 not sexist unigrams')
        self.print_report(self.report_tf_not_sexist_unigrams)

        self.report_chars = self.cross_validation_report(features.char_qty,
                                                         features.y,
                                                         self.cv_char_qty,
                                                         self.model_char_qty,
                                                         f'{self.nickname} with Char quantity')
        self.print_report(self.report_chars)

        self.report_words = self.cross_validation_report(features.word_qty,
                                                         features.y,
                                                         self.cv_word_qty,
                                                         self.model_word_qty,
                                                         f'{self.nickname} with Word quantity')
        self.print_report(self.report_words)

        self.report_chars_words = self.cross_validation_report(features.chars_words_qty,
                                                               features.y,
                                                               self.cv_chars_words_qty,
                                                               self.model_chars_words_qty,
                                                               f'{self.nickname} with Char and Word quantity')
        self.print_report(self.report_chars_words)

        self.report_likes = self.cross_validation_report(features.likes,
                                                         features.y,
                                                         self.cv_likes_qty,
                                                         self.model_likes_qty,
                                                         f'{self.nickname} with Likes quantity')
        self.print_report(self.report_likes)

        self.report_dislikes = self.cross_validation_report(features.dislikes,
                                                            features.y,
                                                            self.cv_dislikes_qty,
                                                            self.model_dislikes_qty,
                                                            f'{self.nickname} with Disikes quantity')
        self.print_report(self.report_dislikes)

        self.report_likes_dislikes = self.cross_validation_report(features.likes_dislikes,
                                                                  features.y,
                                                                  self.cv_likes_dislikes_qty,
                                                                  self.model_likes_dislikes_qty,
                                                                  f'{self.nickname} with Likes and Disikes quantity')
        self.print_report(self.report_likes_dislikes)

        self.report_likes_dislikes_chars_words = self.cross_validation_report(features.likes_dislike_chars_words,
                                                                              features.y,
                                                                              self.cv_likes_dislikes_chars_words_qty,
                                                                              self.model_likes_dislikes_chars_words_qty,
                                                                              f'{self.nickname} with Likes, Dislikes, Char and Word quantity')
        self.print_report(self.report_likes_dislikes_chars_words)

        self.report_tf_bigrams = self.cross_validation_report(features.tf_bigrams,
                                                             features.y,
                                                             self.cv_tf_bigrams,
                                                             self.model_tf_bigrams,
                                                             f'{self.nickname} with Bigrams TFs')
        self.print_report(self.report_tf_bigrams)

        self.report_tf_sexist_bigrams = self.cross_validation_report(features.tf_sexist_bigrams,
                                                                    features.y,
                                                                    self.cv_tf_sexist_bigrams,
                                                                    self.model_tf_sexist_bigrams,
                                                                    f'{self.nickname} with Seixst Bigrams TFs')
        self.print_report(self.report_tf_sexist_bigrams)

        self.report_tf_not_sexist_bigrams = self.cross_validation_report(features.tf_not_sexist_bigrams,
                                                                        features.y,
                                                                        self.cv_tf_not_sexist_bigrams,
                                                                        self.model_tf_not_sexist_bigrams,
                                                                        f'{self.nickname} with Not Sexist Bigrams TFs')
        self.print_report(self.report_tf_not_sexist_bigrams)

        self.report_tf_unigrams_bigrams = self.cross_validation_report(features.tf_unigrams_bigrams,
                                                                    features.y,
                                                                    self.cv_tf_unigrams_bigrams,
                                                                    self.model_tf_unigrams_bigrams,
                                                                    f'{self.nickname} with Ngrams and Bigrams TFs')
        self.print_report(self.report_tf_unigrams_bigrams)

        self.report_tf_unigrams_likes_dislikes_chars_words = self.cross_validation_report(features.tf_unigrams_likes_dislikes_chars_words,
                                                                    features.y,
                                                                    self.cv_tf_unigrams_likes_dislikes_chars_words,
                                                                    self.model_tf_unigrams_likes_dislikes_chars_words,
                                                                    f'{self.nickname} with Unigrams TFs, Likes, Dislikes, Char and Word quantity')
        self.print_report(self.report_tf_unigrams_likes_dislikes_chars_words)


    def cross_validation_report(self, X, y, cv, model, title):
        report = {
            'precision': {'1': [], '0': []},
            'recall': {'1': [], '0': []},
            'f1': {'1': [], '0': []},
            'confusion_matrix': None}

        for train_index, test_index in cv.split(X, y):
            X_train, X_test = X.loc[train_index], X.loc[test_index]
            y_train, y_test = y.loc[train_index], y.loc[test_index]
            y_ = model.predict(X_test)
            precision, recall, fscore, _ = score(
                y_test, y_, average=None, labels=[1, 0])
            report['title'] = title
            report['precision']['1'].append(precision[0])
            report['recall']['1'].append(recall[0])
            report['f1']['1'].append(fscore[0])
            report['precision']['0'].append(precision[1])
            report['recall']['0'].append(recall[1])
            report['f1']['0'].append(fscore[1])
            c_matrix = confusion_matrix(y_test, y_,  labels=[1, 0])
            report['confusion_matrix'] = pd.DataFrame(
                c_matrix, columns=['T', 'F'], index=['T', 'F'])

        nickname = ''
        if 'SVM' in title:
            nickname = 'svm'
        elif 'KNN' in title:
            nickname = 'knn'
        elif 'RFC' in title:
            nickname = 'rfc'   

        with open(f'./data/{nickname}/reports/results_{TIME}.txt', 'a') as fp:
            result_line = '{%.5f}&{%.5f}&{%.5f}&{%.5f}&{%.5f}&{%.5f} \\\\\n' % (np.mean(report["precision"]["1"]),
                                                                         np.mean(report["precision"]["0"]),
                                                                         np.mean(report["recall"]["1"]),
                                                                         np.mean(report["recall"]["0"]),
                                                                         np.mean(report["f1"]["1"]),
                                                                         np.mean(report["f1"]["0"]))
            fp.write(result_line)

        return report

    def print_report(self, report):
        print(f'>>>> {report["title"]} results')
        print('\t\t sexist \t not-sexist')
        print('precision\t %.5f \t %.5f' % (
            np.mean(report["precision"]["1"]), np.mean(report["precision"]["0"])))
        print('recall\t\t %.5f \t %.5f' %
              (np.mean(report["recall"]["1"]), np.mean(report["recall"]["0"])))
        print('f1\t\t %.5f \t %.5f' %
              (np.mean(report["f1"]["1"]), np.mean(report["f1"]["0"])))
        print('')