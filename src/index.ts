interface User {
  id: number;
  name: string;
}

function printUser(user: User) {
  console.log(`${user.name}`);
}

function main() {
  const user: User = {
    id: 0,
    name: "Alfred",
  };

  printUser(user);
}

main();
