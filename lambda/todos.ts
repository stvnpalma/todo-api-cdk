export const handler = async (event: any) => {
  console.log("Request event: ", event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Lambda!",
      event,
    }),
  };
};
