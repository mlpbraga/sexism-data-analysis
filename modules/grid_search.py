import time
import numpy as np
import pickle
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.model_selection import GridSearchCV

cv = StratifiedShuffleSplit(n_splits=10, test_size=0.2, random_state=42)


def grid_search(file_path, method, params, method_name, X_, y, reload=False):
    tm = time.time()

    if reload:
        # print('Executing Grid Search to %s.' % method_name)
        model = GridSearchCV(method,
                             param_grid=params,
                             cv=cv, n_jobs=12)
        model.fit(X_, y)
        pickle.dump(model, open(file_path, 'wb'))
    else:
        try:
            print('Reading %s. Model' % method_name)
            model = pickle.load(open(file_path, 'rb'))
        except:
            print('Executing Grid Search to %s.' % method_name)
            model = GridSearchCV(method,
                                 param_grid=params,
                                 cv=cv, n_jobs=12)
            model.fit(X_, y)
            pickle.dump(model, open(file_path, 'wb'))

    # print('Model loaded in: @ %d seconds' %
        #   (time.time() - tm))
    # print("The best parameters are %s with a score of %0.2f" %
    #       (model.best_params_, model.best_score_))
    print('-------------------------------------------------------------------------------------------')
    return model, cv
