require("env-yaml").config();

const test = require("tape");
const sinon = require("sinon");
const { createRequest, createResponse } = require("node-mocks-http");

const { akamaiFastPurge } = require("./index.js");

test("akamaiFastPurge: 400 Error: expected HTTP POST", async (t) => {
  const req = createRequest({
    method: "GET",
    url: "/",
    params: {},
    body: {},
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = createResponse();

  sinon.spy(res, "status");
  sinon.spy(res, "json");

  await akamaiFastPurge(req, res);

  t.doesNotThrow(() => sinon.assert.calledOnceWithExactly(res.status, 400));
  t.doesNotThrow(() =>
    sinon.assert.calledOnceWithExactly(res.json, {
      error: "Error: expected HTTP POST",
    })
  );

  t.end();
});

test(`akamaiFastPurge: 400 Error: Requires "X-Auth" header with Service Key`, async (t) => {
  const req = createRequest({
    method: "POST",
    url: "/",
    params: {},
    body: {},
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = createResponse();

  sinon.spy(res, "status");
  sinon.spy(res, "json");

  await akamaiFastPurge(req, res);

  t.doesNotThrow(() => sinon.assert.calledOnceWithExactly(res.status, 400));
  t.doesNotThrow(() =>
    sinon.assert.calledOnceWithExactly(res.json, {
      error: `Error: Requires "X-Auth" header with Service Key`,
    })
  );

  t.end();
});

test(`akamaiFastPurge: 401 Error: Unauthorized`, async (t) => {
  const req = createRequest({
    method: "POST",
    url: "/",
    params: {},
    body: {},
    headers: {
      "Content-Type": "application/json",
      "X-Auth": "FAIL",
    },
  });
  const res = createResponse();

  sinon.spy(res, "status");
  sinon.spy(res, "json");

  await akamaiFastPurge(req, res);

  t.doesNotThrow(() => sinon.assert.calledOnceWithExactly(res.status, 401));
  t.doesNotThrow(() =>
    sinon.assert.calledOnceWithExactly(res.json, {
      error: `Error: Unauthorized`,
    })
  );

  t.end();
});

test(`akamaiFastPurge: 200 Success`, async (t) => {
  const req = createRequest({
    method: "POST",
    url: "/",
    params: {},
    body: JSON.stringify({
      objects: ["Foo", "Bar"],
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Auth": process.env.SERVICE_KEY,
    },
  });
  const res = createResponse();

  sinon.spy(res, "status");
  sinon.spy(res, "json");

  await akamaiFastPurge(req, res);

  t.doesNotThrow(() => {
    sinon.assert.calledOnceWithExactly(res.status, 200);
  }, "res.status should be called with 200");

  // NOTE: leaving these test case here to document
  // we can not test it as the response body given to the json
  // function is dynamic due to the nature of the akamai response
  // t.doesNotThrow(() =>
  //   sinon.assert.calledOnceWithExactly(res.json, {
  //     error: `Error: Unauthorized`,
  //   })
  // );

  t.end();
});
