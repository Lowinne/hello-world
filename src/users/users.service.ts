
import { Injectable } from '@nestjs/common';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private users = [
    {
      username: 'boris',
      password: '12345',
      email: 'boris@provider.com',
    },
    {
      username: 'djevy',
      password: '12345',
      email: 'djevy@provider.com',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  public async addOne(
    username: string, 
    password: string,
    email: string,
  ){
    const iv = randomBytes(16);
    const pass = password;
    
    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    
    const textToEncrypt = 'Nest';
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);


    const user = {
      username: username, 
      password: encryptedText.toString,
      email: email,
    }
    
    
  }
}
