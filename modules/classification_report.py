import pickle
import pandas as pd
import numpy as np
from sklearn import metrics
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import cross_val_score, cross_validate, train_test_split

scoring = ['precision_macro', 'recall_macro', 'f1_macro']

def report_results(X_test, y_test, model):
    y_ = model.predict(X_test)
    report = classification_report(y_test, y_)
    c_matrix = confusion_matrix(y_test, y_,  labels=[1, 0])
    return report, c_matrix

def print_datailed_report(X, y, model, title):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, stratify=y)
    report, c_matrix = report_results(X_test, y_test, model)
    print(f'>>> {title} results')
    print(report)
    print('Confusion matrix')
    print(pd.DataFrame(c_matrix, columns=['T', 'F'], index=['F', 'T']))

def means_report(X, y, model, title):
    try:
        with open(f'./data/{title}-cross-val-results', 'rb') as model_file:
            scores = pickle.load(open(f'./data/{title}-cross-val-results', 'rb'))
    except:
        scores = cross_validate(model, X, y, cv=10, scoring=scoring)
        with open(f'./data/{title}-cross-val-results', 'wb') as model_file:
            model_file.write(pickle.dumps(scores))
    return scores

def print_means_report(X, y, model, title):
    scores = means_report(X, y, model, title)
    print(f'>>> {title} scores')
    print(f'Precisão média: {np.mean(scores["test_precision_macro"])}')
    print(f'Revocação média: {np.mean(scores["test_recall_macro"])}')
    print(f'Média de F1: {np.mean(scores["test_f1_macro"])}\n')
