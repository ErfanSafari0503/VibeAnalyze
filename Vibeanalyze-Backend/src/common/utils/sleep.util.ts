/**
 * Helper function to sleep for a given number of seconds
 */
export const sleep = (seconds: number): Promise<void> => new Promise(resolve => setTimeout(resolve, seconds * 1000));
