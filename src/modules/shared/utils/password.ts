import bcrypt from "bcryptjs";

const hash = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
};

const compare = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

const password = {
  hash,
  compare,
};

export default password;
