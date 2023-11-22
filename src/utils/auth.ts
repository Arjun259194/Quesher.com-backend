import os from 'os';
export function genRandOtpCode() {
  const CODE_LEN = 6;
  const code = Math.floor(100000 + Math.random() * 900000);
  return Number(code.toString().substring(0, CODE_LEN));
}

export function genVerificationRoute() {
  os.hostname();
}
