import { parse } from "partial-json";

export function extractJsonFromText(text: string): object | object[] {
  const matches = text.match(/[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis);
  return matches.map((m) => parse(m)).flat();
}

export function isValidJson(string: string): boolean {
  try {
    parse(string);
    return true;
  } catch (e) {
    return false;
  }
}
