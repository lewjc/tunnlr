const { workerData, parentPort } = require("worker_threads");

workerData;

const spawnProcess = async (remoteHost: string, sshPortString: string[]) => {
  return spawn(`ssh`, [remoteHost, "-t", "-t", ...sshPortString]);
};
