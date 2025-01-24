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

// suggested usage from prompt

const user = skibidi(async () => {
  await UserModel.findOne((user) => user.id === userId);
}).lowKey((error) => {
  yap("Error finding user", error);
});

// correct usage

// await the results of the call
const user = await skibidi(async () => {
  // return the results
  // use the correct parameter for findOne  
  return await UserModel.findOne({ id: userId });
  }).low((error) => {
    yap("Error finding user", error);
  });

// or using then syntax

skibidi(async () => {
  return await UserModel.findOne({ id: userId });
})
.low((error) => {
  yap("Error finding user", error);
})
.then((user) => {
  console.log("User in .then:", user);
})
.catch((err) => {
  console.error("Unhandled error:", err);
});

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
