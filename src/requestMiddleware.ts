// import { fullUrl, request } from 'apis/request'
function isAsyncAction(action) {
  return action && action.actions && action.func;
}

export function createRequestMiddleware() {
  return store => next => action => {
    if (isAsyncAction(action)) {
      const { actions, params, func } = action;
      store.dispatch(actions.request());
      return func
        .apply(null, params)
        .then(res => {
          store.dispatch(actions.success(res));
          return res;
        })
        .catch(err => {
          store.dispatch(actions.failure(err));
          return err;
        });
    }

    return next(action);
  };
}
