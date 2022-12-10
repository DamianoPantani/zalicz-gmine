import { flatten, ParsedObject } from "../src/utils";

const testData: [string, ParsedObject, string[]][] = [
  ["undefined", { data: { nothing: undefined } }, ["data[nothing]=undefined"]],
  ["false", { prop: { nothing: false } }, ["prop[nothing]=false"]],
  ["undefined", { obj: { something: true } }, ["obj[something]=true"]],
  ["null", { nothing: { nuuu: null } }, ["nothing[nuuu]=null"]],
  ["0", { num: { number: 0 } }, ["num[number]=0"]],
  [
    "numbers",
    { data: { number: 0, other: 2 } },
    ["data[number]=0", "data[other]=2"],
  ],
  [
    "text",
    { data: { text: "plain text" }, other: { something: "text" } },
    ["data[text]=plain text", "other[something]=text"],
  ],
  ["empty object", {}, []],
  ["empty object 2", { data: {} }, []],
  ["empty array", { data: { arr: [] } }, ["data[arr]="]],
  [
    "advanced array",
    {
      data: {
        num: [0, 1, 2, 3],
        text: ["some text", "other"],
        nothing: [null, undefined],
        bool: [false, true],
      },
    },
    [
      "data[num]=0,1,2,3",
      "data[text]=some text,other",
      "data[nothing]=,",
      "data[bool]=false,true",
    ],
  ],
  [
    "advanced object",
    {
      test: null,
      nest: {
        key: "value",
        empty: [],
        otherEmpty: {},
        nestnest: {
          arrayOfStrings: ["string", "text"],
          arrayOfNumbers: [1],
        },
        other: 100,
      },
    },
    [
      "test=null",
      "nest[key]=value",
      "nest[empty]=",
      "nest[nestnest][arrayOfStrings]=string,text",
      "nest[nestnest][arrayOfNumbers]=1",
      "nest[other]=100",
    ],
  ],
];

describe("utils", () => {
  test.each(testData)(
    "should flatten object, case: %s",
    (_testCase, input, expectedOutput) =>
      expect(flatten(input)).toEqual(expectedOutput)
  );
});
