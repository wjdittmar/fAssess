function ski(fn) {
  return {
    // the object that is returned defines a chainable method
    // call the function passed in to lowKey and pass it the error
    async low(onError) {
      try {
        // will convert a synchronous function to a returned promise
        return await fn();
      } catch (err) {
        onError(err);
        return undefined;
      }
    },
  };
}

function yap(message, error) {
  console.error(`${message}`, error);
}

// sample distributed version
import axios from "axios";

export async function yap(message, error) {
  const logPayload = {
    timestamp: new Date().toISOString(),
    level: "error",
    message,
    error: serializeError(error),
    hostname: process.env.HOSTNAME,
    environment: process.env.NODE_ENV,
  };

  try {
    await axios.post(process.env.LOGGING_SERVICE_URL, logPayload);
  } catch (err) {
    console.error("[yap] Failed to send log:", err);
    console.error("[yap] Original log:", logPayload);
  }
}

// javascript error properties are non-enumerable (not created with property initializer or simple assignment) so don't serialize
function serializeError(error) {
  if (!error) return null;

  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
    };
  }

  return error;
}
