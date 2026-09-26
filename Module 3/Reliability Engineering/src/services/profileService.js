const DEFAULT_AVATAR = {
  url: 'https://cdn.aurora-profiles.dev/avatars/default.png',
  initials: '?',
  source: 'fallback',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryable(error) {
  // TODO: retry transient errors only: AbortError, 429, 5xx, or network errors.
  if(error?.name === 'AbortError') {
    return true;
  }
  // Never retry 4xx client errors other than 429.
  if(error?.status === 429) {
    return true;
  }

  if(error?.status >= 500 && error?.status <= 599){
    return true;
  }
  
  if(error?.status === undefined){
    return true;
  }

  return false;
}

async function withTimeout(operation, timeoutMs) {
  // TODO: create AbortController, abort after timeoutMs,
  const controller = new AbortController();

  const timer = setTimeout(()=> {
    controller.abort();
  }, timeoutMs);
  // call operation(controller.signal), always clear timer in finally.
  try {
    return await operation(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry(operation, options = {}) {
  // TODO: maxAttempts defaults to 3.
  const maxAttempts = options.maxAttempts || 3;
  const baseDelayMs =  options.baseDelayMs || 25;

  // Run operation, retry only isRetryable errors.
  for(let attempt=0; attempt<maxAttempts; attempt++){
    try{
      return await operation();
    } catch (error) {
      const lastAttempt = attempt === maxAttempts - 1;

      if(lastAttempt || !isRetryable(error)){
        throw error;
      }
      // Between attempts await sleep(baseDelayMs * 2 ** attempt).
      const delay = baseDelayMs * 2 ** attempt;

      // Throw final error after max attempts or non-retryable error.
      await sleep(delay);
    }
  }
  
}

async function getProfileWithAvatar(authorId, avatarClient, options = {}) {
  const timeoutMs = options.timeoutMs || 200;
  const maxAttempts = options.maxAttempts || 3;
  const baseDelayMs = options.baseDelayMs || 25;

  try {
    // TODO: compose retry around timeout around avatarClient.getAvatar.
    // Return { authorId, avatar, degraded: false } on success.
    const avatar = await withRetry(
      ()=>
        withTimeout(
          signal => avatarClient.getAvatar(authorId, {signal}),
          timeoutMs
        ),
        {
          maxAttempts,
          baseDelayMs
        }
      );
        return{
          authorId,
          avatar,
          degraded: false
        };
  } catch (error) {
    // TODO: return { authorId, avatar: DEFAULT_AVATAR, degraded: true }.
    // Keep fallback local; do not throw for avatar failure.
    if(error?.status === 400){
    return {
      authorId,
      avatar: DEFAULT_AVATAR,
      degraded: true
    };
  }

  return {
    authorId,
    avatar: DEFAULT_AVATAR,
    degraded:true
  }
  }
}

module.exports = {
  DEFAULT_AVATAR,
  sleep,
  isRetryable,
  withTimeout,
  withRetry,
  getProfileWithAvatar,
};