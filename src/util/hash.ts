import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

const hash = async (plain: string) => await bcrypt.hash(plain, saltOrRounds);

const compare = async (plain: string, hash: string) =>
  await bcrypt.compare(plain, hash);

export { hash, compare };
