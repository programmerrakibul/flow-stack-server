import { signInSchema, signUpSchema } from "@/auth/validation/auth";
import prisma from "@/config/prisma";
import { Provider } from "@/generated/prisma/enums";
import password from "@/shared/utils/password";
import { parseOrThrow } from "@/shared/utils/utils";
import { ConflictError, UnauthorizedError } from "http-errors-enhanced";

const signUp = async (payload: unknown) => {
  const { password: inputPassword, ...parsedData } = parseOrThrow(
    signUpSchema,
    payload,
  );
  const hashedPassword = await password.hash(inputPassword);

  if (!parsedData.image) {
    delete parsedData.image;
  }

  const isExist = await prisma.user.findUnique({
    where: {
      email: parsedData.email,
    },
    select: {
      id: true,
    },
  });

  if (isExist) {
    throw new ConflictError("User already exists");
  }

  const res = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        ...parsedData,
        image: parsedData.image as string,
      },
    });

    await tx.account.create({
      data: {
        password: hashedPassword,
        provider: Provider.CREDENTIALS,
        userId: user.id,
      },
    });

    return user;
  });

  return res;
};

const signIn = async (payload: unknown) => {
  const parsedData = parseOrThrow(signInSchema, payload);
  const user = await prisma.user.findUnique({
    where: {
      email: parsedData.email,
    },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (!user.isActive) {
    throw new UnauthorizedError("We've disabled your account");
  }

  const account = await prisma.account.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      password: true,
    },
  });

  if (!account) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isValid = await password.compare(parsedData.password, account.password);

  if (!isValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  return user;
};

const profile = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  if (!user.isActive) {
    throw new UnauthorizedError("We've disabled your account");
  }

  return user;
};

const services = {
  signUp,
  signIn,
  profile,
};

export default services;
