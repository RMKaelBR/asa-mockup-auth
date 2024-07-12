import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async() => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = ({ id: Math.floor(Math.random() * 9999), email, password} as User)
        users.push(user);
        return Promise.resolve(user)
      }
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();
    service = module.get(AuthService)
  })

  it('can create an instance of auth serivce', async () => {
    expect(service).toBeDefined();
  })

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('emailadd@email.com', 'emailpassword');

    expect(user.password).not.toEqual('emailpassword');
    const[salt, hash] = user.password.split('.')
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it('throws an error if user signs up with email that is in use', async() => {
    await service.signup('emailname@email.com', 'emailpassword');
    await expect(service.signup('emailname@email.com', 'emailpassword')).rejects.toThrow(BadRequestException)
  })

  it ('throws an error if signin is called with an unused email', async() => {
    await expect(service.signin('thisisunused@mail.com', 'password')).rejects.toThrow(NotFoundException)
  })

  it ('throws if an invalid password is given', async () => {
    await service.signup('user@email.com', 'correctpassowrd')
    await expect(service.signin('user@email.com', 'WRONGpassword')).rejects.toThrow(BadRequestException)
  })

  it ('returns a user if the password provided is correct', async () => {
    await service.signup('user@email.com', 'correctpassword')

    const user = await service.signin('user@email.com', 'correctpassword')
    expect(user).toBeDefined();
  })
})



