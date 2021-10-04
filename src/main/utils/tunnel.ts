// Currently only supports tunneling ports from a remote host to localhost.
export const getSSHPortString = (port: string | number) => ["-L", `${port}:localhost:${port}`];
